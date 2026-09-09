# Oyen — Project Overview

> For human developers and stakeholders. Quick reference for the entire project scope.

---

## What is Oyen?

A multi-vendor pet marketplace connecting pet owners with products and pet services. Indonesia-first, pet-centric.

**Tagline:** All Your Pet Needs, Closer to You.

**Core lifecycle:**
```text
Pet Profile → Purchase/Booking → Care History → Reminder → Rebook → Repeat
```

---

## Tech Stack

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 21 | Language |
| Spring Boot | 3.5.3 | Framework |
| Spring Security | — | JWT authentication + RBAC |
| Spring Data JPA | — | ORM / data access |
| Hibernate | 6.6.x | JPA implementation |
| Flyway | — | Database migrations |
| Spring Cache | — | @Cacheable (ConcurrentMap → Redis) |
| Spring Scheduling | — | @Scheduled (→ Quartz) |
| PostgreSQL | 16 | Primary database |
| PostGIS | — | Spatial/geographic queries (future) |
| Lombok | 1.18.x | Boilerplate reduction |
| springdoc-openapi | 2.8.9 | Swagger UI |
| Testcontainers | — | Integration testing |
| Maven | 3.9.x | Build tool |

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.2.10 | React framework (App Router) |
| React | 19.2.4 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| shadcn/ui (base-ui) | 4.x | Component library |
| TanStack Query | 5.x | Server state management |
| Zustand | 5.x | Client state |
| Zod | 4.x | Validation |
| Vitest | 4.x | Unit testing |
| Sonner | 2.x | Toast notifications |
| Lucide React | 1.x | Icons |
| next-themes | 0.4.x | Theme support |

### Infrastructure

| Service | Provider | Purpose |
|---------|----------|---------|
| Repository | GitHub | Source control + CI/CD |
| Frontend Hosting | Vercel (Free) | Next.js deployment |
| Backend Hosting | Koyeb (Free) | Spring Boot deployment |
| Database | Supabase (Free) | PostgreSQL hosting |
| CI/CD | GitHub Actions | Automated build/test |
| Storage | Local filesystem | File uploads (→ S3/R2) |

---

## External Integrations

| Provider | Purpose | Phase |
|----------|---------|-------|
| Xendit | Payment gateway (QRIS, VA, E-Wallet, Card) | Phase 9 |
| Biteship | Product shipping aggregator (Instant Delivery) | Phase 10 |
| Mapbox | Map rendering, markers, location UX | Phase 16.5 |
| Firebase (FCM) | Push notifications | Phase 16.6 |
| Google OAuth | Social login | Deferred |
| PostGIS | Geographic merchant search | Phase 16.5 |

---

## Platform Service Abstractions

| Service | Interface | Dev Implementation | Production |
|---------|-----------|-------------------|------------|
| Storage | `StorageService` | Local filesystem | S3 / Cloudflare R2 |
| Image | `ImageService` | Pass-through | imgproxy / Sharp |
| Email | `EmailService` | Console log | Resend / SES |
| Notification | `NotificationService` | Console log | FCM + in-app |
| Payment | `PaymentProvider` | Mock | Xendit |
| Shipping | `ShippingProvider` | Mock | Biteship |
| Pet Transport | `PetTransportService` | — | Merchant-managed |
| Cache | Spring `@Cacheable` | ConcurrentMap | Redis |
| Scheduling | Spring `@Scheduled` | Built-in | Quartz |

---

## Business Model

| Item | Value |
|------|-------|
| Merchant commission | 4% of product/service subtotal |
| Commission base | Excludes shipping fee and payment fee |
| QRIS customer fee | Rp0 (Oyen absorbs) |
| Non-QRIS customer fee | Actual Xendit fee passed through |
| Product delivery | Instant via Biteship (GoSend, GrabExpress, Lalamove) |
| Pet transport | Customer brings OR merchant-owned transport |
| Merchant settlement | After order completion (not just payment success) |
| COD (cash on delivery) | Merchant-collected; Oyen does not receive COD funds |
| COD commission | 4% still owed by merchant, accrued as outstanding commission payable |
| COD debt recovery | Recovered from future eligible payment-gateway settlements (planned, Phase 13) |

---

## Features — Full Scope

### Implemented ✅

