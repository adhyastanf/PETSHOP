# Oyen — Frontend Architecture

Scope: the `PETSHOP-UI` (Next.js) application. Visual documents are in this folder: `DESIGN_SYSTEM.md` and `UI_PATTERNS.md`. The backend API contract (`API_CONTRACT.md`) and authorization rules (`AUTHORIZATION_MATRIX.md`) are maintained with the API project, in `PETSHOP-API/docs/`.

## Stack
- Next.js (App Router, `proxy.ts` middleware) and TypeScript
- next-intl for i18n and locale-prefixed routing
- TanStack Query for server state, Axios as the HTTP client
- Zustand for limited cross-component client/UI state
- React Hook Form with Zod resolvers for forms
- shadcn/ui + Tailwind CSS for components, Sonner for toasts
- Vitest + Testing Library for tests

## State Ownership
```text
Backend/PostgreSQL = business source of truth
TanStack Query      = fetched server-state cache
Zustand             = cross-component client/UI state (modal open/mode/selected id, cart UI)
React state         = component-local state
URL/search params   = shareable navigation/filter state
Cookies (httpOnly)  = auth tokens; never readable from client JavaScript
```

Do not store product lists, orders, bookings, or other backend collections in Zustand. TanStack Query owns server-state caching.

Current Zustand stores (`src/store/`): `address-store`, `pets-store` (modal open/mode/id), `alert-modal-store` (global dialog), `cart-store`.

## Source Structure
```text
src/
├── app/
│   ├── [locale]/                  All pages, localized (/id/..., /en/...)
│   │   ├── layout.tsx             Root layout: NextIntlClientProvider, QueryProvider, Toaster, AppAlertDialog
│   │   ├── (auth)/                login, register
│   │   ├── (customer)/            storefront, cart, product, user/settings/[tab], customer/merchant-*
│   │   ├── (mitra)/               merchant workspace: /mitra, branches, profile, setup, staff
│   │   ├── (admin)/               admin: /admin, merchants, veterinarians, commission-rules, payment-methods, settings
│   │   └── (unauthorized)/        /unauthorized (403 page)
│   └── api/                       Next.js route handlers (auth + proxy), see Auth below
├── proxy.ts                       Middleware: next-intl routing + auth/role checks
├── containers/                    Page-level feature UI: <Domain>/<Domain>Containers.tsx + Form/
│   ├── Address/ Pets/ Profile/    Customer account settings
│   ├── Admin/                     Commission rules, payment methods, system settings, merchant/vet verification, dashboard
│   ├── Mitra/                     Merchant workspace: home, branches, branch detail + hours, profile, setup, staff
│   └── Merchant/                  Customer merchant application and status
├── features/                      Feature modules with their own service/query/types (config, merchant)
├── services/                      API service modules (auth.service.ts, customer.service.ts)
├── hooks/                         TanStack Query hooks (use-auth, use-customer) and UI hooks
├── store/                         Zustand stores
├── components/                    Shared components (Dialog, Modal, Input/FormField, Loading, Empty, Layout, feedback/PageState, general/status-badge, ui/)
├── lib/
│   ├── api.ts                     Axios instance (same-origin /api) + ApiError normalization
│   ├── api-error.ts               ApiError class
│   ├── errors/                    Error-code → message mapping
│   ├── schema/                    Zod schemas (auth, address, pet, user, commission, config, merchant) + shared validation.ts
│   ├── i18n/                      next-intl routing, navigation, request config
│   └── alert-dialog.ts            alertDialog.confirm/success/error/warning/info helper
├── locales/                       Translation JSON per locale and namespace
├── types/                         TypeScript types matching backend DTOs
├── utils/                         format, permissions, route-utils, get-error-message, show-api-error, label-format
└── __tests__/                     Vitest tests
```

### Pages and containers
Route files under `app/[locale]/` stay thin. Feature UI lives in `containers/<Domain>/<Domain>Containers.tsx`, with modal forms in `containers/<Domain>/Form/`. Example: `user/settings/[tab]/page.tsx` maps `profile | address | pets` to `ProfileContainers | AddressContainers | PetsContainers`.

New features follow this containers pattern.

### Feature modules and shared building blocks
All screens, including the merchant and business-configuration screens, follow the containers pattern. `features/{config,merchant}/` stay as self-contained modules for service, query, and types; their UI lives in `containers/Admin`, `containers/Mitra`, and `containers/Merchant`.

