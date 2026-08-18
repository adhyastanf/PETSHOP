# Oyen — API Contract

Single canonical API reference. Covers conventions, response formats, and endpoint catalog.

---

## Overview

All public application APIs use base path `/api/v1`.

Authentication: Bearer token in `Authorization` header. Never in query strings.

Public IDs: UUID strings. Money: decimal numbers. Dates: ISO-8601.

---

## Authentication

| Endpoint | Auth Required |
|----------|--------------|
| `/api/v1/auth/register` | No |
| `/api/v1/auth/login` | No |
| `/api/v1/auth/refresh` | No |
| All other endpoints | Yes (Bearer token) |

Token lifecycle:
- Login/register returns `accessToken` + `refreshToken`
- Access token: short-lived (15 min)
- Refresh token: long-lived (7 days), rotated on use
- Logout revokes refresh token

---

## Common Response Format

### Single resource
```json
{
  "data": {
    "id": "uuid",
    "...": "..."
  }
}
```

### Paginated collection
```json
{
  "data": [],
  "pagination": {
    "page": 0,
    "size": 20,
    "totalElements": 0,
    "totalPages": 0
  }
}
```

Default pagination: `page=0`, `size=20`. Maximum size defined centrally.

---

## Error Responses

```json
{
  "code": "PRODUCT_NOT_FOUND",
  "message": "Product was not found",
  "details": [],
  "timestamp": "2026-01-01T00:00:00Z",
  "traceId": "..."
}
```

`code` = stable/machine-readable. `message` = human-readable.

This is the single canonical error contract. Every API endpoint must return errors in this exact structure. `code` is stable/machine-readable. `message` is human-readable. `details` contains field-level validation errors when applicable. `traceId` enables log correlation.

### HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 201 | Created |
| 204 | Success, no content |
| 400 | Malformed/structurally invalid request |
| 401 | Unauthenticated |
| 403 | Authenticated but forbidden |
| 404 | Not found or inaccessible |
| 409 | Business conflict / concurrency / state conflict |
| 422 | Semantically invalid business input |
| 429 | Rate limited |
| 500 | Unexpected server failure |

---

## HTTP Semantics

- `GET` — read
- `POST` — create or command
- `PUT` — full replacement (rare)
- `PATCH` — partial update
- `DELETE` — delete or deactivate

Use intent endpoints for business commands:
```
POST /api/v1/bookings/{id}/confirm
POST /api/v1/orders/{id}/ship
POST /api/v1/withdrawals/{id}/approve
```

Never expose generic status PATCH endpoints.

---

## Conventions

- **Naming:** plural nouns for collections, camelCase JSON fields
- **IDs:** UUID strings
- **Money:** decimal numbers, never floating-point
- **Dates:** ISO-8601 (`YYYY-MM-DD` for dates, full timestamp with timezone for instants)
- **Pagination:** `page` + `size` query params, sorting/filtering via explicit allowlists
- **Idempotency:** webhooks use provider event identity; critical client commands support idempotency key
- **Versioning:** breaking changes require new API version; additive fields are non-breaking
- **Security:** never expose password hashes, raw tokens, provider secrets, or internal audit payloads

---

## Endpoint Catalog

Validate each endpoint against business rules and authorization matrix.

---

### Auth

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| POST | `/api/v1/auth/register` | Register new customer | No | — |
| POST | `/api/v1/auth/login` | Login with email/password | No | — |
| POST | `/api/v1/auth/refresh` | Refresh access token | No | — |
| POST | `/api/v1/auth/logout` | Revoke refresh token | Yes | — |
| POST | `/api/v1/auth/forgot-password` | Request password reset | No | — |
| POST | `/api/v1/auth/reset-password` | Reset password with token | No | — |
| POST | `/api/v1/auth/verify-email` | Verify email address | No | — |
| POST | `/api/v1/auth/verify-phone` | Verify phone/OTP | No | — |
| POST | `/api/v1/auth/oauth/{provider}` | OAuth login (Google/Apple) | No | — |
| GET | `/api/v1/auth/sessions` | List active sessions | Yes | Own |
| DELETE | `/api/v1/auth/sessions/{id}` | Revoke specific session | Yes | Own |

**Request/Response:**
- Register: `{ fullName, email, password, phoneNumber? }` → `{ userId, accessToken, refreshToken, tokenType, expiresIn }`
- Login: `{ email, password }` → same as register
- Refresh: `{ refreshToken }` → same as register
- Logout: `{ refreshToken }` → 204