| Feature | Phase |
|---------|-------|
| Email/password registration | 1 |
| JWT login/logout | 1 |
| Refresh token rotation + revocation | 1 |
| Role-based access (8 roles) | 1 |
| Role-based frontend routing | 1 |
| Session restore on reload | 1 |
| Customer profile CRUD | 2 |
| Delivery addresses CRUD | 2 |
| Pet CRUD (types, breeds) | 2 |
| Vaccination history | 2 |
| Internationalization (EN + ID) | Cross-cutting |
| Design system (Oyen orange palette) | Cross-cutting |
| Platform service abstractions | 2.5 |
| GitHub Actions CI/CD | Cross-cutting |

### Planned ⏳

| Feature | Phase |
|---------|-------|
| Remember Me | 1 (pending) |
| Delete Account | 1 (pending) |
| Pet Ownership Transfer | 2 (pending) |
| Merchant registration & verification | 3 |
| Multi-branch merchant | 3 |
| Staff & vet management | 3 |
| Product catalog & variants | 4 |
| Branch inventory & stock movements | 5 |
| Services, scheduling, slot holds | 6 |
| Multi-merchant cart (products + services) | 7 |
| Unified checkout & order splitting | 8 |
| Xendit payment integration | 9 |
| Product orders & Biteship shipping | 10 |
| Service bookings & confirmation | 10 |
| Pet Hotel (boarding) | 11 |
| Cancellation & refunds | 12 |
| Commission, ledger, settlement, withdrawal | 13 |
| COD commission debt recovery from settlements | 13 |
| Reviews, favorites, chat, notifications | 14 |
| Vouchers, campaigns, banners | 15 |
| Admin & disputes | 16 |
| Nearby merchant discovery (PostGIS + Mapbox) | 16.5 |
| Personalized home (rule-based recommendations) | 16.5 |
| Pet care reminders & merchant follow-up | 16.6 |
| Merchant QR acquisition & analytics | 16.7 |
| Terms of service, privacy policy, store compliance | 17 |
| Production hardening | 18 |

---

## Actors

| Role | Access |
|------|--------|
| Customer | Shop, book, manage pets, view orders/bookings |
| Merchant Owner | Full merchant control |
| Merchant Admin | Branch/staff/catalog management |
| Merchant Staff | Process orders/bookings |
| Groomer | Assigned service execution |
| Veterinarian | Verified medical services |
| Admin | Platform moderation |
| Super Admin | Full platform access |

---

## Key Architecture Decisions

1. **Monorepo** — backend, frontend, docs in one repo
2. **Modular monolith** — domain-organized, extractable later
3. **Provider independence** — business logic never depends on vendor SDKs
4. **Database-first** — Flyway migrations are schema source of truth
5. **Framework-native** — Spring Cache/Scheduling used directly
6. **Pet-centric** — care reminders drive repeat transactions
7. **Local-first Indonesia** — Bahasa Indonesia as first localization
8. **Free core** — no mandatory merchant subscription initially
9. **Rule-based recommendations** — deterministic before ML
10. **Merchant QR** — offline acquisition channel

---

## Current Progress

```
Phase 0   ✅ Foundation
Phase 1   ✅ Identity & RBAC (Remember Me + Delete Account pending)
Phase 2   ✅ Customer & Pets (Ownership Transfer pending)
Phase 2.5 ✅ Platform Foundation
Phase 3   ⏳ Merchant (next)
```

---

## Documentation Map

| Document | Location |
|----------|----------|
| Agent Rules | `AGENTS.md` |
| This Overview | `Docs/OVERVIEW.md` |
| Project Context | `Docs/PROJECT_CONTEXT.md` |
| Architecture | `Docs/architecture/ARCHITECTURE.md` |
| Backend Architecture | `Docs/architecture/BACKEND_ARCHITECTURE.md` |
| Frontend Architecture | `Docs/architecture/FRONTEND_ARCHITECTURE.md` |
| API Contract | `Docs/api/API_CONTRACT.md` |
| Business Rules | `Docs/data/BUSINESS_RULES.md` |
| Database Knowledge | `Docs/data/DATABASE_KNOWLEDGE.md` |
| Design System | `Docs/design/DESIGN_SYSTEM.md` |
| UI Patterns | `Docs/design/UI_PATTERNS.md` |
| Integration Spec | `Docs/integration/INTEGRATION_SPEC.md` |
| Feature Knowledge | `Docs/FEATURE_KNOWLEDGE.md` |
| Implementation Roadmap | `Docs/implementation/IMPLEMENTATION_ROADMAP.md` |
| User Stories | `Docs/implementation/USER_STORIES.md` |
| Project Progress | `Docs/implementation/PROJECT_PROGRESS.md` |
| Development Guide | `Docs/DEVELOPMENT_GUIDE.md` |
