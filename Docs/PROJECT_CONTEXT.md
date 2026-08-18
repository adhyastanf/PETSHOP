# Oyen — Project Context

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

## Development Environment

| Service | Provider |
|---------|----------|
| Repository | GitHub |
| Frontend Hosting | Vercel (Free) |
| Backend Hosting | Koyeb (Free) |
| Database | Supabase PostgreSQL (Free) |
| Storage | Local filesystem → S3/R2 (production) |
| CI/CD | GitHub Actions |

All configuration is environment-variable driven. No secrets in Git. Business modules are provider-independent.

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
16. Oyen is pet-centric: care reminders drive repeat transactions.
17. Pet species supported: CAT, DOG (expandable).
18. Recommendations are initially rule-based and deterministic (no ML in MVP).
19. Nearby merchant discovery uses PostgreSQL/PostGIS spatial queries.
20. Merchant QR attribution is an offline acquisition channel.
21. Free core for customer and merchant during initial growth phase.
22. Payment gateway: Xendit.
23. Oyen commission = 4% from merchant product/service subtotal only (shipping and payment fees excluded).
24. QRIS payment fee to customer = Rp0 (Oyen absorbs the cost).
25. Non-QRIS payment fees may be passed to customer based on configured Xendit fee.
26. Payment fee calculation is backend-only; frontend never determines fees.
27. Product delivery: Biteship aggregator, focus on Instant Delivery for MVP.
28. Pet transport is NOT product delivery — separate domain/flow.
29. Pet transport options: customer brings pet OR merchant-owned pet transport.
30. Merchant settlement follows order lifecycle, not just payment success.

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

## Platform Service Architecture

All external services must be accessed through platform abstractions (interfaces). Business modules must never depend directly on vendor SDKs.

Dependency direction:
```text
Business Module → Platform Service Interface → Infrastructure Implementation → Vendor
```

This enables provider swaps (e.g., changing payment gateway, storage provider, email sender) without touching business logic.

Platform services: Storage, Image, Email, Notification, Payment Provider, Shipping Provider.

Framework infrastructure (Spring Cache, Spring Scheduling) is used directly via annotations — not wrapped in custom interfaces. Search uses PostgreSQL until dedicated search infrastructure is justified.

## Agent Working Rules
Before coding:
1. Identify the domain/module.
2. Read the relevant feature, business rule, state-machine and database sections.
3. Check authorization and ownership.
4. Check whether the operation affects money, stock, booking slots or external providers.
5. Define transaction/idempotency behavior.
6. Reuse existing conventions instead of creating a parallel pattern.

Do not create generic CRUD endpoints simply because a table exists.


---

## Internationalization

English is the canonical language for development and the source language for all translations. The application architecture supports multiple languages through externalized translation resources.

Bahasa Indonesia is the first supported localization.

All future frontend work must follow the internationalization architecture defined in `architecture/FRONTEND_ARCHITECTURE.md`. Hardcoded user-facing strings are prohibited in new code.
