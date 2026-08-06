# Oyen — API Contract Standards

## Base
All public application APIs use `/api/v1`.

Examples:
```text
/api/v1/auth
/api/v1/pets
/api/v1/products
/api/v1/services
/api/v1/cart
/api/v1/checkouts
/api/v1/orders
/api/v1/bookings
/api/v1/payments
/api/v1/merchant/...
/api/v1/admin/...
```

## HTTP Semantics
- `GET` read
- `POST` create/command
- `PUT` full replacement only when truly appropriate
- `PATCH` partial update
- `DELETE` delete/deactivate where semantics permit

Use intent endpoints for business commands:
```text
POST /api/v1/bookings/{id}/confirm
POST /api/v1/orders/{id}/ship
POST /api/v1/withdrawals/{id}/approve
```
Do not expose arbitrary status mutation.

## Success Response
For a single resource, prefer:
```json
{
  "data": {
    "id": "uuid"
  }
}
```

For paginated resources:
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

## Error Response
```json
{
  "code": "PRODUCT_NOT_FOUND",
  "message": "Product was not found",
  "details": [],
  "timestamp": "2026-01-01T00:00:00Z",
  "traceId": "..."
}
```

`code` is stable/machine-readable; `message` is human-readable.

## HTTP Status Guidance
- 200 success
- 201 created
- 204 successful no-content
- 400 malformed/structurally invalid request
- 401 unauthenticated
- 403 authenticated but forbidden
- 404 inaccessible/not found resource
- 409 business conflict/concurrency/state conflict
- 422 semantically invalid business input where project chooses to distinguish it
- 429 rate limited
- 500 unexpected server failure

## Pagination
Default `page=0`, `size=20`. Define maximum size centrally. Sorting/filtering use explicit allowlists.

## IDs
Public IDs are UUID strings.

## Money
API monetary values should be decimal numbers or documented decimal strings consistently. Never use floating-point calculations internally.

## Dates
Use ISO-8601. Date-only fields use `YYYY-MM-DD`; timestamps include timezone/UTC.

## Authentication
Protected APIs use bearer authentication. Never place access tokens in query strings.

## Idempotency
Provider webhooks use provider event identity. For selected client commands such as payment creation/checkout finalization, support an idempotency key when duplicate submissions are materially dangerous.

## Versioning
Breaking API changes require a new API version or controlled migration. Additive response fields should be treated as non-breaking by clients.

## OpenAPI / Swagger
Spring Boot should expose OpenAPI documentation in non-production/internal environments as configured. Document request/response DTOs and important error outcomes.

## Naming
Use plural nouns for collections and consistent camelCase JSON fields.

## Security
Never expose password hashes, raw refresh tokens, private provider secrets, unmasked financial secrets or internal-only audit payloads.
