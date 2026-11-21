# Oyen

A modern multi-vendor pet marketplace where customers can buy pet products, book pet services, manage their pets, and find nearby pet shops and veterinarians.

The project follows an AI-first development workflow with comprehensive canonical documentation, a Spring Boot backend, and a Next.js frontend.

---

## Features (Implemented)

- **Authentication** — Register, login, logout, JWT, refresh token rotation, session restore
- **RBAC** — Role-based access control (Customer, Merchant, Admin, Super Admin)
- **Customer Profiles** — Profile management, delivery addresses
- **Pet Management** — CRUD, pet types, breeds, vaccination history
- **Merchant Management** — Onboarding, verification, branches, staff, veterinarian verification
- **Business Configuration** — Admin-managed commission rules, payment method availability, and business settings
- **Internationalization** — English + Bahasa Indonesia, language switcher
- **Platform Foundation** — Storage, Image, Email, Notification, Payment, Shipping abstractions
- **Design System** — Oyen orange palette, consistent component library
- **CI/CD** — GitHub Actions for backend and frontend

---

## Architecture

```text
Browser
  │
  ▼
Next.js (Vercel)
  │
  ▼ REST/JSON
Spring Boot (Koyeb)
  │
  ├── Controller → Service → Repository → PostgreSQL (Supabase)
  │
  └── Platform Services (abstractions — current dev → intended production)
        ├── StorageService      (local filesystem → S3-compatible object storage)
        ├── ImageService        (passthrough → imgproxy)
        ├── EmailService        (console → Resend/SES)
        ├── NotificationService (log → FCM)
        ├── PaymentProvider     (mock → Xendit)
        └── ShippingProvider    (mock → Biteship)

Framework Infrastructure (current → production target):
  • Spring Cache (@Cacheable — ConcurrentMap → Redis)
  • Spring Scheduling (@Scheduled — built-in → Quartz)
  • Flyway (database migrations)
  • Spring Security (JWT authentication)
```

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | Java + Spring Boot | 21 + 3.5.3 |
| Frontend | Next.js + TypeScript | 16.2.10 + 5.x |
| Database | PostgreSQL | 16 |
| ORM | Spring Data JPA / Hibernate | 6.6.x |
| Migrations | Flyway | auto |
| UI Library | shadcn/ui + Tailwind CSS | 4.x |
| Server State | TanStack Query + Axios | 5.x + 1.x |
| Client State | Zustand | 5.x |
| i18n | next-intl (`[locale]` routing, `en` / `id`) | 4.x |
| Forms | React Hook Form + Zod resolvers | 7.x |
| Validation | Zod (frontend) + Jakarta (backend) | — |
| Testing | Vitest + JUnit 5 + Testcontainers | — |
| CI/CD | GitHub Actions | — |

---

## Repository Structure

```
/
├── PETSHOP-API/          Spring Boot backend
│   └── docs/             API docs (see docs/README.md)
│       ├── architecture/   System architecture, state machines, decisions
│       ├── data/           Database and business rules
│       ├── domain/         Domain designs (veterinary)
│       ├── engineering/    Coding standards, security, tests
│       ├── integration/    External service integrations
│       └── implementation/ Roadmap, stories, progress, acceptance criteria
├── PETSHOP-UI/           Next.js frontend
│   └── docs/             UI docs: frontend architecture, design system, UI patterns,
│                         coding standards, development guide
├── .github/workflows/    CI/CD pipelines
├── AGENTS.md             AI agent operating manual
└── README.md             This file
```

---

## Quick Start

### Prerequisites

- Java 21
- Maven
- Node.js 20+
- PostgreSQL 16

### Backend

```bash
cd PETSHOP-API
cp .env.example .env
# Edit .env with your database credentials
mvn spring-boot:run
```

API runs at `http://localhost:8080`. Swagger UI at `http://localhost:8080/swagger-ui/index.html`.

### Frontend

