# Reusable Acceptance Criteria

## API
Correct method/status; validated input; stable error shape; contract-only fields; OpenAPI updated; pagination/filter conventions followed.

## Authorization
Anonymous protected requests fail. Missing permission fails. Replacing UUID cannot cross customer/merchant/branch scope. Backend, not UI, enforces access.

## Database
Migration succeeds from clean DB; appropriate FK/unique/check/indexes exist; released migrations remain immutable.

## Money
Decimal arithmetic only; backend recalculates; currency/rounding convention followed; historical snapshots remain stable.

## Inventory
Cannot reserve above available; concurrency cannot oversell; reserve/finalize/release idempotent; every mutation has movement history.

## Booking
Validate pet ownership, service branch, applicable price, staff/vet eligibility, schedule, exceptions and capacity. Concurrent booking cannot exceed capacity. Invalid transitions fail.

## Payment
Verify provider authenticity; frontend status is never truth; duplicate callbacks produce one effect; external IDs retained; retries use new attempts.

## Finance
Immutable ledger; no unexplained balance mutation; duplicate processing cannot double-credit/debit; withdrawals cannot overspend.

## Frontend
Applicable loading, empty, validation error, API error, retry/recovery and pending-submit states exist. UI never becomes business source of truth.

## Tests
Happy path + invalid input + unauthenticated + unauthorized + not found + state conflict + idempotency; concurrency tests for stock/slots/finance.

A story is accepted only when its story requirements and all applicable reusable criteria pass.