**Errors:** `INVALID_CREDENTIALS`, `DUPLICATE_EMAIL`, `DUPLICATE_PHONE`, `ACCOUNT_BLOCKED`, `ACCOUNT_SUSPENDED`, `ACCOUNT_INACTIVE`, `INVALID_TOKEN`

---

### Customer

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| GET | `/api/v1/me` | Get current user profile | Yes | Own |
| GET | `/api/v1/customer/profile` | Get customer profile | Yes | CUSTOMER |
| PATCH | `/api/v1/customer/profile` | Update customer profile | Yes | CUSTOMER |
| GET | `/api/v1/customer/addresses` | List own addresses | Yes | CUSTOMER |
| POST | `/api/v1/customer/addresses` | Create address | Yes | CUSTOMER |
| GET | `/api/v1/customer/addresses/{id}` | Get address detail | Yes | CUSTOMER + Own |
| PATCH | `/api/v1/customer/addresses/{id}` | Update address | Yes | CUSTOMER + Own |
| DELETE | `/api/v1/customer/addresses/{id}` | Delete address | Yes | CUSTOMER + Own |
| PATCH | `/api/v1/customer/addresses/{id}/default` | Set as default | Yes | CUSTOMER + Own |

---

### Pets

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| GET | `/api/v1/pets` | List own pets | Yes | CUSTOMER |
| POST | `/api/v1/pets` | Register a pet | Yes | CUSTOMER |
| GET | `/api/v1/pets/{id}` | Get pet detail | Yes | CUSTOMER + Own |
| PATCH | `/api/v1/pets/{id}` | Update pet | Yes | CUSTOMER + Own |
| DELETE | `/api/v1/pets/{id}` | Delete pet | Yes | CUSTOMER + Own |
| GET | `/api/v1/pets/{id}/vaccinations` | Pet vaccination history | Yes | CUSTOMER + Own |
| GET | `/api/v1/pets/types` | List pet types | Yes | CUSTOMER |
| GET | `/api/v1/pets/breeds` | List breeds by type | Yes | CUSTOMER |

---

---

### Pet Ownership Transfer

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| POST | `/api/v1/pets/{petId}/ownership-transfers` | Request ownership transfer | Yes | CUSTOMER + Own |
| GET | `/api/v1/pet-ownership-transfers` | List transfers (sent/received) | Yes | CUSTOMER |
| POST | `/api/v1/pet-ownership-transfers/{transferId}/accept` | Accept transfer | Yes | Recipient |
| POST | `/api/v1/pet-ownership-transfers/{transferId}/reject` | Reject transfer | Yes | Recipient |
| POST | `/api/v1/pet-ownership-transfers/{transferId}/cancel` | Cancel pending transfer | Yes | Current Owner |

**Request (create):** `{ "recipientUserId": "OYEN-8F42K1" }`

**States:** `PENDING` → `ACCEPTED` / `REJECTED` / `CANCELLED` / `EXPIRED`

**Rules:**
- Only current owner can initiate
- Only intended recipient can accept/reject
- Only current owner can cancel while PENDING
- Ownership changes atomically only on ACCEPTED
- Pet ID never changes
- One active PENDING transfer per pet at a time

---

### Pet Care & Reminders

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| POST | `/api/v1/pets/{petId}/care-events` | Record care event | Yes | CUSTOMER + Own |
| GET | `/api/v1/pets/{petId}/care-events` | List pet care history | Yes | CUSTOMER + Own |
| GET | `/api/v1/pets/{petId}/reminders` | List upcoming reminders | Yes | CUSTOMER + Own |
| PATCH | `/api/v1/reminders/{reminderId}` | Update reminder (dismiss/snooze) | Yes | CUSTOMER + Own |
| POST | `/api/v1/merchant/bookings/{bookingId}/care-follow-up` | Merchant records next care date | Yes | Merchant + Authorized |

---

### Discovery

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| GET | `/api/v1/merchants/nearby` | Find nearby merchants | Yes | CUSTOMER |

Query params: `latitude`, `longitude`, `radius`, `category`, `service`, `openNow`, `rating`, `page`, `size`

---

### Home (Personalized)

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| GET | `/api/v1/home` | Personalized home sections | Yes | CUSTOMER |

Response sections: `petCare`, `recommendedProducts`, `recommendedServices`, `nearbyMerchants`, `buyAgain`, `recentlyViewed`

---

