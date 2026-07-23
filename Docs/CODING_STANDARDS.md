# Pet Marketplace — Coding Standards

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