Shared pieces used by containers:
- `components/Input/FormField`: `FormTextField`, `FormTextareaField`, `FormSelectField` (React Hook Form `Controller` + label + translated error). `hideLabel` exposes the label as `aria-label` when the surrounding UI already shows the text.
- `components/feedback/PageState`: `PageLoading`, `PageError`, `PageEmpty`.
- `components/general/status-badge`: `ActiveBadge`, `MerchantStatusBadge`.
- `components/general/link-card-grid`: dashboard navigation cards.
- `utils/show-api-error`: shows a mutation error as a Sonner toast.

## Authentication and API Access

The browser never holds tokens and never calls the Spring Boot API directly.

```text
Browser (axios, baseURL /api)
   → Next.js route handlers (src/app/api/...)
   → ${BACKEND_URL}/...  (Spring Boot, /api/v1/...)
```

- `app/api/auth/{login,register,logout,refresh}/route.ts` call the backend auth endpoints. Login and refresh store `accessToken` and `refreshToken` as **httpOnly** cookies (`sameSite=strict`, `secure` in production).
- `app/api/[...path]/route.ts` is a catch-all proxy. It strips the `/api` prefix, forwards to `${BACKEND_URL}`, injects `Authorization: Bearer <accessToken cookie>`, and on `401` refreshes the tokens once and retries. If refresh fails it clears the cookies.
- `lib/api.ts` is the only HTTP client. Its response interceptor converts every failure into `ApiError` (`status`, `code`, `details`, `traceId`). Do not scatter raw `fetch` or additional axios instances.
- Service endpoints are written relative to the backend API base, for example `/admin/config`, `/merchant/branches`, `/auth/login`.

Environment variables:

| Variable | Used by | Value |
|----------|---------|-------|
| `BACKEND_URL` | route handlers (server) | Backend base including `/api/v1`, e.g. `http://localhost:8080/api/v1`. The backend has no servlet context-path; `/api/v1` is declared on each controller. |
| `INTERNAL_APP_URL` | axios during SSR | Base URL of this Next.js app, e.g. `http://localhost:3000` |

Both must also be set in CI for `npm run build` (`.github/workflows/frontend.yml`).

### Current user and session
`useMe()` (`hooks/use-auth.ts`) is the single source for the current user and roles (query key `['auth','me']`). Use it to read the user or gate queries (`enabled: !!me`). There is no client-side auth store. `useLogin`, `useLogout`, and `useRegister` are the mutations; after login the user is routed by role via `utils/route-utils.ts` (`getHomeRoute`).

### Route protection
`proxy.ts` runs on every request. It checks the `accessToken` cookie (JWT `exp` and `authorities`), redirects unauthenticated users to `/login`, redirects authenticated users away from `/login` and `/register`, and enforces role rules, then hands the request to next-intl.

| Path | Requirement |
|------|-------------|
| `/admin` | `ROLE_SUPER_ADMIN` or `ROLE_ADMIN` |
| `/mitra` | `ROLE_PETSHOP_OWNER`, `ROLE_PETSHOP_ADMIN`, `ROLE_PETSHOP_STAFF`, `ROLE_GROOMER`, or `ROLE_VETERINARIAN` (mirrors the backend `@PreAuthorize` on `/api/v1/merchant/**`) |
| `/finance` | `PERM_finance.view` |

Authorities in the JWT are `ROLE_`-prefixed. Add a rule to `routePermissions` in `proxy.ts` when a new protected area is introduced. Middleware and UI role checks are convenience; the backend remains the real authorization boundary.

## Data Layer
Flow for every backend feature:

```text
types/<name>.ts            DTO-shaped types
   ↓
services/<name>.service.ts  (or features/<name>/<name>-service.ts)   calls `api` from @/lib/api
   ↓
hooks/use-<name>.ts         (or features/<name>/query.ts)            TanStack Query hooks
   ↓
containers / page           renders loading, error, empty, success
```

Services return `response.data`. Components never call Axios directly.

### TanStack Query
Use stable query keys and invalidate only what a mutation changes:
```text
['auth', 'me']
['config', 'commission-rules']
['merchant', 'branches', id]
['admin', 'applications']
```
Admin lists and merchant-scoped lists use different keys, so verification mutations must invalidate the admin key as well.

## Forms
Use React Hook Form with a Zod schema from `lib/schema/` (`zodResolver`) and the field components in `components/Input/FormField`. Zod error messages are translation keys (for example `common.validation.required`); `FormFieldError` translates them, so schemas never contain display text. Keep form values as strings for inputs and convert them to numbers/dates in the submit handler. Client validation improves UX; server validation remains authoritative. Never trust price, discount, inventory, or slot availability from client state. Prevent duplicate submissions by disabling or showing loading on the submit button.

