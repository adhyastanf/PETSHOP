# Oyen — Business Rules

Rule IDs are stable references for code, tests and tickets.

## Identity
- **BR-ID-001:** A user account has globally unique canonical email/phone where supplied.
- **BR-ID-002:** Suspended users cannot perform protected marketplace operations.
- **BR-ID-003:** Authentication does not imply authorization.

## Merchant
- **BR-MER-001:** A branch belongs to exactly one merchant.
- **BR-MER-002:** Merchant users may only operate on merchants/branches to which they are authorized.
- **BR-MER-003:** Only sell-enabled/approved merchants may publish purchasable offerings.
- **BR-MER-004:** Suspended merchants cannot accept new marketplace transactions.

## Pet
- **BR-PET-001:** Customer can mutate only pets they own.
- **BR-PET-002:** Booking pet must belong to booking customer.
- **BR-PET-003:** Vaccination history is basic history, not a full medical record.

## Product & Inventory
- **BR-INV-001:** Inventory is tracked per product variant + branch.
- **BR-INV-002:** `available = on_hand - reserved`.
- **BR-INV-003:** Available inventory cannot become negative.
- **BR-INV-004:** Every stock mutation creates an auditable stock movement.
- **BR-INV-005:** Reservation/finalization/release operations must be concurrency safe and idempotent.
- **BR-INV-006:** Product/variant must be active and belong to the referenced merchant before purchase.
- **BR-INV-007:** Historical order data uses snapshots; catalog edits cannot rewrite old orders.

## Service & Scheduling
- **BR-SVC-001:** Service can be available only at explicitly configured branches.
- **BR-SVC-002:** Applicable service price is selected/validated by backend.
- **BR-SVC-003:** Availability considers branch hours, service branch, staff assignment, schedule, exceptions, bookings and active holds.
- **BR-SVC-004:** Active slot holds block conflicting capacity.
- **BR-SVC-005:** Expired/released holds no longer block capacity.
- **BR-SVC-006:** A service requiring verified veterinarian cannot be confirmed with an ineligible veterinarian.
- **BR-SVC-007:** Booking confirmation mode is configured per service.
- **BR-SVC-008:** Historical booking service/price data uses snapshots.

## Cart
- **BR-CART-001:** A customer has at most one active normal cart unless a future cart model explicitly changes this.
- **BR-CART-002:** Cart may contain multiple merchants.
- **BR-CART-003:** Cart may contain both product and service items.
- **BR-CART-004:** Cart price is informational until backend checkout validation.
- **BR-CART-005:** Adding an item never bypasses final inventory/availability validation.

## Checkout
- **BR-CHK-001:** Checkout is the purchase aggregation boundary.
- **BR-CHK-002:** Product items become orders; service items become bookings.
- **BR-CHK-003:** Backend recalculates every monetary total.
- **BR-CHK-004:** Checkout preserves transaction snapshots.
- **BR-CHK-005:** Checkout finalization is idempotent.
- **BR-CHK-006:** A checkout cannot be paid twice.

## Order
- **BR-ORD-001:** An order contains physical product fulfillment only.
- **BR-ORD-002:** Product items are split by required merchant/fulfillment boundary.
- **BR-ORD-003:** Merchant may only operate its own orders.
- **BR-ORD-004:** Invalid order state transitions are rejected.

## Booking
- **BR-BKG-001:** A booking represents service fulfillment only.
- **BR-BKG-002:** `AUTO_CONFIRM` may confirm after successful payment when all requirements remain valid.
- **BR-BKG-003:** `MERCHANT_CONFIRM` requires merchant acceptance after payment.
- **BR-BKG-004:** Booking state transitions must follow the canonical state machine.
- **BR-BKG-005:** Cancellation/refund eligibility is calculated by backend policy.
- **BR-BKG-006:** Completed vaccination booking may create a vaccination-history record idempotently.

## Payment
- **BR-PAY-001:** Payment belongs to checkout.
- **BR-PAY-002:** Multiple payment attempts may exist for one checkout.
- **BR-PAY-003:** Provider callbacks must be authenticated/validated where provider supports signatures.
- **BR-PAY-004:** Duplicate callbacks must not duplicate stock, bookings, orders or money.
- **BR-PAY-005:** Client-provided payment success is never authoritative.
- **BR-PAY-006:** Provider transaction identifiers must be unique/idempotently handled.

## Shipping
- **BR-SHP-001:** Shipping applies only to physical-product fulfillment.
- **BR-SHP-002:** Shipping quote is a snapshot and may expire.
- **BR-SHP-003:** Shipment webhooks/events are idempotently processed.
- **BR-SHP-004:** Shipping origin is the actual fulfillment branch.

