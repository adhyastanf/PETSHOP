# Pet Marketplace — Backend Architecture

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
