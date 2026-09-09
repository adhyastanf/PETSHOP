# Oyen — Backend Architecture

## Platform
Spring Boot 3, Java 21, PostgreSQL, Flyway.

## Style
Use a modular monolith organized primarily by business domain, not one global `controller/service/repository` folder.

Example:
```text
com.petmarketplace
├── auth
├── customer
├── pet
├── merchant
├── catalog
├── inventory
├── service
├── scheduling
├── cart
├── checkout
├── order
├── booking
├── payment
├── shipping
├── finance
└── shared
```

Typical module:
```text
order/
├── api/
│   ├── OrderController.java
│   └── dto/
├── application/
│   └── OrderService.java
├── domain/
│   ├── Order.java
│   └── OrderStatus.java
├── persistence/
│   └── OrderRepository.java
└── mapper/
```

The exact package names may adapt to existing code, but domain ownership must remain clear.

## Dependency Direction
```text
Controller/API
    -> Application Service
        -> Domain/Persistence Ports
            -> Repository/Provider Adapter
```

Controllers do HTTP concerns only. They must not contain transaction orchestration or business calculations.

## Entities and DTOs
- Never expose JPA entities directly from REST controllers.
- Request DTOs represent client input.
- Response DTOs represent API contracts.
- Mapping can be manual or mapper-assisted, but mapping rules must remain explicit.
- Do not accept server-owned fields such as calculated totals from clients as authoritative.

## Persistence
- UUID primary keys.
- `BigDecimal` for money.
- PostgreSQL `NUMERIC` for monetary values.
- `Instant`/`OffsetDateTime` for timestamps; define a consistent project convention.
- Store timestamps in UTC and render user-local time at boundaries.
- Use optimistic locking (`@Version`) where useful.
- Use pessimistic locking/atomic SQL where required for inventory/financial contention.
- Define DB unique/check/FK constraints, not only Java validation.

## Transactions
Use `@Transactional` at application-service operations that represent one business transaction. Avoid remote provider calls inside long DB transactions.

## Migrations
Flyway is the only production schema evolution mechanism.
- Never use `ddl-auto=update` in production.
- Migrations are immutable after shared deployment.
- Naming example: `V001__create_identity_tables.sql`.

## Errors
Use centralized exception mapping (`@RestControllerAdvice`). Domain/application exceptions map to stable API error codes.

## Validation
Use Bean Validation for structural request validation and services/domain rules for business validation.

## Security
Spring Security enforces authentication and coarse role/permission checks. Services still validate resource ownership and merchant/branch scope.

## Financial Domain Responsibilities

The `finance` module owns commission calculation, the immutable merchant ledger,
merchant balances, settlement, and debt recovery. Responsibility boundaries:

- **Payment handling (`payment` module):** authoritative payment status and
  method classification, distinguishing provider-collected (payment gateway)
  from merchant-collected (COD) payments. Payment does not compute merchant
  settlement.
- **Commission calculation (`finance`):** the 4% rule on product/service subtotal
  (shipping and payment fees excluded), applied to both gateway and COD
  transactions.
- **Financial ledger (`finance`):** immutable, exactly-once entries. COD
  commission accrual and later debt recovery are separate, independently
  auditable entries.
- **Merchant balance (`finance`):** outstanding commission payable and available
  balance derive from ledger entries, never from an independent counter that
  bypasses the ledger.
- **Settlement (`finance`):** applies the canonical calculation order (current
  commission → documented deductions → recoverable outstanding COD debt up to
  the available amount → final net), guaranteeing no negative payout and
  carry-forward of unrecovered debt.
- **Debt recovery (`finance`):** idempotent recovery of outstanding COD
  commission from eligible settlements; must never double-recover on duplicate
  processing.

COD debt recovery must not create a parallel wallet/debt subsystem. Provider
(Xendit) marketplace-settlement mechanics stay behind the payment/provider
abstraction and must not appear in core financial business rules. *(This model
is planned — see Phase 13 in the roadmap.)*

## Business Configuration

Admin-configurable business rules and parameters are database-backed and managed
through the `businessconfig` module (`com.petshop.api.businessconfig`).