### Public Marketplace

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| GET | `/api/v1/products` | Browse products | No | — |
| GET | `/api/v1/products/{id}` | Product detail | No | — |
| GET | `/api/v1/services` | Browse services | No | — |
| GET | `/api/v1/services/{id}` | Service detail | No | — |
| GET | `/api/v1/services/{id}/availability` | Available slots | Yes | CUSTOMER |
| GET | `/api/v1/merchants` | Browse merchants | No | — |
| GET | `/api/v1/merchants/{id}` | Merchant detail | No | — |

---

### Merchant

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| POST | `/api/v1/merchant/applications` | Submit merchant application | Yes | CUSTOMER |
| GET | `/api/v1/merchant/profile` | Get merchant profile | Yes | Merchant role |
| PATCH | `/api/v1/merchant/profile` | Update merchant profile | Yes | Merchant role |
| — | `/api/v1/merchant/branches/**` | Branch CRUD + hours + closures | Yes | Merchant role |
| — | `/api/v1/merchant/staff/**` | Staff management | Yes | Merchant Admin+ |
| — | `/api/v1/merchant/products/**` | Product CRUD + variants + images | Yes | Merchant role |
| — | `/api/v1/merchant/inventory/**` | Inventory management + movements | Yes | Merchant role |
| — | `/api/v1/merchant/services/**` | Service CRUD + pricing + availability + staff assignment + schedules | Yes | Merchant role |

---

### Catalog (Merchant Operations)

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| POST | `/api/v1/merchant/products` | Create product | Yes | Merchant role |
| PATCH | `/api/v1/merchant/products/{id}` | Update product | Yes | Merchant + Own |
| POST | `/api/v1/merchant/products/{id}/variants` | Add variant | Yes | Merchant + Own |
| PATCH | `/api/v1/merchant/products/{id}/variants/{vid}` | Update variant | Yes | Merchant + Own |
| — | `/api/v1/merchant/products/{id}/images/**` | Product image management | Yes | Merchant + Own |

---

### Inventory

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| GET | `/api/v1/merchant/inventory` | View branch-variant inventory | Yes | Merchant role |
| POST | `/api/v1/merchant/inventory/adjust` | Adjust stock (creates movement) | Yes | Merchant role |
| GET | `/api/v1/merchant/inventory/movements` | View movement history | Yes | Merchant role |

Internal (system-triggered, not public API):
- Reserve stock (checkout)
- Release reservation (cancel/expire)
- Finalize reservation (fulfillment)

---

### Services & Scheduling

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| POST | `/api/v1/merchant/services` | Create service | Yes | Merchant role |
| PATCH | `/api/v1/merchant/services/{id}` | Update service | Yes | Merchant + Own |
| — | `/api/v1/merchant/services/{id}/pricing/**` | Pricing rules | Yes | Merchant + Own |
| — | `/api/v1/merchant/services/{id}/branches/**` | Branch availability | Yes | Merchant + Own |
| — | `/api/v1/merchant/services/{id}/staff/**` | Staff assignment | Yes | Merchant + Own |
| — | `/api/v1/merchant/staff/{id}/schedules/**` | Staff schedule management | Yes | Merchant role |

---

### Cart

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| GET | `/api/v1/cart` | Get current cart | Yes | CUSTOMER |
| DELETE | `/api/v1/cart` | Clear cart | Yes | CUSTOMER |
| POST | `/api/v1/cart/products` | Add product to cart | Yes | CUSTOMER |
| PATCH | `/api/v1/cart/products/{itemId}` | Update quantity | Yes | CUSTOMER |
| DELETE | `/api/v1/cart/products/{itemId}` | Remove product item | Yes | CUSTOMER |
| POST | `/api/v1/cart/services` | Add service to cart | Yes | CUSTOMER |
| PATCH | `/api/v1/cart/services/{itemId}` | Update service item | Yes | CUSTOMER |
| DELETE | `/api/v1/cart/services/{itemId}` | Remove service item | Yes | CUSTOMER |

---

### Checkout

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| POST | `/api/v1/checkouts` | Create checkout from cart | Yes | CUSTOMER |
| GET | `/api/v1/checkouts/{id}` | Get checkout details | Yes | CUSTOMER + Own |
| POST | `/api/v1/checkouts/{id}/shipping-quotes` | Get shipping quotes | Yes | CUSTOMER + Own |
| PATCH | `/api/v1/checkouts/{id}/shipping` | Select shipping option | Yes | CUSTOMER + Own |
| POST | `/api/v1/checkouts/{id}/voucher` | Apply voucher | Yes | CUSTOMER + Own |
| DELETE | `/api/v1/checkouts/{id}/voucher` | Remove voucher | Yes | CUSTOMER + Own |
| POST | `/api/v1/checkouts/{id}/confirm` | Confirm checkout | Yes | CUSTOMER + Own |