## Promotions
- **BR-PRO-001:** Backend determines promotion/voucher eligibility.
- **BR-PRO-002:** Usage limits are concurrency safe.
- **BR-PRO-003:** Expired/inactive promotions cannot affect new checkout totals.

## Finance
- **BR-FIN-001:** Merchant balance cannot be changed without corresponding ledger semantics.
- **BR-FIN-002:** Ledger entries are immutable; corrections use compensating entries.
- **BR-FIN-003:** Commission is calculated from the rule effective for the transaction and preserved as a snapshot/result.
- **BR-FIN-004:** Withdrawal cannot exceed eligible available balance.
- **BR-FIN-005:** Withdrawal processing is idempotent.
- **BR-FIN-006:** Settlement items cannot be settled twice.
- **BR-FIN-007:** Monetary calculations use decimal arithmetic, never floating point.

## Business Configuration
- **BR-CFG-001:** Admin-configurable business rules/parameters are database-backed and editable by internal admins (ADMIN/SUPER_ADMIN) without code changes or redeploys.
- **BR-CFG-002:** `BusinessConfigurationService` is the canonical typed access point for system-level business configuration; business logic must not hardcode configurable values or query the configuration store directly everywhere.
- **BR-CFG-003:** Only whitelisted business keys are editable; technical/security settings (JWT, password hashing, CORS, datasource, cryptography, idempotency, ledger immutability, transaction boundaries, state-machine integrity) are never admin-editable business configuration.
- **BR-CFG-004:** All configuration changes are validated server-side (type, range, required fields, effective-date ordering, no ambiguous overlapping rules) and rejected if invalid; frontend validation is UX-only.
- **BR-CFG-005:** Monetary/financial configuration uses decimal arithmetic, never floating point.
- **BR-CFG-006:** Configuration changes are recorded in the audit log (actor, action, entity, old/new value, timestamp); secrets/tokens are never audited.
- **BR-CFG-007:** Configuration reads may be cached; administrative changes must invalidate the relevant cache so subsequent business operations observe the new value.
- **BR-CFG-008:** Commission is resolved deterministically by scope specificity (MERCHANT > CATEGORY > GLOBAL), then priority, then effective date; overlapping active rules with the same scope/priority/effective window are rejected.
- **BR-CFG-009:** Commission percentage cannot be negative or exceed 100; fixed commission cannot be negative.
- **BR-CFG-010:** The commission rate/rule applicable to a transaction MUST be snapshotted onto the transaction when future finance/order phases consume it. Changing a rule never retroactively alters historical orders, bookings, commission, ledger entries, COD commission accrual, or settlements.
- **BR-CFG-011:** Payment-method availability is backend-authoritative configuration; the frontend must never hardcode payment-method availability.
- **BR-CFG-012:** Xendit is the canonical production payment provider; provider configuration reflects Xendit, not Midtrans.

## Reviews
- **BR-REV-001:** Product reviews require an eligible completed product transaction.
- **BR-REV-002:** Service reviews require an eligible completed booking.
- **BR-REV-003:** Review uniqueness/eligibility must be enforced by backend.

## Security
- **BR-SEC-001:** Never authorize based only on an ID supplied by frontend.
- **BR-SEC-002:** Every merchant-scoped query validates merchant ownership/access.
- **BR-SEC-003:** Private files/chat require ownership or membership authorization.
- **BR-SEC-004:** Sensitive financial/admin actions are audited.


---

## Payment & Commission

- **BR-PAY-007:** Oyen commission = 4% of merchant product/service subtotal.
- **BR-PAY-008:** Commission base excludes shipping fee and payment/application fee.
- **BR-PAY-009:** QRIS: customer payment fee = Rp0 (Oyen absorbs gateway cost).
- **BR-PAY-010:** Non-QRIS: payment fee passed to customer based on actual/configured Xendit fee.
- **BR-PAY-011:** Backend is source of truth for: payment method, payment fee, subtotal, application fee, customer total, merchant commission.
- **BR-PAY-012:** Frontend must not calculate or determine payment fees or commission.
- **BR-PAY-013:** Payment webhook from Xendit is source of truth for payment status.
- **BR-PAY-014:** Payment processing must be idempotent (no duplicate processing).
- **BR-PAY-015:** Merchant is not entitled to settlement merely because payment succeeded — settlement follows order completion lifecycle.
- **BR-PAY-016:** A payment method is either provider-collected (payment gateway, e.g. Xendit) or merchant-collected (COD). COD funds are collected by the merchant directly and are never an Oyen cash receipt.

