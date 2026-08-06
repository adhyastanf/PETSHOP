# Oyen — Frontend Architecture

## Stack
- Next.js
- TypeScript
- TanStack Query for server state
- Zustand for limited shared client/UI state
- React local state for local UI
- Form library may be selected consistently (e.g. React Hook Form) when implementation begins

## State Ownership
```text
Backend/PostgreSQL = business source of truth
TanStack Query      = fetched server-state cache
Zustand             = cross-page client/UI state when truly needed
React state         = component-local state
URL/search params   = shareable navigation/filter state
```

Do not store product lists, orders, bookings and other backend collections in Zustand merely to avoid API calls; TanStack Query handles server-state caching.

## Suggested App Areas
Depending on deployment choice:
```text
app/
├── (customer)/
├── merchant/
├── admin/
└── auth/
```

Use route layouts for authorization-aware UX, while backend remains the real authorization boundary.

## Feature-Oriented Source Structure
```text
src/
├── app/
├── features/
│   ├── auth/
│   ├── products/
│   ├── services/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   └── bookings/
├── components/
├── lib/
│   ├── api/
│   └── query/
├── stores/
├── types/
└── utils/
```

## API Client
Centralize:
- base URL,
- auth header,
- token refresh behavior,
- error normalization,
- trace/correlation ID capture where useful.

Do not scatter raw `fetch` implementations with inconsistent behavior across pages.

## TanStack Query
Use stable query keys:
```text
['products', filters]
['product', productId]
['merchant-orders', filters]
['booking', bookingId]
```
Mutations invalidate/refetch only relevant data.

## Zustand
Appropriate examples:
- temporary UI wizard state that spans routes,
- non-server UI preferences,
- modal/workflow coordination.

Persistence to localStorage must be explicit. Zustand itself does not guarantee refresh persistence.

## Forms
Client validation improves UX; server validation remains authoritative. Never trust calculated price, voucher discount, inventory or slot availability from client state.

## Rendering
Use server rendering where beneficial for public discovery/SEO and client components for interactive flows. Avoid forcing every screen into client rendering.

## Security
Do not store long-lived secrets in browser-accessible code. UI role checks are convenience, not security.

## Error UX
Normalize API errors by stable `code`; show useful messages and preserve `traceId` for support/debugging where appropriate.


---

## Internationalization (i18n)

### Purpose

The application supports multiple languages without runtime refactoring. All user-facing text is externalized into translation resources.

### Architecture

```text
src/
├── locales/
│   ├── en/                    ← English (source language)
│   │   ├── common.json
│   │   ├── auth.json
│   │   ├── customer.json
│   │   ├── pets.json
│   │   ├── checkout.json
│   │   └── merchant.json
│   └── id/                    ← Bahasa Indonesia (first localization)
│       ├── common.json
│       ├── auth.json
│       └── ...
├── lib/
│   └── i18n.ts               ← Translation provider setup
└── components/
    └── Provider/
        └── I18nProvider.tsx   ← Language context wrapper
```

### Supported Languages

| Language | Code | Status |
|----------|------|--------|
| English | `en` | Source language (canonical) |
| Bahasa Indonesia | `id` | First localization |

### Translation Library Strategy

Use `next-intl` or equivalent Next.js-compatible i18n library. The library must support:
- Static and dynamic route segments
- Server and client components
- Namespace-based organization
- Interpolation and pluralization
- Lazy loading of locale bundles

### Translation Key Naming Convention

Keys are grouped by feature with dot notation:

```text
auth.login.title
auth.login.email
auth.login.password
auth.register.title
common.cancel
common.save
common.delete
common.loading
checkout.summary.total
merchant.products.title
pets.register.title
pets.form.name
```

Rules:
- `common.*` — shared across features (buttons, labels, errors)
- `{feature}.*` — feature-specific text
- Use camelCase for multi-word segments: `auth.forgotPassword.title`
- Keep keys stable — never rename without migration

### Language Persistence

- Store preference in `localStorage` key: `oyen_locale`
- Default: browser `navigator.language` detection
- Fallback: `en` (English)
- User can override in settings

### Dynamic Content Rules

- Product names, merchant names, service names: **never translate** (user-generated)
- Reviews, chat messages: **never translate**
- Status labels, categories, error codes: **translate via keys**
- Dates and numbers: use `Intl` API for locale-aware formatting

### Performance Considerations

- Load only the active locale bundle
- Split translation files by feature (lazy load per route)
- English strings can be used as fallback without loading a separate bundle
- Do not load all locales upfront
