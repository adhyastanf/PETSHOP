# MVP User Stories
Each story inherits Acceptance Criteria and Definition of Done.

## Identity
- **US-AUTH-001 Register:** visitor registers securely; uniqueness enforced and customer role assigned.
- **US-AUTH-002 Login:** valid credentials authenticate; invalid credentials do not enumerate accounts.
- **US-AUTH-003 Sessions:** refresh rotation/revocation works and revoked token cannot replay.

## Customer/Pet
- **US-CUS-001 Profile:** customer manages permitted profile fields.
- **US-CUS-002 Addresses:** customer manages only own addresses/default.
- **US-PET-001 Pet:** customer creates/manages only own pets.
- **US-PET-002 Vaccination:** customer views basic vaccination history for own pet.

## Merchant
- **US-MER-001 Apply:** business submits merchant application/documents.
- **US-MER-002 Verify:** authorized admin approves/rejects with history.
- **US-MER-003 Branch:** merchant manages owned branches/hours.
- **US-MER-004 Staff:** merchant manages scoped staff/branch assignments.
- **US-MER-005 Vet:** admin verifies veterinarian licenses.

## Catalog/Inventory
- **US-PROD-001 Product:** merchant creates/manages product.
- **US-PROD-002 Variant:** merchant manages options, variants, SKU and prices.
- **US-PROD-003 Discovery:** customer browses product catalog/detail.
- **US-INV-001 Stock:** merchant adjusts branch-variant stock with movement.
- **US-INV-002 Reserve:** checkout atomically reserves stock.
- **US-INV-003 Release/Finalize:** reservations release/finalize exactly once.

## Services
- **US-SVC-001 Service:** merchant creates service and confirmation mode.
- **US-SVC-002 Pricing:** merchant configures pet/breed/weight pricing.
- **US-SVC-003 Availability:** configure branches, staff and schedules.
- **US-SVC-004 Search Slots:** customer gets backend-computed availability.
- **US-SVC-005 Hold Slot:** checkout temporarily holds capacity safely.

## Cart/Checkout
- **US-CART-001 Product Cart:** add/update/remove product.
- **US-CART-002 Service Cart:** add/update/remove service with pet/slot context.
- **US-CART-003 Mixed Cart:** multiple merchants and product+service coexist.
- **US-CHK-001 Checkout:** validate cart and create snapshots.
- **US-CHK-002 Totals:** backend calculates all totals.
- **US-CHK-003 Resources:** reserve stock/slots safely.
- **US-CHK-004 Expiration:** expired checkout releases resources once.

## Payment/Fulfillment
- **US-PAY-001 Attempt:** create payment attempt.
- **US-PAY-002 Webhook:** verified webhook finalizes exactly once.
- **US-PAY-003 Retry:** unpaid checkout may create new attempt.
- **US-ORD-001 Split Orders:** product items become merchant/branch orders.
- **US-ORD-002 Process:** merchant progresses own order legally.
- **US-SHP-001 Shipping:** quote/create/track shipment.
- **US-BKG-001 Booking:** paid service becomes booking.
- **US-BKG-002 Auto Confirm:** auto mode confirms when eligible.
- **US-BKG-003 Merchant Confirm:** merchant-confirm mode requires acceptance.
- **US-BKG-004 Fulfill:** staff checks in/starts/completes.
- **US-BKG-005 Vaccination:** completed vaccination creates history once.

## Refund/Finance
- **US-REF-001 Cancel:** backend computes cancellation/refund eligibility.
- **US-REF-002 Refund:** provider refund processed idempotently.
- **US-FIN-001 Commission:** applicable commission preserved.
- **US-FIN-002 Ledger:** financial movements post immutably once.
- **US-FIN-003 Settlement:** eligible earnings settle without duplication.
- **US-FIN-004 Withdrawal:** merchant requests within available balance; processing is idempotent.

## Engagement/Marketing/Admin
- **US-REV-001 Reviews:** eligible completed transactions can be reviewed.
- **US-FAV-001 Favorites:** manage product/service/merchant favorites.
- **US-CHAT-001 Chat:** authorized members exchange messages/attachments.
- **US-NOT-001 Notifications:** transactional notifications respect preferences.
- **US-VOU-001 Voucher:** backend validates scope/time/limits and discount.
- **US-CAM-001 Promotions:** authorized actor schedules promotions/campaigns.
- **US-DIS-001 Dispute:** eligible user opens dispute/evidence.
- **US-DIS-002 Resolution:** authorized admin resolves dispute.
- **US-ADM-001 Admin:** admins operate marketplace only through explicit permissions/audit.