### COD Commission Debt Recovery

These rules are deterministic and implementation-independent. They describe the
canonical COD commission accrual and recovery model. *(Planned implementation —
see Phase 13 in the roadmap; not yet built.)*

- **BR-COD-001:** COD collection is not an Oyen cash receipt; Oyen does not receive COD funds.
- **BR-COD-002:** Oyen's applicable marketplace commission (4% of product/service subtotal; shipping and payment fees excluded) is still owed by the merchant on COD orders.
- **BR-COD-003:** COD commission is recorded as an accrued outstanding merchant commission payable, which increases the merchant's outstanding commission balance.
- **BR-COD-004:** The merchant financial ledger is the authoritative record of the outstanding commission obligation and of its recovery.
- **BR-COD-005:** A future eligible Oyen-controlled payment-gateway settlement can automatically recover outstanding COD commission debt.
- **BR-COD-006:** Debt recovery in a settlement cannot exceed the amount available for settlement after current deductions.
- **BR-COD-007:** Debt recovery cannot produce a negative merchant payout.
- **BR-COD-008:** When available settlement is less than outstanding debt, only the available amount is recovered and the remaining debt carries forward to a future eligible settlement.
- **BR-COD-009:** Current-transaction commission and recovery of previous COD commission debt are separate financial events and must remain separately traceable/auditable in the ledger.
- **BR-COD-010:** COD commission accrual and debt recovery are immutable and idempotent; duplicate payment webhooks or settlement processing must never duplicate commission or debt recovery.
- **BR-COD-011:** COD settlement recovery remains subject to the existing settlement lifecycle and is not triggered merely by payment success.
- **BR-COD-012:** Backend is authoritative for all COD commission and debt-recovery calculations; the frontend must never calculate or determine commission or debt-recovery amounts.

### Settlement Calculation Order

The canonical deterministic settlement calculation is:

```text
1. Determine eligible gross merchant amount.
2. Calculate current-transaction commission (4% of subtotal; shipping + payment fees excluded).
3. Apply existing documented deductions/refunds/adjustments per current rules.
4. Determine recoverable outstanding merchant commission debt.
5. Recover debt up to the remaining settlement amount (never below zero payout).
6. Calculate final merchant net settlement.
7. Record immutable ledger entries (current commission and debt recovery separately).
8. Create/update settlement records.
9. Process merchant payout/settlement for the final net amount.
```

### Checkout Calculation

```text
Product/Service Subtotal
+ Shipping Fee
+ Customer Payment/Application Fee
= Customer Total

Oyen Commission (4% of subtotal) is deducted from merchant settlement, not added to customer total.
```

---

## Product Delivery

- **BR-SHP-005:** Biteship is the shipping aggregator for MVP product delivery.
- **BR-SHP-006:** MVP focus: Instant Delivery only (GoSend, GrabExpress, Lalamove via Biteship).
- **BR-SHP-007:** Shipping provider must be abstracted: `ShippingProvider → BiteshipShippingProvider`.
- **BR-SHP-008:** Biteship can be replaced with direct GoSend/Grab integration without changing order domain.
- **BR-SHP-009:** Shipping webhook processing must be idempotent.
- **BR-SHP-010:** Frontend must not determine shipping status or cost.

### Product Delivery Lifecycle

```text
PENDING → BOOKED → PICKED_UP → ON_DELIVERY → DELIVERED
```

---

## Pet Transport

- **BR-PET-004:** Pet/live animals must NEVER use normal product delivery (GoSend/GrabExpress/Biteship).
- **BR-PET-005:** Pet transport is a separate domain from product shipping.
- **BR-PET-006:** Two options: customer brings pet OR merchant-owned pet transport.
- **BR-PET-007:** Merchant pet transport has its own configuration: operating hours, coverage radius, vehicle type, capacity, pricing.
- **BR-PET-008:** Pet transport lifecycle is independent from product delivery lifecycle.

### Pet Transport Options

```text
Option A: Customer brings pet (fee = Rp0)
Option B: Merchant pet transport (configurable pricing by merchant)
```

### Pet Service Lifecycle (with merchant transport)

```text
BOOKED → CONFIRMED → PET_PICKUP → ARRIVED_AT_VENUE → SERVICE_IN_PROGRESS → SERVICE_COMPLETED → ORDER_COMPLETED
```

### Pet Service Lifecycle (customer brings pet)

```text
BOOKED → CONFIRMED → ARRIVED_AT_VENUE → SERVICE_IN_PROGRESS → SERVICE_COMPLETED → ORDER_COMPLETED
```

- Carrier/crate requirement can be enforced by merchant configuration.
