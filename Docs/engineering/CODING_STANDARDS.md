# Oyen — Coding Standards

## General
Optimize for clarity, consistency, testability and business correctness over clever abstractions.

## Java
- Java 21.
- Classes: `PascalCase`; methods/variables: `camelCase`; constants: `UPPER_SNAKE_CASE`.
- Prefer constructor injection.
- Avoid field injection.
- Use `BigDecimal` for money.
- Do not use `double`/`float` for financial calculations.
- Use enums for controlled lifecycle states.
- Do not provide unrestricted public status setters for stateful aggregates.

## Spring
- Thin controllers.
- Business orchestration in application services.
- Repositories only handle persistence queries.
- `@Transactional` on meaningful business transaction boundaries.
- Central `@RestControllerAdvice`.
- Bean Validation for request shape.
- Spring Security + ownership validation.

## DTO Naming
Examples:
```text
CreateProductRequest
UpdateProductRequest
ProductResponse
ProductSummaryResponse
CreateBookingRequest
BookingResponse
```

Do not suffix every object with `Dto` if request/response naming is already explicit; choose one convention and use it everywhere.

## Database
- snake_case table/column names.
- UUID PK.
- Explicit FK/unique/check constraints.
- Index foreign keys/query predicates where justified.
- Flyway migrations.
- No production `ddl-auto=update`.
- Never edit an already-released migration; add a new migration.

## Money
Specify currency and rounding rules centrally. Preserve calculation components required for audit/snapshots.

## Nullability
Make optionality intentional in DB, Java and TypeScript. Do not use nullable fields simply to avoid modeling lifecycle requirements.

## API
Follow `API_CONTRACT.md`. Stable error codes. No JPA entity serialization.

## Logging
- Structured, useful operational logs.
- Never log passwords, tokens, secrets, full bank-account data or sensitive raw auth headers.
- Include trace/correlation context.
- Avoid noisy logs in hot loops.

## Comments
Explain *why* a non-obvious rule exists, not what obvious code syntax does. Link business-rule IDs in complex logic when useful.

## Tests
Every critical business rule should have tests. State transitions, authorization, stock concurrency, slot collisions, payment idempotency and finance deserve high-priority coverage.

## TypeScript
- Strict TypeScript.
- Avoid `any` unless isolated and justified.
- API types are explicit.
- Keep server state in TanStack Query.
- Keep Zustand stores small and domain/UI focused.
- Reusable components should not hide business authorization.

## Git / Change Discipline
Keep migrations, API changes and tests in the same feature change where practical. Do not perform unrelated broad refactors while implementing a scoped feature unless explicitly approved.


---

---

## Platform Service Rules

1. **Never reference vendor SDKs outside infrastructure packages.** Business code must not import AWS, Midtrans, Xendit, Biteship, or any provider-specific classes.
2. **Always depend on interfaces.** Inject `StorageService`, `PaymentProvider`, etc. — never `S3Client` or `XenditClient`.
3. **Never bypass platform services.** Do not call external APIs directly from controllers or application services.
4. **Infrastructure implementations are isolated.** Each lives in its own package under `infrastructure/`.
5. **Local implementations exist for development.** File system for storage, console for email, in-memory for cache.
6. **Prefer Spring framework abstractions over custom wrappers.** Use @Cacheable, not a custom CacheService. Use @Scheduled, not a custom SchedulerService.
7. **Introduce abstractions only when they provide clear architectural value.** Do not abstract for the sake of abstraction.
8. **Search uses PostgreSQL queries until dedicated search infrastructure is justified.** Do not create placeholder search interfaces.

---

## Business Configuration Rules

1. **Do not hardcode configurable business values.** Commission, checkout expiration, slot-hold duration, minimum withdrawal, review window, payment-method availability, and similar business parameters come from configuration, not literals in code.
2. **`BusinessConfigurationService` is the canonical access point.** Read system-level business configuration through its typed accessors; do not scatter `SystemConfigurationRepository` lookups or manual `get("key")` string parsing across business services.
3. **Keep business vs technical configuration separate.** Business parameters are database-backed and admin-editable; technical/security invariants (JWT, hashing, CORS, datasource, cryptography, idempotency, ledger immutability, transaction boundaries, state machines) stay in `application.yml`/`@ConfigurationProperties` and are never admin-editable.
4. **Backend is authoritative.** Validate all configuration server-side (type, range, effective-date ordering, no ambiguous overlapping rules). Frontend validation is UX-only. The frontend never computes commission/fees/availability.
5. **Snapshot commission on consumption.** When finance/order phases apply commission, resolve it via `CommissionRuleService`/`CommissionRuleResolver` and snapshot the rate onto the transaction. Never recompute historical commission from current rules.
6. **Audit and invalidate.** Administrative configuration changes are audited in `audit_logs` and must evict/refresh the relevant Spring Cache entries. Never audit secrets.
7. **Reuse the existing schema.** Use `system_configurations`, `commission_rules`, `payment_methods`, and `audit_logs`; do not create parallel configuration or audit systems.

---

## Money, Time, and Error Standards

Canonical details and future-phase requirements live in
`architecture/ARCHITECTURE_DECISIONS.md`. Summary:

1. **Money uses `BigDecimal` / PostgreSQL `NUMERIC`.** Never `double`/`float` for money. Amounts are `NUMERIC(19,2)`; commission rule values `NUMERIC(19,4)`. Currency is IDR.
2. **Round once, HALF_UP.** Apply `RoundingMode.HALF_UP` to the final monetary result (commission, fee, payout), not to intermediate factors. Backend is authoritative for all monetary values; the frontend never computes them.
3. **Absolute timestamps use `Instant` / `TIMESTAMPTZ` in UTC.** Use `LocalDate`/`LocalTime` only for human-calendar concepts. When a business rule depends on the local day boundary, compute against an explicit `ZoneId.of("Asia/Jakarta")` — never the JVM default zone, and avoid `LocalDateTime.now()` for business logic.
4. **Never leak internal details in error responses.** Unexpected errors return a generic message + stable status; full detail is logged server-side only. Known/expected exceptions map to stable machine-readable codes.
5. **Storage paths are contained.** Storage implementations must keep resolved paths within the storage root and reject traversal/absolute escapes.

---

## Internationalization

### Rules

1. **Never hardcode user-facing strings.** All UI text must come from translation resources.
2. **Always use translation keys.** Components reference keys, not raw text.
3. **Never use translated text as identifiers.** Logic must use stable codes/enums, not display strings.
4. **Group keys by feature.** Example: `auth.login.title`, `pets.form.name`, `common.save`.
5. **Keep keys stable.** Renaming a key is a breaking change requiring migration.
6. **Prefer descriptive key names.** `auth.login.invalidCredentials` over `auth.error1`.
7. **Use interpolation for dynamic values.** Example: `"Welcome, {name}"` not string concatenation.
8. **Pluralization uses ICU format.** Example: `"{count, plural, one {# item} other {# items}}"`.
9. **Date/number formatting uses `Intl` API.** Never manually format dates for display.
10. **Source language is English.** English JSON files are the source of truth for all keys.

### Migration Strategy

Existing hardcoded strings should be refactored to use translation keys whenever the file is touched for other work. This is a progressive migration — do not create a dedicated refactoring phase.
