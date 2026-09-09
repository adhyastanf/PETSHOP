# Oyen — Architecture Hardening Decisions

**Status:** Canonical architecture decisions and future-phase requirements.
**Origin:** 15-area Architecture Hardening audit performed after the Business
Configuration foundation.

This document records decisions that must be honored by future implementation.
It distinguishes:

- **IMPLEMENTED** — exists in code today.
- **ARCHITECTURALLY DEFINED** — the canonical rule is fixed here; consuming code
  is not built yet.
- **FUTURE PHASE** — belongs to a roadmap phase that is not yet implemented.

Nothing in this document authorizes implementing a future domain early. It
defines the rules those domains must follow when their phase arrives.

---

## Audit summary (status at time of writing)

Implemented business domains: Auth, Customer, Pet, Merchant, Business
Configuration foundation. Finance, Checkout, Order, Payment processing,
Settlement, Withdrawal, COD recovery, Booking, Shipping, Promotions, and
Notification workflows are **not implemented** (some have JPA entities/tables
only). JPA entities alone do not constitute an implemented domain.

---

## 1. Multi-Merchant Order Structure (ARCHITECTURALLY DEFINED — Phase 8/10)

A cart may contain items from multiple merchants and both products and services.
The canonical structure future implementation MUST follow:

```text
Checkout (aggregation boundary, one customer payment attempt set)
 ├── Order (per merchant + fulfillment branch)   — products
 │     └── OrderItem*
 ├── Order (per other merchant/branch)            — products
 └── Booking (per service item)                   — services
```

- `Checkout` is the single payment aggregation boundary (one grand total, 1..N
  payment attempts). It owns customer-level totals only.
- Products are split into one `Order` **per merchant + fulfillment branch**.
  Services become independent `Booking`s. Never merge orders and bookings.
- Merchant-specific concerns — order lifecycle, shipping, commission,
  settlement, COD, cancellation, refund, merchant visibility — attach to the
  per-merchant `Order`/`Booking`, never to the parent `Checkout`.
- Each child order/booking resolves and **snapshots** its own commission (see §3).
- Cross-merchant isolation: a merchant may only read/act on its own child
  orders/bookings; the parent checkout is customer-scoped.

This parent-checkout + per-merchant-child-order model is the canonical decision.
Do not implement a flat single-order-per-checkout model.

---

## 2. Financial Ledger Invariants (FUTURE PHASE — Phase 13)

The ledger does not exist yet (only `merchant_ledger_entries` table + entity).
When implemented it MUST satisfy:

- **Immutable**: ledger rows are append-only; corrections use compensating
  entries, never updates/deletes. No `deleted_at` on ledger.
- **Exactly-once posting**: each financial event posts once, guarded by a unique
  key (source type + source id + entry type).
- **Idempotent processing**: replays (webhook/settlement retries) never
  double-post.
- **Historical immutability**: posted amounts never change when configuration or
  rules change later.
- **Balance consistency**: merchant balances derive from ledger entries and must
  reconcile; balances are never mutated independently of the ledger.
- **No duplicate settlements / withdrawals**: enforced by state + unique
  constraints.
- **Refunds** create correct compensating movements.
- Supported entry types: sales, commission, refund, settlement, withdrawal,
  adjustment, **COD commission accrual**, **COD commission recovery**.

### Current transaction commission vs historical COD outstanding/recovery

These are **separate, independently auditable** ledger events:

- *Current-transaction commission*: the 4% (or applicable rule) commission on the
  order/booking being settled now.
- *Historical COD outstanding / recovery*: previously accrued COD commission the
  merchant owes, recovered from a later eligible Oyen-controlled settlement —
  partial recovery allowed, payout never negative, unrecovered debt carries
  forward. (See `BUSINESS_RULES.md` BR-COD-*.)

Do not implement `FinanceService`/`SettlementService` to satisfy this section.

---

## 3. Commission Snapshot Semantics (ARCHITECTURALLY DEFINED — Phase 10/13)

- Commission is resolved via `CommissionRuleService.resolveApplicable(context)` /
  `CommissionRuleResolver` (implemented today). Resolution is deterministic:
  scope specificity MERCHANT > CATEGORY > GLOBAL, then priority, then effective
  date, then stable id.
- `default_commission_percentage` (system config) is a **fallback only**;
  `commission_rules` is authoritative. Do not add a second commission
  calculation path.
- When a future order/booking is created (or first settled), the resolved
  commission rate/type/rule id and the computed amount MUST be **snapshotted**
  onto the transaction's financial record.
- Changing a `CommissionRule` afterward MUST NOT retroactively alter historical
  orders, bookings, commission amounts, ledger entries, COD accruals, or
  settlements.

---

## 4. COD Commission Accrual / Recovery (ARCHITECTURALLY DEFINED — Phase 9/13)

Canonical model (see `FEATURE_KNOWLEDGE.md` §36 and `BUSINESS_RULES.md` BR-COD-*):

- COD is merchant-collected; Oyen does not receive COD funds. COD is not a
  provider-collected payment and does not trigger a provider settlement.
- The applicable commission is still owed and is accrued as an outstanding
  merchant commission payable in the ledger (not a separate debt subsystem).
- Outstanding COD commission is recovered from future eligible Oyen-controlled
  payment-gateway settlements: partial recovery allowed; payout never negative;
  remainder carries forward; current commission and recovery remain separately
  auditable; recovery is idempotent.

---

