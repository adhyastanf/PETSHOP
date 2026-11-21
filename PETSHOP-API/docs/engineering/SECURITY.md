# Security Requirements

## Authentication
Modern adaptive password hashing; short-lived access tokens; revocable/rotatable refresh sessions; expiring single-use OTP/reset tokens; verified OAuth provider identity.

## Authorization
Every protected operation evaluates authentication + permission + resource ownership/merchant scope + branch/staff scope + lifecycle eligibility. UI guards are not security.

## Tenant Isolation
All client UUIDs are untrusted. Validate merchant/branch/product/service/order/booking relationships server-side.

## API/Input
HTTPS outside local dev; environment CORS allowlist; CSRF strategy matching auth architecture; Bean Validation; allowlisted sort/filter; parameterized queries; request/upload size limits; rate limits for login/OTP/reset and abuse-prone endpoints.

## Payments/Webhooks
Verify signatures; retain event IDs; enforce idempotency; reconcile provider amount/currency/checkout; never trust frontend payment success.

## Finance
BigDecimal; explicit permissions for refunds/adjustments/settlements/withdrawals; immutable audit/ledger semantics; protect/encrypt sensitive bank values and display masked forms.

## Files
Validate type and size; randomized object keys; private storage for business documents/licenses/chat/dispute evidence; authorized signed access; never trust filename as path. Storage implementations MUST contain resolved paths within the storage root and reject path traversal (`../`) and absolute-path escapes — enforced in `LocalStorageService` (see `architecture/ARCHITECTURE_DECISIONS.md`).

## Secrets
DB credentials, signing keys, provider keys, OAuth secrets, storage credentials and messaging credentials belong in secret/environment management, never Git. `.env.example` contains names only.

## Logging
Never log passwords, raw tokens, authorization headers, provider secrets, full bank data or private keys. Use sanitized trace IDs.

## Error Responses
Client error responses must not leak internal details (raw exception messages, stack traces, SQL). Unexpected errors return a generic message with a stable status; the full detail is logged server-side only. Enforced in `GlobalExceptionHandler` (see `architecture/ARCHITECTURE_DECISIONS.md`).

## Database
Application account should not be PostgreSQL superuser. Use least privilege, network controls and protected/encrypted backups.

## Admin
Explicit permissions and audit logs. MFA should be considered mandatory for privileged production admin accounts before launch.

## Production security gate
Authorization/IDOR tests, webhook replay tests, private-file tests, secrets/dependency scans, HTTPS/CORS/token config and backup restore must be verified.
