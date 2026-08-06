# Oyen — Architecture

---

## High-Level System Overview

```text
┌──────────────────────────────────────────────────────────────┐
│                         Browser                               │
└──────────────────────────┬───────────────────────────────────┘
                           │ HTTPS
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                    Next.js (Vercel)                            │
│  • Pages & Components                                         │
│  • TanStack Query (server state)                              │
│  • Zustand (client state)                                     │
│  • i18n (English + Bahasa Indonesia)                          │
└──────────────────────────┬───────────────────────────────────┘
                           │ REST/JSON (/api/v1/*)
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                  Spring Boot (Koyeb)                           │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Controllers (HTTP layer)                                 │ │
│  └────────────────────────┬────────────────────────────────┘ │
│                           ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Application Services (business logic)                    │ │
│  └────────┬───────────────┬────────────────────────────────┘ │
│           │               │                                   │
│           ▼               ▼                                   │
│  ┌────────────────┐  ┌────────────────────────────────────┐ │
│  │ Repositories   │  │ Platform Services (interfaces)      │ │
│  │ (Spring Data)  │  │  • StorageService                   │ │
│  └────────┬───────┘  │  • ImageService                    │ │
│           │          │  • EmailService                     │ │
│           │          │  • NotificationService              │ │
│           │          │  • PaymentProvider                  │ │
│           │          │  • ShippingProvider                 │ │
│           │          └────────────────┬───────────────────┘ │
│           │                           │                       │
│           │          ┌────────────────┴───────────────────┐ │
│           │          │ Infrastructure Implementations      │ │
│           │          │  • LocalStorageService              │ │
│           │          │  • MockPaymentProvider              │ │
│           │          │  • ConsoleEmailService              │ │
│           │          │  • (future: S3, Midtrans, SES...)   │ │
│           │          └────────────────────────────────────┘ │
└───────────┼──────────────────────────────────────────────────┘
            │ JDBC/SSL
            ▼
┌──────────────────────────────────────────────────────────────┐
│              PostgreSQL (Supabase)                             │
│  • Flyway migrations                                          │
│  • 87 tables (users, merchants, products, orders, etc.)       │
└──────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| Next.js | UI rendering, routing, client state, i18n, API consumption |
| Spring Boot | Authentication, authorization, business logic, data access |
| PostgreSQL | Persistent data, constraints, transactions |
| Platform Services | Abstraction layer isolating business logic from external providers |
| Infrastructure | Concrete implementations of platform services (swappable) |

### Key Architectural Decisions

- **Monorepo** — backend, frontend, and docs in one repository
- **Modular monolith** — backend organized by domain, extractable later
- **Provider independence** — business modules never depend on vendor SDKs
- **Framework-native** — uses Spring Cache/Scheduling directly, not custom wrappers
- **Database-first** — Flyway migrations are the schema source of truth

---

## Architectural Style
MVP is a **modular monolith**:
- one Next.js frontend application (or separately routed customer/merchant/admin surfaces),
- one Spring Boot deployable backend,
- one PostgreSQL primary database,
- external adapters for payments, shipping, OAuth, notifications and object storage.

Logical modularity is mandatory even while deployment remains monolithic.

## High-Level Runtime
```text
Browser
  |
  v
Next.js
  |
 HTTPS / REST JSON
  v
Spring Boot
  |
  +--> PostgreSQL
  +--> Object Storage
  +--> Payment Provider
  +--> Shipping Aggregator
  +--> OAuth Providers
  +--> Email/Push Providers
```

## Backend Domain Modules
`auth`, `identity`, `rbac`, `customer`, `pet`, `merchant`, `staff`, `catalog`, `inventory`, `service`, `scheduling`, `cart`, `checkout`, `order`, `shipping`, `booking`, `payment`, `refund`, `finance`, `review`, `chat`, `notification`, `promotion`, `dispute`, `file`, `admin`, `integration`, `audit`, `configuration`.

Modules communicate through explicit services/contracts, not arbitrary cross-module repository access.

## Primary Aggregate Boundaries
- Merchant owns branches and merchant operational configuration.
- Product catalog is distinct from inventory.
- Inventory is branch + variant scoped.
- Service definition is distinct from scheduling.
- Cart is mutable pre-purchase state.
- Checkout aggregates a purchase attempt.
- Order represents product fulfillment.
- Booking represents service fulfillment.
- Payment represents payment attempts for checkout.
- Ledger represents immutable merchant financial movements.

## Transaction Boundaries
Strong DB transactions are required around:
- stock reservation/finalization/release,
- slot hold consumption,
- checkout finalization,
- payment-success processing,
- ledger posting,
- withdrawal balance reservation,
- settlement posting.

Do not hold database transactions open while waiting for slow external HTTP calls. Use staged workflows: persist intent/state, call provider, then persist result idempotently.

## Events
Internal domain/application events may decouple side effects such as notifications. Critical financial/inventory correctness must not depend solely on best-effort in-memory events.

If durable asynchronous processing becomes necessary, introduce an outbox pattern before adding distributed messaging.

## Caching
Redis is optional, not a replacement for Zustand. Zustand is browser client state; Redis is server-side infrastructure. Do not introduce Redis until a backend use case exists (distributed cache, rate limiting, locks, sessions, queues, etc.).

## Files
Binary media does not belong in PostgreSQL. Store object key, metadata, ownership and access information in DB; binary data lives in object storage.

## Scaling Path
Scale vertically/horizontally at application level first. Extract services only when module load, team ownership, independent scaling or reliability requirements justify it.


---

## Platform Services

Platform services are abstractions that isolate business logic from external providers.

| Service | Responsibility |
|---------|---------------|
| StorageService | Store/retrieve/delete files (S3, MinIO, local filesystem) |
| ImageService | Resize, thumbnail, format conversion |
| EmailService | Send transactional emails (SMTP, SES, Resend) |
| NotificationService | Dispatch notifications (in-app, push, email routing) |
| PaymentProvider | Create payments, process webhooks, verify signatures |
| ShippingProvider | Quote rates, create shipments, track packages |
| Spring Cache | @Cacheable/@CachePut/@CacheEvict (ConcurrentMap → Redis) |
| Spring Scheduling | @Scheduled for background jobs (→ Quartz for complex) |

### Rules

- Business modules depend on interfaces, never on implementations.
- Infrastructure implementations live in a separate package/layer.
- Provider swap must not require changes to business modules.
- Each service exposes a Java interface in its respective module.
- Local/minimal implementations exist for development.
- Prefer Spring framework abstractions (Cache, Scheduling) over custom wrappers.
- Search uses PostgreSQL queries until dedicated search infrastructure is justified.


---

## Deployment Architecture

```text
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│   Vercel    │────▶│    Koyeb     │────▶│ Supabase PostgreSQL │
│  (Next.js)  │     │ (Spring Boot) │     │                    │
└─────────────┘     └──────────────┘     └──────────────────┘
     HTTPS              REST/JSON              JDBC/SSL
```

All services communicate over HTTPS. Backend connects to database via JDBC with SSL.
Frontend calls backend API only — never accesses database directly.
