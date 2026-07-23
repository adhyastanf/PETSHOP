# MVP API Endpoint Catalog
Baseline only; validate each endpoint against business rules and authorization.

## Auth
`POST /api/v1/auth/register`, `/login`, `/refresh`, `/logout`, `/forgot-password`, `/reset-password`, `/verify-email`, `/verify-phone`, `/oauth/{provider}`; `GET /api/v1/auth/sessions`; `DELETE /api/v1/auth/sessions/{id}`.

## Customer
`GET/PATCH /api/v1/me`; `GET/POST /api/v1/me/addresses`; `PATCH/DELETE /api/v1/me/addresses/{id}`; `POST .../{id}/default`.

## Pets
`GET/POST /api/v1/pets`; `GET/PATCH/DELETE /api/v1/pets/{id}`; `GET /api/v1/pets/{id}/vaccinations`.

## Public Marketplace
`GET /api/v1/products`, `/products/{id}`, `/services`, `/services/{id}`, `/services/{id}/availability`, `/merchants`, `/merchants/{id}`.

## Merchant
`POST /api/v1/merchant/applications`; submit application; `GET/PATCH /api/v1/merchant/profile`; branch, hours, staff, product, variant, inventory, service, pricing, staff-assignment and schedule management under `/api/v1/merchant/...`.

## Cart
`GET/DELETE /api/v1/cart`; `POST/PATCH/DELETE /api/v1/cart/products...`; equivalent `/services...`.

## Checkout
`POST /api/v1/checkouts`; `GET /api/v1/checkouts/{id}`; shipping quotes/selections; voucher apply/remove; `POST /api/v1/checkouts/{id}/confirm`.

## Payment
`POST /api/v1/checkouts/{id}/payments`; `GET .../payments`; `GET /api/v1/payments/{id}`; `POST /api/v1/webhooks/payments/{provider}`.

## Orders/Shipping
Customer: `GET /api/v1/orders`, `/orders/{id}`, cancel; shipment/tracking.
Merchant: list/detail plus intent commands `/process`, `/ready-to-ship`, `/ship`.
Webhook: `POST /api/v1/webhooks/shipping/{provider}`.

## Bookings
Customer list/detail/cancel. Merchant list/detail plus `/confirm`, `/reject`, `/check-in`, `/start`, `/complete`, `/no-show`.

## Refund
Customer request/list/detail; admin list plus approve/reject.

## Reviews/Favorites
Product/service review endpoints and product/service/merchant favorite add/remove/list endpoints.

## Chat/Notifications
Conversation list/create/messages/read; notification list/read/read-all and preference GET/PUT.

## Merchant Finance
Summary, ledger, settlements, bank accounts and withdrawals under `/api/v1/merchant/finance...` and `/api/v1/merchant/withdrawals`.

## Admin
Users, merchant applications, veterinarian verification, catalog moderation, transactions, refunds, settlements, withdrawals, categories, brands, vouchers, campaigns, banners, disputes and audit logs under `/api/v1/admin`.

Use intent endpoints for state transitions. Never expose generic status PATCH endpoints.
