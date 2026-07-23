# Pet Marketplace — State Machines

Exact enum names may be refined during implementation, but transitions must remain explicit and validated.

## Merchant Verification
```text
DRAFT -> SUBMITTED -> UNDER_REVIEW -> APPROVED
                     |             -> REJECTED
APPROVED -> SUSPENDED
REJECTED -> SUBMITTED (resubmission)
```
No direct `DRAFT -> APPROVED` through normal merchant workflow.

## Booking
```text
PENDING_PAYMENT
  -> PAID
      -> CONFIRMED                 [AUTO_CONFIRM]
      -> PENDING_CONFIRMATION      [MERCHANT_CONFIRM]
           -> CONFIRMED
           -> CANCELLED
CONFIRMED -> CHECKED_IN -> IN_PROGRESS -> COMPLETED
CONFIRMED -> CANCELLED
CONFIRMED -> NO_SHOW
PAID/PENDING_CONFIRMATION/CONFIRMED/CANCELLED -> REFUNDED
```
Refund status may also be modeled separately in `refunds`; booking `REFUNDED` represents the resulting business state.

Forbidden examples: `COMPLETED -> IN_PROGRESS`, `CANCELLED -> CONFIRMED`, `REFUNDED -> PAID`.

## Order
```text
PENDING_PAYMENT -> PAID -> PROCESSING -> READY_TO_SHIP
READY_TO_SHIP -> SHIPPED -> DELIVERED -> COMPLETED
PENDING_PAYMENT/PAID/PROCESSING -> CANCELLED (subject to policy)
CANCELLED/COMPLETED -> REFUNDED or PARTIALLY_REFUNDED where model supports it
```
Shipping/provider events must not skip business validation.

## Payment Attempt
```text
PENDING -> PAID
PENDING -> FAILED
PENDING -> EXPIRED
PENDING -> CANCELLED
```
`PAID` is terminal for the payment attempt. A retry creates another attempt rather than resetting a terminal attempt.

## Refund
```text
REQUESTED -> APPROVED -> PROCESSING -> REFUNDED
REQUESTED -> REJECTED
PROCESSING -> FAILED
FAILED -> PROCESSING (explicit retry if supported)
```

## Shipment
```text
PENDING -> READY_FOR_PICKUP -> PICKED_UP -> IN_TRANSIT
IN_TRANSIT -> OUT_FOR_DELIVERY -> DELIVERED
PENDING/READY_FOR_PICKUP -> CANCELLED
IN_TRANSIT -> EXCEPTION
EXCEPTION -> IN_TRANSIT / RETURNED
```
Provider-specific statuses map into canonical internal statuses.

## Slot Hold
```text
ACTIVE -> CONSUMED
ACTIVE -> EXPIRED
ACTIVE -> RELEASED
```
Terminal holds are never reactivated.

## Withdrawal
```text
REQUESTED -> APPROVED -> PROCESSING -> COMPLETED
REQUESTED -> REJECTED
PROCESSING -> FAILED
FAILED -> PROCESSING (controlled retry)
```

## Settlement
```text
DRAFT -> CALCULATED -> APPROVED -> PROCESSING -> COMPLETED
DRAFT/CALCULATED -> CANCELLED
PROCESSING -> FAILED
FAILED -> PROCESSING (controlled retry)
```

## Veterinarian Verification
```text
PENDING -> VERIFIED
PENDING -> REJECTED
VERIFIED -> EXPIRED
REJECTED -> PENDING (resubmission)
EXPIRED -> PENDING (renewal)
```

## Transition Implementation Rule
Each aggregate exposes intent-oriented operations (`confirmBooking`, `shipOrder`, `approveWithdrawal`) rather than arbitrary public `setStatus`. Services validate actor, current state, prerequisites and side effects in one controlled transaction.