- **`BusinessConfigurationService`** is the canonical, typed access point for
  system-level business configuration (`system_configurations`). It exposes typed
  accessors (e.g. `getCheckoutExpiration()`, `getSlotHoldDuration()`,
  `getMinimumWithdrawalAmount()`, `getDefaultCommissionPercentage()`,
  `getReviewWindowDays()`), caches reads via Spring Cache (cache `businessConfig`),
  and evicts on administrative update. Managed keys are declared in the
  `BusinessConfigKey` enum with type + range metadata for validation.
- **`CommissionRuleService`** + **`CommissionRuleResolver`** manage and resolve
  commission rules from `commission_rules`. The resolver is pure, deterministic
  domain logic with no dependency on future order/payment services.
- **`PaymentMethodAdminService`** manages payment-method availability
  (`payment_methods`) — availability only; processing/provider integration is
  deferred to the Payment phase and uses the `PaymentProvider` abstraction.
- **`ConfigAuditService`** records administrative changes into `audit_logs`
  (reusing the existing audit foundation; never storing secrets/tokens).

Business vs technical configuration:

- **Business configuration** (editable by ADMIN/SUPER_ADMIN via the admin API):
  checkout expiration, slot-hold duration, minimum withdrawal, default/fallback
  commission percentage, review window, commission rules, payment-method availability.
- **Technical/security configuration** (NOT admin-editable; lives in
  `application.yml` / `@ConfigurationProperties` such as `AuthProperties`): JWT,
  password hashing, CORS, datasource, cryptography, idempotency guarantees, ledger
  immutability, transaction boundaries, state-machine integrity.

Do not make technical/security invariants database-editable simply because they
are constants.

### Future-phase consumption contract

When later phases are implemented, they MUST read configurable business values
through this foundation rather than hardcoding constants:

```text
CheckoutService  → BusinessConfigurationService.getCheckoutExpiration()
Scheduling/Checkout → BusinessConfigurationService.getSlotHoldDuration()
WithdrawalService → BusinessConfigurationService.getMinimumWithdrawalAmount()
ReviewService    → BusinessConfigurationService.getReviewWindowDays()
PaymentService   → payment-method availability (payment_methods) + PaymentProvider
Commission calc  → CommissionRuleService.resolveApplicable(context)  [then SNAPSHOT the rate]
SettlementService→ BusinessConfigurationService (+ snapshotted commission)
```

Commission historical-safety requirement: the resolved commission rate/rule MUST
be snapshotted onto the order/booking/financial record at transaction time.
Changing a `CommissionRule` afterwards must never retroactively alter historical
orders, bookings, commission, ledger entries, COD commission accrual, or
settlements. This foundation implements administration and resolution only; the
snapshot happens in the consuming phase.

## External Integrations
Define interfaces/adapters, e.g.:
```text
PaymentGateway
ShippingGateway
ObjectStorage
EmailSender
PushSender
OAuthIdentityProvider
```
Business modules depend on abstractions, not provider SDK details.

## Idempotency
Webhook/event processing stores external event IDs/provider transaction IDs and safely returns success for already-processed duplicates.

## Testing
- Unit tests: domain/business calculations.
- Repository integration tests: PostgreSQL behavior.
- API integration tests: auth, validation and contracts.
- Critical concurrency tests: inventory, slots, ledger/withdrawal.


---

## Dependency Direction

```text
Business Layer (application/domain)
    ↓ depends on
Platform Service Interface (e.g., StorageService, PaymentProvider)
    ↓ implemented by
Infrastructure Implementation (e.g., S3StorageService, XenditPaymentProvider)
    ↓ uses
Vendor SDK / External API
```

### Rules

- Business modules must never import vendor SDK classes.
- Business modules depend only on platform service interfaces.
- Infrastructure implementations are injected via Spring DI.
- Swapping a provider means creating a new implementation, not changing business code.
- Integration tests mock platform service interfaces; infrastructure tests verify implementations.

### Framework Infrastructure

Spring Cache and Spring Scheduling are framework infrastructure, not platform service interfaces.
Business services use them directly via annotations:

```java
@Cacheable("products")
public List<Product> findProducts(...) { ... }

@Scheduled(fixedDelay = 60000)
public void cleanupExpiredSessions() { ... }
```

Do not wrap these with custom interfaces.