---

### Payment

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| POST | `/api/v1/checkouts/{id}/payments` | Create payment attempt | Yes | CUSTOMER + Own |
| GET | `/api/v1/checkouts/{id}/payments` | List payment attempts | Yes | CUSTOMER + Own |
| GET | `/api/v1/payments/{id}` | Get payment status | Yes | CUSTOMER + Own |
| POST | `/api/v1/webhooks/payments/{provider}` | Payment webhook callback | No (signature verified) | — |

---

### Orders

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| GET | `/api/v1/orders` | Customer: list own orders | Yes | CUSTOMER |
| GET | `/api/v1/orders/{id}` | Customer: order detail | Yes | CUSTOMER + Own |
| POST | `/api/v1/orders/{id}/cancel` | Customer: cancel order | Yes | CUSTOMER + Own |
| GET | `/api/v1/merchant/orders` | Merchant: list orders in scope | Yes | Merchant role |
| GET | `/api/v1/merchant/orders/{id}` | Merchant: order detail | Yes | Merchant + Own |
| POST | `/api/v1/merchant/orders/{id}/process` | Merchant: start processing | Yes | Merchant + Own |
| POST | `/api/v1/merchant/orders/{id}/ready-to-ship` | Merchant: mark ready | Yes | Merchant + Own |
| POST | `/api/v1/merchant/orders/{id}/ship` | Merchant: ship order | Yes | Merchant + Own |

**Shipping:**

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| GET | `/api/v1/orders/{id}/shipment` | Get shipment info | Yes | Own |
| GET | `/api/v1/orders/{id}/shipment/tracking` | Get tracking events | Yes | Own |
| POST | `/api/v1/webhooks/shipping/{provider}` | Shipping webhook | No (signature verified) | — |

---

### Bookings

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| GET | `/api/v1/bookings` | Customer: list own bookings | Yes | CUSTOMER |
| GET | `/api/v1/bookings/{id}` | Customer: booking detail | Yes | CUSTOMER + Own |
| POST | `/api/v1/bookings/{id}/cancel` | Customer: cancel booking | Yes | CUSTOMER + Own |
| GET | `/api/v1/merchant/bookings` | Merchant: list in scope | Yes | Merchant role |
| GET | `/api/v1/merchant/bookings/{id}` | Merchant: detail | Yes | Merchant + Own |
| POST | `/api/v1/merchant/bookings/{id}/confirm` | Merchant: confirm | Yes | Merchant + Own |
| POST | `/api/v1/merchant/bookings/{id}/reject` | Merchant: reject | Yes | Merchant + Own |
| POST | `/api/v1/merchant/bookings/{id}/check-in` | Staff: check in | Yes | Staff + Assigned |
| POST | `/api/v1/merchant/bookings/{id}/start` | Staff: start service | Yes | Staff + Assigned |
| POST | `/api/v1/merchant/bookings/{id}/complete` | Staff: complete | Yes | Staff + Assigned |
| POST | `/api/v1/merchant/bookings/{id}/no-show` | Staff: mark no-show | Yes | Staff + Assigned |

---

### Finance

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| GET | `/api/v1/merchant/finance/summary` | Balance summary | Yes | Merchant Admin+ |
| GET | `/api/v1/merchant/finance/ledger` | Ledger entries | Yes | Merchant Admin+ |
| GET | `/api/v1/merchant/finance/settlements` | Settlement list | Yes | Merchant Admin+ |
| GET | `/api/v1/merchant/finance/settlements/{id}` | Settlement detail | Yes | Merchant Admin+ |
| GET | `/api/v1/merchant/bank-accounts` | List bank accounts | Yes | Merchant Admin+ |
| POST | `/api/v1/merchant/bank-accounts` | Add bank account | Yes | Merchant Admin+ |
| DELETE | `/api/v1/merchant/bank-accounts/{id}` | Remove bank account | Yes | Merchant Admin+ |
| POST | `/api/v1/merchant/withdrawals` | Request withdrawal | Yes | Merchant Admin+ |
| GET | `/api/v1/merchant/withdrawals` | List withdrawals | Yes | Merchant Admin+ |

---