## 5. Money / Decimal / Rounding Policy (ARCHITECTURALLY DEFINED)

- **Currency:** IDR.
- **Type:** `BigDecimal` in Java, PostgreSQL `NUMERIC`. Never `double`/`float`
  for money. (Audit confirmed no monetary `double`/`float` exists today.)
- **Scale:** monetary amounts `NUMERIC(19,2)` (2 dp). Commission rule values
  `NUMERIC(19,4)` to hold precise percentages/rates.
- **Rounding:** `RoundingMode.HALF_UP` for money results, applied once at the
  final monetary amount (e.g. computed commission, fee, payout), not on
  intermediate factors.
- **Percentages:** commission percentage in [0, 100]; `amount * pct / 100` then
  round HALF_UP to 2 dp.
- **Authority:** backend is authoritative for every monetary value; the frontend
  never computes commission, fees, totals, balances, or payouts.

Future financial services MUST reuse this single policy.

---

## 6. Timezone Policy (ARCHITECTURALLY DEFINED; minor FIX documented)

- **Absolute machine timestamps:** `Instant` / PostgreSQL `TIMESTAMPTZ`, stored
  in UTC. This is the default for created/updated/effective timestamps.
- **Calendar/business-day values:** `LocalDate`/`LocalTime` only for
  human-calendar concepts (business hours, join date); when "today" matters for
  a business rule, compute against `ZoneId.of("Asia/Jakarta")` explicitly rather
  than the JVM default zone.
- Avoid `LocalDateTime.now()` and implicit system-default-zone conversions for
  business logic.
- Future timezone-sensitive areas: configuration effective dates, payment
  expiration, booking slots, cancellation windows, settlement, withdrawal,
  reminders, scheduled jobs — all must use `Instant`/`TIMESTAMPTZ` for the
  absolute instant and an explicit `Asia/Jakarta` zone where a local calendar
  boundary is part of the rule.

Minor current usage: `StaffServiceImpl` sets `joinedAt = LocalDate.now()` (JVM
default zone). Low risk (a record-keeping date). Documented; align to
`LocalDate.now(ZoneId.of("Asia/Jakarta"))` when that area is next touched.

---

## 7. Event vs Transactional Side Effects (ARCHITECTURALLY DEFINED — future)

- **Strongly-consistent financial/inventory operations** (ledger posting,
  balance changes, settlement, withdrawal, stock finalization) run inside the
  same database transaction as the state change. They are never deferred to
  best-effort events.
- **Secondary side effects** (notifications, emails, analytics, denormalized
  read models) are decoupled via Spring `ApplicationEventPublisher` +
  `@TransactionalEventListener(phase = AFTER_COMMIT)`.
- Canonical future events: `PaymentSucceeded`, `OrderPaid`, `OrderCompleted`,
  `OrderCancelled`, `BookingCompleted`, `RefundCompleted`, `SettlementCreated`,
  `WithdrawalRequested`.
- Do NOT introduce Kafka/RabbitMQ/Redis. If durable async is later required,
  introduce a DB outbox before external messaging.

---

## 8. Idempotency Requirements (ARCHITECTURALLY DEFINED — future)

Current mutations are simple CRUD; merchant application already guards
duplicates. When implemented, these operations MUST be idempotent using an
appropriate combination of idempotency key, DB unique constraint, external
provider/event id, transaction boundary, and state validation:

- checkout finalization, payment webhook, order creation, booking creation,
  inventory reservation/finalization, ledger posting, settlement, withdrawal,
  refund.

`integration_webhook_events (provider, external_event_id)` unique already exists
in the schema to support webhook dedup.

---

## 9. Data Retention / Soft-Delete Categories (ARCHITECTURALLY DEFINED)

Classify entities as one of:

- **IMMUTABLE_HISTORY** (append-only, never soft/hard deleted): `audit_logs`,
  `merchant_ledger_entries`, `stock_movements`, status-history tables,
  transaction snapshots, `settlements`/`settlement_items`, `withdrawals`,
  `payments` (records).
- **SOFT_DELETE** (`deleted_at`, filtered by queries): `users`, `merchants`,
  `products`, `services`, `pets` — user/merchant-managed records with history.
  (Implemented today for pets/merchants via `AuditableEntity.deletedAt`.)
- **ARCHIVE / status transition** (not deleted, moved to terminal state):
  orders, bookings — resolved via lifecycle states, not deletion.
- **HARD_DELETE** (safe to remove): transient/derived rows such as expired slot
  holds, expired verification tokens, ephemeral cart items — where no historical
  or financial significance exists.

Rule: financial and history entities MUST preserve historical integrity and are
never soft/hard deleted. Do not add `deleted_at` to immutable-history tables.

---

## FIX_NOW changes applied during this audit

- **Path-traversal containment** in `LocalStorageService`: all paths are now
  resolved and verified to remain within the storage root; traversal/absolute
  escapes and blank paths are rejected. (Security hardening of existing
  foundation code; `StorageService` has no business caller yet.)
- **500 error information disclosure**: `GlobalExceptionHandler` catch-all no
  longer returns the raw exception message; it logs detail server-side and
  returns a generic message.

---

## Known technical debt (documented, not fixed now)

- **Two API error shapes coexist**: `ApiResponse<T>` (global handler) and
  `ErrorResponse` (auth/merchant/businessconfig module handlers). Consolidate to
  a single canonical error contract in a dedicated cleanup. Tracked in
  `PROJECT_PROGRESS.md`.