## Dialogs, Confirmation, and Errors
- Confirmations and result dialogs use `alertDialog.confirm | success | error | warning | info` (`lib/alert-dialog.ts`), backed by `store/alert-modal-store` and rendered once by `<AppAlertDialog />` in the locale layout.
- Every submit or destructive action needs a confirmation modal, per the design system.
- API errors are shown with a Sonner toast. `utils/get-error-message.ts` maps the stable error `code` (see `lib/errors/`) to a translated message. Keep `traceId` for support where useful.
- Modal forms follow the `components/Modal` and `components/Dialog` wrappers; their open state lives in a feature store (for example `pets-store`).

## Rendering
Use server components where they help (page shells, `notFound()`, params) and client components for interactive flows. Pages read `params` asynchronously (`await params`). This Next.js version has breaking changes from older releases; read `PETSHOP-UI/node_modules/next/dist/docs/` before changing routing, middleware, or caching.

## Security
- Tokens live only in httpOnly cookies. Do not store tokens in `localStorage`, `sessionStorage`, Zustand, or any client-readable cookie.
- Never expose secrets in `NEXT_PUBLIC_*` variables.
- UI role checks are convenience, not security.

## Testing
Vitest + Testing Library in `src/__tests__/`. Wrap components that call `useTranslations` in `NextIntlClientProvider` with messages from `@/locales`. Mock `useMe` from `@/hooks/use-auth` for auth-dependent hooks. Run with `npm run test`. CI runs type-check, tests, and build; lint is non-blocking.

---

## Platform Service Consumption

Frontend must consume only API contracts. Frontend must never assume provider-specific behavior.

Rules:
- Never reference storage URLs with provider-specific paths (use API-returned URLs).
- Never assume payment provider redirect behavior (follow API instructions).
- Never assume shipping provider tracking URL format (use API-provided links).
- Image URLs may change if storage provider changes. Always use API-provided URLs, never construct them.

---

## Internationalization (i18n)

### Purpose
The application supports multiple languages. All user-facing text is externalized into translation resources. Hardcoded user-facing strings are prohibited in new code.

### Library
Oyen uses **next-intl** (v4). The earlier custom `I18nProvider` / `useI18n` was removed.

- `lib/i18n/routing.ts` — `locales: ['id', 'en']`, `defaultLocale: 'id'`, `localePrefix: 'always'` (every URL carries `/id` or `/en`).
- `lib/i18n/navigation.ts` — locale-aware `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname`. Use these instead of `next/link` and `next/navigation` for internal navigation that must keep the locale.
- `lib/i18n/request.ts` — resolves the locale from the `NEXT_LOCALE` cookie (falling back to the default) and loads messages through `getMessages(locale)` from `src/locales/index.ts`.
- `app/[locale]/layout.tsx` — wraps the app in `NextIntlClientProvider`.
- `proxy.ts` — composes the next-intl middleware with the auth checks.

### Message files
```text
src/locales/
├── index.ts                 Aggregates namespaces per locale; exports Locale, getMessages
├── en/  common, auth, customer, pet, address, error, merchant, config (.json)
└── id/  same namespaces
```

Add a namespace by creating `<ns>.json` in both locales and registering it in `locales/index.ts`.

### Usage
```tsx
import { useTranslations, useLocale } from 'next-intl';

const t = useTranslations();            // root translator, full dot-path keys
t('config.nav.commissionRules');
t('config.payment.deactivateDescription', { name });  // ICU {name} placeholders
const locale = useLocale();             // 'id' | 'en'
```

Messages use ICU syntax. Avoid literal apostrophes and braces in message text, and keep placeholders simple (`{name}`). Unlike the old helper, next-intl does not silently return the key for a missing key, so add every key to both locales.

### Key naming
```text
common.cancel
auth.login.title
config.commission.unlimited
merchant.application.title
```
- `common.*` — shared across features (buttons, labels)
- `<namespace>.*` — feature-specific text
- camelCase for multi-word segments: `auth.forgotPassword.title`
- Keep keys stable; never rename without migrating both locales

### Language switching and persistence
Switching language navigates to the same path under the other locale through the next-intl navigation helpers (`components/Layout/language-switcher.tsx`). The chosen locale is carried by the URL prefix and the `NEXT_LOCALE` cookie. There is no `localStorage` locale key.

### Dynamic content rules
- Product names, merchant names, service names: **never translate** (user-generated)
- Reviews, chat messages: **never translate**
- Status labels, categories, error codes: **translate via keys**
- Dates and numbers: use `Intl` (for example `features/config/format.ts`), never hand-formatted strings
