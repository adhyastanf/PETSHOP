# Critical MVP Test Cases

## Security/Auth
- valid registration/login/refresh/revoke;
- duplicate identity rejected;
- revoked token replay fails;
- anonymous protected API fails;
- customer A cannot access B pet/order;
- merchant A cannot access B catalog/order;
- branch-scoped staff cannot mutate unauthorized branch;
- non-member cannot read conversation/private file.

## Inventory
- adjustment creates movement;
- cannot reserve above available;
- two concurrent buyers race for last unit and only one wins;
- duplicate finalize/release is safe;
- old order snapshots survive catalog edits.

## Scheduling
- branch closed/schedule exception blocks availability;
- ineligible/unverified staff rejected;
- pricing rule selected correctly;
- active hold blocks capacity;
- expiry restores capacity;
- concurrent final-slot attempts respect capacity;
- another customer's pet cannot be booked.

## Cart/Checkout
- product-only, service-only, multi-merchant and mixed checkout;
- stale client price ignored;
- unavailable offering rejected;
- snapshots stable;
- expiration releases resources once;
- duplicate finalization creates no duplicate fulfillment.

## Payment
- invalid signature rejected;
- valid paid webhook finalizes;
- replay same webhook repeatedly produces one effect;
- browser success alone does not mark paid;
- failed attempt can retry;
- concurrent success callbacks remain idempotent.

## Fulfillment
- correct order splitting;
- merchant ownership enforced;
- invalid order/booking transitions rejected;
- shipment origin is fulfillment branch;
- tracking webhook replay safe;
- auto-confirm vs merchant-confirm correct;
- vaccination completion creates exactly one history record.

## Promotions/Refunds
- valid/expired/wrong-scope vouchers;
- concurrent usage limit enforcement;
- frontend discount ignored;
- full/partial refund;
- duplicate refund callback safe;
- unauthorized refund approval rejected.

## Finance
- effective commission rule;
- ledger posts once and is immutable;
- refund creates compensating effect;
- settlement item cannot settle twice;
- withdrawal above balance rejected;
- concurrent withdrawals cannot overspend;
- duplicate payout callback cannot debit twice.

## Release E2E
1. Customer → pet → grooming → payment → completion → review.
2. Two merchants → one checkout → independent orders.
3. Mixed product + service checkout.
4. Verified-vet vaccination → history.
5. Cancellation/refund.
6. Merchant sale → settlement → withdrawal.
