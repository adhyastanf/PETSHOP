# Pet Marketplace — Frontend Architecture

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