```bash
cd PETSHOP-UI
cp .env.example .env.local
npm install
npm run dev
```

App runs at `http://localhost:3000`.

### Database

Flyway auto-runs migrations on backend startup. Just create an empty `petshop` database:

```sql
CREATE DATABASE petshop;
```

---

## Cloud Development

Official shared development environment:

| Service | Provider | Purpose |
|---------|----------|---------|
| Repository | GitHub | Source control + CI |
| Frontend | Vercel (Free) | Next.js hosting |
| Backend | Koyeb (Free) | Spring Boot hosting |
| Database | Supabase (Free) | PostgreSQL |

All configuration is environment-variable driven. See `.env.example` files for required variables.

---

## Documentation Index

| Document | Purpose |
|----------|---------|
| [AGENTS.md](AGENTS.md) | AI agent operating rules |
| [PROJECT_CONTEXT.md](PETSHOP-API/docs/PROJECT_CONTEXT.md) | Canonical project context |
| [ARCHITECTURE.md](PETSHOP-API/docs/architecture/ARCHITECTURE.md) | System architecture |
| [BACKEND_ARCHITECTURE.md](PETSHOP-API/docs/BACKEND_ARCHITECTURE.md) | Spring Boot conventions (API) |
| [API_CONTRACT.md](PETSHOP-API/docs/API_CONTRACT.md) | API standards + endpoint catalog (API) |
| [AUTHORIZATION_MATRIX.md](PETSHOP-API/docs/AUTHORIZATION_MATRIX.md) | Actor capabilities and ownership (API) |
| [FRONTEND_ARCHITECTURE.md](PETSHOP-UI/docs/FRONTEND_ARCHITECTURE.md) | Next.js architecture, auth proxy, i18n (UI) |
| [DESIGN_SYSTEM.md](PETSHOP-UI/docs/DESIGN_SYSTEM.md) | Visual design system (UI) |
| [UI_PATTERNS.md](PETSHOP-UI/docs/UI_PATTERNS.md) | Page composition patterns (UI) |
| [CODING_STANDARDS.md (UI)](PETSHOP-UI/docs/CODING_STANDARDS.md) | TypeScript, structure, and i18n standards |
| [IMPLEMENTATION_ROADMAP.md](PETSHOP-API/docs/implementation/IMPLEMENTATION_ROADMAP.md) | Development phases |
| [USER_STORIES.md](PETSHOP-API/docs/implementation/USER_STORIES.md) | Feature stories |
| [PROJECT_PROGRESS.md](PETSHOP-API/docs/implementation/PROJECT_PROGRESS.md) | Current phase status |
| [DEVELOPMENT_GUIDE.md (API)](PETSHOP-API/docs/DEVELOPMENT_GUIDE.md) | Backend step-by-step guide |
| [DEVELOPMENT_GUIDE.md (UI)](PETSHOP-UI/docs/DEVELOPMENT_GUIDE.md) | Frontend step-by-step guide |

AI agents start with `AGENTS.md`. Human developers start with this README.

---

## Contributing

1. Read the canonical documentation relevant to your task.
2. Create a feature branch from `dev`.
3. Implement one feature at a time (vertical slice).
4. Run all checks:
   ```bash
   # Backend
   cd PETSHOP-API && mvn verify

   # Frontend
   cd PETSHOP-UI && npm run lint && npx tsc --noEmit && npm run test && npm run build
   ```
5. Submit a pull request to `dev`.
6. Update `PROJECT_PROGRESS.md` when completing a phase.

---

## Branch Strategy

```
feature/*  →  Pull Request  →  dev  →  main
                                │         │
                          Auto-deploy   Production
                          (shared dev)
```

| Branch | Purpose |
|--------|---------|
| `feature/*` | Feature development |
| `dev` | Integration + shared cloud environment |
| `main` | Production-ready releases |

Never push directly to `main`. All work flows through `dev` via PR.

---

## License

License to be determined.