### Reviews

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| GET | `/api/v1/products/{id}/reviews` | Product reviews (public) | No | — |
| POST | `/api/v1/products/{id}/reviews` | Submit product review | Yes | CUSTOMER (eligible) |
| GET | `/api/v1/services/{id}/reviews` | Service reviews (public) | No | — |
| POST | `/api/v1/services/{id}/reviews` | Submit service review | Yes | CUSTOMER (eligible) |
| GET | `/api/v1/merchant/reviews` | Merchant: reviews in scope | Yes | Merchant role |
| POST | `/api/v1/merchant/reviews/{id}/reply` | Merchant: reply to review | Yes | Merchant role |

---

### Favorites

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| GET | `/api/v1/favorites/products` | List product favorites | Yes | CUSTOMER |
| POST | `/api/v1/favorites/products/{id}` | Add product favorite | Yes | CUSTOMER |
| DELETE | `/api/v1/favorites/products/{id}` | Remove product favorite | Yes | CUSTOMER |
| GET | `/api/v1/favorites/services` | List service favorites | Yes | CUSTOMER |
| POST | `/api/v1/favorites/services/{id}` | Add service favorite | Yes | CUSTOMER |
| DELETE | `/api/v1/favorites/services/{id}` | Remove service favorite | Yes | CUSTOMER |
| GET | `/api/v1/favorites/merchants` | List merchant favorites | Yes | CUSTOMER |
| POST | `/api/v1/favorites/merchants/{id}` | Add merchant favorite | Yes | CUSTOMER |
| DELETE | `/api/v1/favorites/merchants/{id}` | Remove merchant favorite | Yes | CUSTOMER |

---

### Chat

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| GET | `/api/v1/conversations` | List conversations | Yes | Member |
| POST | `/api/v1/conversations` | Start/get conversation | Yes | CUSTOMER/Merchant |
| GET | `/api/v1/conversations/{id}/messages` | Get messages | Yes | Member |
| POST | `/api/v1/conversations/{id}/messages` | Send message | Yes | Member |
| POST | `/api/v1/conversations/{id}/messages/{msgId}/attachments` | Send attachment | Yes | Member |
| PATCH | `/api/v1/conversations/{id}/read` | Mark as read | Yes | Member |

---

### Notifications

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| GET | `/api/v1/notifications` | List notifications | Yes | Own |
| PATCH | `/api/v1/notifications/{id}/read` | Mark read | Yes | Own |
| PATCH | `/api/v1/notifications/read-all` | Mark all read | Yes | Own |
| GET | `/api/v1/notifications/preferences` | Get preferences | Yes | Own |
| PUT | `/api/v1/notifications/preferences` | Update preferences | Yes | Own |

---

### Promotions

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| GET | `/api/v1/promotions` | Active promotions (public) | No | — |
| GET | `/api/v1/vouchers/validate` | Validate voucher code | Yes | CUSTOMER |

Merchant voucher/campaign management under `/api/v1/merchant/promotions/**`.

---

### Refunds

| Method | URL | Purpose | Auth | Permission |
|--------|-----|---------|------|------------|
| POST | `/api/v1/refunds` | Request refund | Yes | CUSTOMER |
| GET | `/api/v1/refunds` | List own refunds | Yes | CUSTOMER |
| GET | `/api/v1/refunds/{id}` | Refund detail | Yes | Own |

---

### Admin

All admin endpoints under `/api/v1/admin/**`. Require `ADMIN` or `SUPER_ADMIN` role.

| Method | URL | Purpose |
|--------|-----|---------|
| GET/PATCH | `/api/v1/admin/users/**` | User management |
| GET/POST | `/api/v1/admin/merchants/**` | Merchant applications, verification |
| POST | `/api/v1/admin/veterinarians/{id}/verify` | Verify/reject vet |
| — | `/api/v1/admin/catalog/**` | Category, brand, product/service moderation |
| — | `/api/v1/admin/transactions/**` | Checkouts, orders, bookings, payments inspection |
| — | `/api/v1/admin/refunds/**` | Refund review, approve/reject |
| — | `/api/v1/admin/finance/**` | Commission rules, settlements, withdrawals |
| — | `/api/v1/admin/vouchers/**` | Platform voucher management |
| — | `/api/v1/admin/campaigns/**` | Campaign management |
| — | `/api/v1/admin/banners/**` | Banner/CMS management |
| — | `/api/v1/admin/disputes/**` | Dispute management |
| — | `/api/v1/admin/roles/**` | RBAC management |
| — | `/api/v1/admin/configuration/**` | System configuration |
| — | `/api/v1/admin/webhooks/**` | Webhook event inspection |
| — | `/api/v1/admin/audit-logs/**` | Audit log access |

---

## OpenAPI / Swagger

Available at `/swagger-ui/index.html` in non-production environments.
API docs JSON at `/v3/api-docs`.
