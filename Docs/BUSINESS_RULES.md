# Pet Marketplace — Business Rules

Rule IDs are stable references for code, tests and tickets.

## Identity
- **BR-ID-001:** A user account has globally unique canonical email/phone where supplied.
- **BR-ID-002:** Suspended users cannot perform protected marketplace operations.
- **BR-ID-003:** Authentication does not imply authorization.

## Merchant
- **BR-MER-001:** A branch belongs to exactly one merchant.
- **BR-MER-002:** Merchant users may only operate on merchants/branches to which they are authorized.
- **BR-MER-003:** Only sell-enabled/approved merchants may publish purchasable offerings.
- **BR-MER-004:** Suspended merchants cannot accept new marketplace transactions.

## Pet
- **BR-PET-001:** Customer can mutate only pets they own.
- **BR-PET-002:** Booking pet must belong to booking customer.
- **BR-PET-003:** Vaccination history is basic history, not a full medical record.

## Product & Inventory
- **BR-INV-001:** Inventory is tracked per product variant + branch.
- **BR-INV-002:** `available = on_hand - reserved`.
- **BR-INV-003:** Available inventory cannot become negative.
- **BR-INV-004:** Every stock mutation creates an auditable stock movement.
- **BR-INV-005:** Reservation/finalization/release operations must be concurrency safe and idempotent.
- **BR-INV-006:** Product/variant must be active and belong to the referenced merchant before purchase.
- **BR-INV-007:** Historical order data uses snapshots; catalog edits cannot rewrite old orders.

## Service & Scheduling
- **BR-SVC-001:** Service can be available only at explicitly configured branches.
- **BR-SVC-002:** Applicable service price is selected/validated by backend.
- **BR-SVC-003:** Availability considers branch hours, service branch, staff assignment, schedule, exceptions, bookings and active holds.
- **BR-SVC-004:** Active slot holds block conflicting capacity.
- **BR-SVC-005:** Expired/released holds no longer block capacity.
- **BR-SVC-006:** A service requiring verified veterinarian cannot be confirmed with an ineligible veterinarian.
- **BR-SVC-007:** Booking confirmation mode is configured per service.
- **BR-SVC-008:** Historical booking service/price data uses snapshots.

## Cart
- **BR-CART-001:** A customer has at most one active normal cart unless a future cart model explicitly changes this.
- **BR-CART-002:** Cart may contain multiple merchants.
- **BR-CART-003:** Cart may contain both product and service items.
- **BR-CART-004:** Cart price is informational until backend checkout validation.
- **BR-CART-005:** Adding an item never bypasses final inventory/availability validation.

## Checkout
- **BR-CHK-001:** Checkout is the purchase aggregation boundary.
- **BR-CHK-002:** Product items become orders; service items become bookings.
- **BR-CHK-003:** Backend recalculates every monetary total.
- **BR-CHK-004:** Checkout preserves transaction snapshots.
- **BR-CHK-005:** Checkout finalization is idempotent.
- **BR-CHK-006:** A checkout cannot be paid twice.

## Order
- **BR-ORD-001:** An order contains physical product fulfillment only.
- **BR-ORD-002:** Product items are split by required merchant/fulfillment boundary.
- **BR-ORD-003:** Merchant may only operate its own orders.
- **BR-ORD-004:** Invalid order state transitions are rejected.

## Booking
- **BR-BKG-001:** A booking represents service fulfillment only.
- **BR-BKG-002:** `AUTO_CONFIRM` may confirm after successful payment when all requirements remain valid.
- **BR-BKG-003:** `MERCHANT_CONFIRM` requires merchant acceptance after payment.
- **BR-BKG-004:** Booking state transitions must follow the canonical state machine.
- **BR-BKG-005:** Cancellation/refund eligibility is calculated by backend policy.
- **BR-BKG-006:** Completed vaccination booking may create a vaccination-history record idempotently.

## Payment
- **BR-PAY-001:** Payment belongs to checkout.
- **BR-PAY-002:** Multiple payment attempts may exist for one checkout.
- **BR-PAY-003:** Provider callbacks must be authenticated/validated where provider supports signatures.
- **BR-PAY-004:** Duplicate callbacks must not duplicate stock, bookings, orders or money.
- **BR-PAY-005:** Client-provided payment success is never authoritative.
- **BR-PAY-006:** Provider transaction identifiers must be unique/idempotently handled.

## Shipping
- **BR-SHP-001:** Shipping applies only to physical-product fulfillment.
- **BR-SHP-002:** Shipping quote is a snapshot and may expire.
- **BR-SHP-003:** Shipment webhooks/events are idempotently processed.
- **BR-SHP-004:** Shipping origin is the actual fulfillment branch.

## Promotions
- **BR-PRO-001:** Backend determines promotion/voucher eligibility.
- **BR-PRO-002:** Usage limits are concurrency safe.
- **BR-PRO-003:** Expired/inactive promotions cannot affect new checkout totals.

## Finance
- **BR-FIN-001:** Merchant balance cannot be changed without corresponding ledger semantics.
- **BR-FIN-002:** Ledger entries are immutable; corrections use compensating entries.
- **BR-FIN-003:** Commission is calculated from the rule effective for the transaction and preserved as a snapshot/result.
- **BR-FIN-004:** Withdrawal cannot exceed eligible available balance.
- **BR-FIN-005:** Withdrawal processing is idempotent.
- **BR-FIN-006:** Settlement items cannot be settled twice.
- **BR-FIN-007:** Monetary calculations use decimal arithmetic, never floating point.

## Reviews
- **BR-REV-001:** Product reviews require an eligible completed product transaction.
- **BR-REV-002:** Service reviews require an eligible completed booking.
- **BR-REV-003:** Review uniqueness/eligibility must be enforced by backend.

## Security
- **BR-SEC-001:** Never authorize based only on an ID supplied by frontend.
- **BR-SEC-002:** Every merchant-scoped query validates merchant ownership/access.
- **BR-SEC-003:** Private files/chat require ownership or membership authorization.
- **BR-SEC-004:** Sensitive financial/admin actions are audited.
