# PETSHOP-UI

Frontend for the Oyen pet marketplace.

## Stack

- Next.js (App Router) and React, TypeScript
- next-intl (`id` / `en`, locale-prefixed routes)
- TanStack Query + Axios, Zustand
- React Hook Form + Zod
- shadcn/ui + Tailwind CSS, Sonner
- Vitest + Testing Library

## Getting Started

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Routes are locale-prefixed (`/id/...`, `/en/...`).

## Environment

| Variable | Purpose |
|----------|---------|
| `BACKEND_URL` | Backend base used by the Next.js API proxy, including `/api/v1` (e.g. `http://localhost:8080/api/v1`) |
| `INTERNAL_APP_URL` | Base URL of this app, used by axios during SSR (e.g. `http://localhost:3000`) |

The browser calls same-origin `/api/*`; the Next.js route handlers add the auth token from httpOnly cookies and forward to the backend.

## Scripts

```bash
npm run test      # Vitest
npx tsc --noEmit  # type-check
npm run lint
npm run build
```

## Structure

Route groups under `src/app/[locale]/`: `(auth)`, `(customer)`, `(mitra)`, `(admin)`, `(unauthorized)`. Feature UI lives in `src/containers/`.

## Documentation

UI documents live in [`docs/`](docs/):

| Document | Purpose |
|----------|---------|
| [FRONTEND_ARCHITECTURE.md](docs/FRONTEND_ARCHITECTURE.md) | Architecture, auth proxy, data layer, i18n, conventions |
| [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Visual design system and component specs |
| [UI_PATTERNS.md](docs/UI_PATTERNS.md) | Page composition patterns |

The backend API contract is maintained in the API project (`PETSHOP-API/docs/API_CONTRACT.md`).
