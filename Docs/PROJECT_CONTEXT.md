# Pet Marketplace — Project Context

**Status:** Canonical agent entry point  
**Read this file before implementing any feature.**

## Product
A multi-vendor pet marketplace for physical pet products and bookable pet services. Independent petshops/clinics register as merchants, operate branches, manage products, inventory, services, staff and bookings, while customers shop and book services in one marketplace.

## Stack
- Frontend: Next.js + TypeScript
- Backend: Spring Boot 3 + Java 21
- Database: PostgreSQL
- DB migrations: Flyway
- Server-state frontend: TanStack Query
- Client/UI shared state: Zustand, only when needed
- File storage: S3-compatible object storage / MinIO abstraction
- API style: REST JSON, versioned under `/api/v1`

## Hard Product Rules
1. One merchant can have multiple branches.
2. One cart can contain multiple merchants.
3. Products and services can coexist in one cart/checkout.
4. Products produce `orders`; services produce `bookings`.
5. `checkout` is the aggregation boundary.
6. Payment belongs to checkout.
7. Booking confirmation is configurable: `AUTO_CONFIRM` or `MERCHANT_CONFIRM`.
8. Inventory is scoped by product variant + branch.
9. Service availability is branch/staff/schedule based.
10. Veterinary services can require a verified veterinarian.
11. Shipping uses an aggregator abstraction.
12. Marketplace commission, wallet, ledger, settlement and withdrawal are platform concerns.
13. Backend is authoritative for price, discount, voucher, stock, availability, fees and totals.
14. Historical transactions preserve snapshots.
15. Payment/webhook/financial/inventory finalization must be idempotent.

## Architecture Direction
Start as a modular monolith. Do not introduce microservices without a demonstrated scaling/organizational reason. Keep domain boundaries explicit so modules can later be extracted.

## Source of Truth
When information conflicts:
1. Latest explicit human requirement
2. `PROJECT_CONTEXT.md` hard decisions
3. `FEATURE_KNOWLEDGE.md`
4. `BUSINESS_RULES.md`
5. `STATE_MACHINES.md`
6. `DATABASE_KNOWLEDGE.md`
7. Architecture/API/security documents
8. Existing code
9. Agent assumptions

Flag unresolved contradictions rather than silently inventing behavior.

## Documentation Map
- `FEATURE_KNOWLEDGE.md` — supported product features and user capabilities.
- `DATABASE_KNOWLEDGE.md` — tables, columns, PK/FK and persistence model.
- `ARCHITECTURE.md` — system boundaries and runtime architecture.
- `BUSINESS_RULES.md` — invariants that implementation must preserve.
- `STATE_MACHINES.md` — legal lifecycle transitions.
- `BACKEND_ARCHITECTURE.md` — Spring Boot implementation conventions.
- `API_CONTRACT.md` — HTTP/API conventions.
- `AUTHORIZATION_MATRIX.md` — actor capabilities and ownership.
- `FRONTEND_ARCHITECTURE.md` — Next.js architecture and state strategy.
- `INTEGRATION_SPEC.md` — payment/shipping/storage/OAuth/webhook boundaries.
- `CODING_STANDARDS.md` — engineering conventions.

## Agent Working Rules
Before coding:
1. Identify the domain/module.
2. Read the relevant feature, business rule, state-machine and database sections.
3. Check authorization and ownership.
4. Check whether the operation affects money, stock, booking slots or external providers.
5. Define transaction/idempotency behavior.
6. Reuse existing conventions instead of creating a parallel pattern.

Do not create generic CRUD endpoints simply because a table exists.
