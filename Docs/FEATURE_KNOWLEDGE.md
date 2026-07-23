# Pet Marketplace --- MVP Feature Knowledge Document

**Version:** 1.0\
**Status:** Canonical MVP Feature Specification\
**Frontend:** Next.js + TypeScript\
**Backend:** Spring Boot 3 + Java 21\
**Database:** PostgreSQL\
**Companion:** `Pet_Marketplace_MVP_Database_Knowledge.md`

## Product Vision

A multi-vendor pet marketplace where independent petshops, clinics,
groomers, and pet-service businesses register as merchants and sell
physical pet products and bookable services. Customers can shop across
merchants, book services for their pets, pay in a unified checkout,
track fulfillment, chat, review transactions, and maintain basic
pet/vaccination data.

## Locked Business Decisions

1.  Merchant can have multiple branches.
2.  Cart can contain products from multiple merchants.
3.  Products and services can coexist in the same cart and checkout.
4.  Booking confirmation is configurable per service: `AUTO_CONFIRM` or
    `MERCHANT_CONFIRM`.
5.  Customer pays the platform; merchant funds flow through
    commission/settlement.
6.  Product shipping uses a shipping aggregator.
7.  Veterinary/vaccination services require a verified veterinarian.
8.  MVP includes basic vaccination history, not a full veterinary EMR.
9.  Orders represent physical-product fulfillment.
10. Bookings represent service fulfillment.
11. Checkout is the aggregation boundary.
12. Payment belongs to checkout.
13. Backend is authoritative for prices, discounts, inventory,
    availability, fees, and totals.

## Actors

-   Customer
-   Merchant Owner
-   Merchant Admin
-   Merchant Staff
-   Groomer
-   Veterinarian
-   Platform Admin
-   Super Admin

# Feature Catalog

## 1. Authentication & Accounts

-   Email registration
-   Phone registration
-   Password login/logout
-   Google OAuth
-   Apple OAuth
-   Email verification
-   OTP/phone verification
-   Forgot/reset password
-   Refresh tokens
-   Multiple device sessions
-   Session revocation
-   Login history
-   Device history
-   Push token registration
-   Profile management
-   Profile image
-   Activate/deactivate/suspend/block accounts

## 2. RBAC

Initial roles: `SUPER_ADMIN`, `ADMIN`, `CUSTOMER`, `PETSHOP_OWNER`,
`PETSHOP_ADMIN`, `PETSHOP_STAFF`, `GROOMER`, `VETERINARIAN`.

Supports granular permissions, platform/merchant scopes, role-based
menus and backend API authorization. Frontend visibility is never
sufficient authorization.

## 3. Customer Profile & Addresses

-   Customer profile
-   Multiple addresses
-   Default address
-   Recipient name/phone
-   Province/city/district/subdistrict/postal code
-   Delivery notes
-   Latitude/longitude
-   Historical shipping-address snapshots

## 4. Pet Profiles

-   Multiple pets/customer
-   Pet type/species
-   Breed
-   Gender
-   Birth date / estimated birth date
-   Weight
-   Color
-   Sterilization
-   Microchip
-   Pet photo
-   Allergies
-   Special notes

Only the pet owner may modify/use the pet for customer booking flows.

## 5. Basic Vaccination History

-   Vaccine type/name
-   Vaccination date
-   Next vaccination date
-   Batch number
-   Merchant/clinic and branch
-   Veterinarian
-   Certificate
-   Notes
-   Booking linkage
-   Completed vaccination booking may generate vaccination history

## 6. Merchant Registration & Verification

-   Merchant registration
-   Business/display name
-   Description
-   Email/phone/WhatsApp
-   NIB/NPWP
-   Logo/banner
-   Business documents
-   Application submission
-   Admin review
-   Approve/reject
-   Rejection reason
-   Resubmission
-   Suspension
-   Verification history

States: `DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`,
`SUSPENDED`.

## 7. Multi-Branch Merchant

Each merchant can manage multiple branches with independent: -
Address/GPS - Contacts - Business hours - Closures - Inventory -
Services - Staff - Schedules - Booking availability

## 8. Business Hours

-   Weekly branch hours
-   Closed weekdays
-   Holiday closures
-   Temporary closures
-   Special opening hours
-   Closure reasons

## 9. Merchant Staff

-   Add staff
-   Assign roles
-   Multi-branch assignment
-   Activate/deactivate
-   Employee code
-   Join date
-   Groomer management
-   Veterinarian management

## 10. Veterinarian Verification

-   License number
-   License document
-   Expiration
-   Admin verification
-   States: `PENDING`, `VERIFIED`, `REJECTED`, `EXPIRED`
-   Veterinary services requiring verification cannot be confirmed with
    an unverified vet

## 11. Product Marketplace

-   Create/edit/archive product
-   Category/subcategory
-   Brand
-   Pet-type targeting
-   Description
-   Product status/condition
-   Minimum quantity
-   Images
-   Ratings
-   Sold count

## 12. Product Categories & Brands

-   Hierarchical categories
-   Admin category management
-   Brand name/slug/logo
-   Active/inactive brands

## 13. Product Options & Variants

-   Configurable options such as size/flavor
-   Variant SKU
-   Barcode
-   Price
-   Compare-at price
-   Weight
-   Dimensions
-   Active state
-   Variant-specific images

Inventory is variant + branch scoped.

## 14. Branch Inventory

-   Quantity on hand
-   Reserved quantity
-   Available quantity
-   Reorder level
-   Initial stock
-   Restock
-   Adjustment
-   Reservation
-   Reservation release
-   Sale deduction
-   Return/correction
-   Concurrency-safe stock operations

`available = quantity_on_hand - quantity_reserved`

## 15. Stock Movement History

Immutable movement history for inventory auditing and reconciliation.

## 16. Service Marketplace

Services may include grooming, vaccination, veterinary consultation,
nail trimming, ear cleaning, flea treatment, dental cleaning, etc.

Supports: - Service categories - Description - Duration - Branch
availability - Pet types - Pricing - Assigned staff - Confirmation
mode - Verified-vet requirement - Status - Ratings

## 17. Flexible Service Pricing

Price may depend on: - Pet type - Breed - Minimum/maximum weight -
Pricing label

Backend determines/validates applicable price.

## 18. Service Availability by Branch

A merchant service can be enabled only at selected branches.

## 19. Service Staff Assignment

Staff can be assigned to specific services and branches. Only eligible
active staff may handle a booking.

## 20. Staff Scheduling

-   Weekly schedule
-   Branch-specific schedule
-   Start/end time
-   Capacity
-   Leave/sick day
-   Special schedule exceptions

## 21. Service Availability Calculation

Availability derives from:

``` text
Branch Hours
+ Service Branch Availability
+ Staff Assignment
+ Staff Schedule
+ Schedule Exceptions
- Existing Bookings
- Active Slot Holds
```

Backend is authoritative.

## 22. Service Slot Holds

Temporary slot reservation during checkout.

States: `ACTIVE`, `CONSUMED`, `EXPIRED`, `RELEASED`.

Expired/failed checkout releases the slot.

## 23. Service Booking

Flow:

``` text
Merchant → Service → Branch → Pet → Date → Slot → Staff → Cart → Checkout → Payment → Booking
```

Booking preserves service/pricing snapshots.

## 24. Configurable Booking Confirmation

`AUTO_CONFIRM`: successful payment can confirm automatically.

`MERCHANT_CONFIRM`: successful payment creates a pending-confirmation
booking that the merchant accepts/rejects according to policy.

## 25. Booking Lifecycle

Supports: `PENDING_PAYMENT`, `PAID`, `PENDING_CONFIRMATION`,
`CONFIRMED`, `CHECKED_IN`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`,
`NO_SHOW`, `REFUNDED`.

All meaningful transitions are recorded and invalid transitions
rejected.

## 26. Booking Cancellation & Policy

-   Customer/merchant/admin cancellation according to authorization
-   Cancellation reason
-   Fee
-   Refundable amount
-   Global or service-specific cancellation policy
-   Time-window-based refund percentage

## 27. Multi-Merchant Cart

One active cart can contain product items from multiple merchants and
branches.

## 28. Mixed Product + Service Cart

Physical products and bookable services can coexist in one cart. This is
a fundamental requirement and must not be split into separate checkout
systems without explicit approval.

## 29. Unified Checkout

Checkout aggregates product and service purchases.

A checkout can generate: - 0..N product orders - 0..N service bookings -
1..N payment attempts

Totals include product subtotal, service subtotal, shipping, applicable
fees, discounts, and grand total. Backend recalculates all totals.

## 30. Multi-Merchant Order Splitting

Product items are split into orders by merchant/fulfillment branch.
Service items become bookings, not order items.

## 31. Order Management

Merchant: - Incoming orders - Order details - Process/prepare -
Shipping - Fulfillment status - Customer delivery snapshot

Customer: - Order history - Order details - Status - Shipment tracking -
Eligible cancellation/refund - Review

## 32. Order Lifecycle

Conceptually supports: `PENDING_PAYMENT`, `PAID`, `PROCESSING`,
`READY_TO_SHIP`, `SHIPPED`, `DELIVERED`, `COMPLETED`, `CANCELLED`,
`REFUNDED`.

## 33. Shipping Aggregator

Shipping calculation uses branch origin, customer destination, package
weight/dimensions, external quotes, customer selection, and shipment
creation.

## 34. Shipping Rate Comparison

-   Multiple couriers
-   Multiple service levels
-   Cost
-   ETA
-   Quote expiration/revalidation

## 35. Shipment Tracking

-   Provider
-   Courier/service
-   External shipment ID
-   Tracking number
-   Cost
-   Estimated delivery
-   Status
-   Tracking event history

## 36. Payment Gateway

Potential methods include QRIS, virtual accounts, e-wallets, and cards.

Supports: - Payment creation - URL/instructions - Expiration -
Pending/paid/failed/expired/cancelled - External transaction ID -
Multiple payment attempts - Status history - Idempotent callbacks

## 37. Payment Success Processing

Successful payment must idempotently: 1. Mark payment successful. 2.
Process checkout. 3. Update related orders. 4. Update related bookings.
5. Consume slot holds. 6. Finalize inventory reservations. 7. Apply
booking confirmation rules. 8. Post appropriate financial records. 9.
Trigger events/notifications.

## 38. Payment Failure/Expiration

-   Release inventory reservations
-   Release service slot holds
-   Preserve history
-   Mark relevant entities
-   Allow retry/new payment attempt where permitted

## 39. Refunds

-   Product-order refund
-   Booking refund
-   Request/reason/amount
-   Approval/rejection
-   Provider processing/reference
-   Full or partial refund support

## 40. Marketplace Commission

Commission may vary by transaction type, merchant, category,
fixed/percentage calculation, effective dates, and priority.

## 41. Merchant Wallet

-   Pending balance
-   Available balance
-   Funds move according to fulfillment/settlement rules
-   Balance changes must correspond to ledger logic

## 42. Merchant Financial Ledger

Immutable entries for sales, commission, refunds, settlements,
withdrawals, and authorized adjustments.

## 43. Merchant Bank Accounts

-   Add payout account
-   Primary account
-   Holder name
-   Masked account display
-   Verification state
-   Sensitive account data protected/encrypted

## 44. Merchant Withdrawal

-   Request withdrawal
-   Select bank account
-   Fees
-   Status
-   External payout reference
-   Rejection reason
-   History
-   Cannot exceed eligible balance

## 45. Settlement

Settlement groups merchant earnings and calculates gross value minus
commission/refunds/adjustments to obtain net merchant settlement.

## 46. Product Reviews

-   Verified-transaction eligibility
-   1--5 stars
-   Title/content
-   Media
-   Moderation
-   Merchant reply
-   Aggregate rating

## 47. Service Reviews

Same review capabilities based on completed bookings.

## 48. Merchant Reputation

Merchant aggregate reputation can be derived from marketplace review
data. Advanced ranking algorithms are outside MVP.

## 49. Wishlist & Favorites

-   Product wishlist
-   Favorite services
-   Favorite merchants

## 50. Customer--Merchant Chat

-   General merchant conversations
-   Product/order/service/booking context
-   Text
-   Attachments
-   Conversation membership
-   Last-read/unread tracking

## 51. Notification Center

Notifications for: - Payments - Orders - Shipments -
Bookings/reminders - Refunds - Chat - Merchant verification -
Withdrawals - Promotions - System messages

## 52. Notification Preferences & Delivery

-   In-app
-   Push
-   Email
-   Per-type preferences
-   Provider delivery status
-   External ID
-   Failure information

## 53. Voucher System

-   Platform vouchers
-   Merchant vouchers
-   Code
-   Fixed/percentage discount
-   Maximum discount
-   Minimum purchase
-   Total/per-user limits
-   Validity period
-   Product/category/service targeting
-   Usage history

Backend determines eligibility and discount.

## 54. Campaigns & Promotions

-   Scheduled campaigns
-   Product promotions
-   Service promotions
-   Active periods
-   Merchant/platform marketing flows

## 55. Banner / Basic CMS

Admin-managed banners with image, placement, destination, active period,
and sort order.

## 56. Dispute Center

-   Order/booking-related disputes
-   Reason/type
-   Evidence
-   Discussion
-   Admin assignment
-   Resolution
-   Status/history

## 57. File & Media Management

Central file metadata supports profiles, pets, merchant media/docs,
products, vet licenses, vaccination certificates, reviews, chat,
disputes, and CMS.

Binary files should live in object storage such as S3-compatible
storage/MinIO; PostgreSQL stores metadata and object keys.

## 58. Admin User Management

-   Search/view users
-   Account status management
-   Suspension/blocking
-   Role management according to permissions
-   Audit sensitive actions

## 59. Admin Merchant Operations

-   Merchant applications
-   Verification/documents
-   Branch inspection
-   Suspension
-   Verification history

## 60. Admin Veterinarian Verification

Review licenses and verify/reject/handle expiration.

## 61. Admin Catalog Moderation

Inspect and disable inappropriate products/services where authorized.

## 62. Admin Transaction Operations

Inspect checkouts, orders, bookings, payments, refunds, and related
transaction context.

## 63. Admin Finance

Inspect/manage authorized: - Commission rules - Wallets - Ledger -
Settlements - Withdrawals - Financial adjustments

## 64. Admin Marketing

Manage platform vouchers, campaigns, promotions, and banners.

## 65. Admin Disputes

Assign, investigate, discuss, resolve/reject disputes.

## 66. Audit Logging

Immutable audit information can include actor, action, entity,
before/after values, IP, user agent, timestamp.

## 67. System Configuration

Central configuration may contain checkout expiration, slot-hold
duration, minimum withdrawal, default commission, review window, and
similar values.

## 68. External Webhooks

-   Payment webhooks
-   Shipping webhooks
-   Refund callbacks
-   Signature validation
-   Duplicate detection
-   Processing state/errors
-   Raw payload where safe
-   Idempotent processing

## 69. Shipping Quote Persistence

Store checkout/branch/provider/courier/service/cost/ETA/external
quote/expiration/selection/provider payload.

## 70. Search & Discovery

Customer discovery should support: - Product name - Product category -
Brand - Pet type - Service - Service category - Merchant -
Branch/location - Price - Rating - Nearby merchants using branch
coordinates

Elasticsearch/OpenSearch is not required for MVP.

# Customer Application

``` text
HOME
├── Search
├── Products
├── Services
├── Nearby Petshops
├── Categories
└── Promotions

MARKETPLACE
├── Product Listing / Detail
├── Service Listing / Detail
└── Merchant Detail

CART & CHECKOUT
├── Multi-Merchant Cart
├── Products + Services
├── Address
├── Shipping
├── Voucher
├── Payment
└── Result

ACTIVITY
├── Orders
├── Shipment Tracking
├── Bookings
├── Payments
├── Refunds
└── Reviews

MY PETS
├── Pet List / Detail
└── Vaccination History

MESSAGES
└── Merchant Chat

FAVORITES
├── Products
├── Services
└── Merchants

ACCOUNT
├── Profile
├── Addresses
├── Notifications
├── Preferences
├── Security
└── Devices
```

# Merchant Dashboard

``` text
DASHBOARD
CATALOG
├── Products
├── Variants
├── Images
├── Inventory
└── Stock History

SERVICES
├── Services
├── Pricing
├── Branch Availability
├── Staff
└── Scheduling

ORDERS
BOOKINGS
STAFF
REVIEWS
CHAT
PROMOTIONS

FINANCE
├── Pending Balance
├── Available Balance
├── Ledger
├── Settlements
├── Bank Accounts
└── Withdrawals

SETTINGS
├── Merchant Profile
├── Branches
├── Business Hours
├── Closures
└── Verification Documents
```

# Admin Dashboard

``` text
DASHBOARD
USERS
MERCHANTS
VETERINARIANS
CATALOG
TRANSACTIONS
├── Checkouts
├── Orders
├── Bookings
├── Payments
└── Refunds
SHIPPING
FINANCE
MARKETING
REVIEWS
DISPUTES
NOTIFICATIONS
RBAC
CONFIGURATION
WEBHOOK EVENTS
AUDIT LOGS
```

# Canonical Product Purchase Flow

``` text
Browse Product
→ Select Variant
→ Add to Cart
→ Validate Inventory
→ Checkout
→ Address
→ Shipping Quote
→ Voucher/Promotion
→ Backend Recalculates Total
→ Reserve Inventory
→ Payment
→ Payment Webhook
→ Orders
→ Merchant Fulfillment
→ Shipment
→ Tracking
→ Delivery/Completion
→ Settlement
→ Review
```

# Canonical Service Booking Flow

``` text
Browse Service
→ Branch
→ Pet
→ Applicable Price
→ Availability
→ Slot
→ Slot Hold
→ Cart
→ Checkout
→ Payment
→ Payment Webhook
→ Auto Confirm OR Merchant Confirmation
→ Check In
→ In Progress
→ Completed
→ Settlement
→ Review
```

Completed vaccination services may create basic vaccination-history
records.

# Canonical Mixed Checkout Flow

``` text
Cart
├── Product — Merchant A
├── Product — Merchant B
├── Grooming — Merchant A
└── Vaccination — Merchant C
        ↓
Unified Checkout
        ↓
Validate Inventory + Slots + Pet Ownership + Staff/Vet + Shipping + Discounts
        ↓
Reserve Inventory + Hold Slots
        ↓
Single Checkout Payment
        ↓
Payment Success
        ↓
├── Order A
├── Order B
├── Grooming Booking
└── Vaccination Booking
        ↓
Independent Fulfillment + Settlement
```

# Transaction Snapshot Rule

Historical transactions must retain what the customer actually
purchased/booked even if mutable product/service/merchant/address data
changes later. Orders and bookings therefore preserve relevant names,
prices, addresses, and other transaction snapshots.

# Concurrency Requirements

Critical concurrency-sensitive flows: - Inventory
reservation/deduction - Slot reservation - Booking creation - Payment
callbacks - Wallet changes - Settlement - Withdrawal

Use PostgreSQL transactions, constraints, locking/optimistic versioning
where appropriate, and idempotency.

# Security & Ownership Rules

-   Customer only modifies their own pets/addresses.
-   Merchant only accesses its own merchant data.
-   Merchant only processes its own orders/bookings.
-   Staff access depends on merchant/branch/role.
-   Chat requires membership.
-   Vet verification is admin-controlled.
-   Financial actions require explicit authorization.
-   Files inherit appropriate domain access rules.
-   Never trust IDs merely because the frontend supplied them.

# Backend Responsibilities

Spring Boot is authoritative for authentication, authorization,
validation, price/promotion/voucher calculation, inventory,
availability, reservations, commissions, cancellation/refund
calculation, checkout totals, payment processing, order/booking state
transitions, finance, integrations, and auditing.

# Frontend Responsibilities

Next.js handles UI, navigation, forms, UX validation, API interaction,
display, and client state.

Recommended state split:

``` text
TanStack Query → API/server state + caching
Zustand        → limited shared client/UI state
React state    → component-local state
```

Do not copy the backend database into Zustand.

# API Design Principle

APIs are domain-oriented, not table-oriented.

Possible groups:

``` text
/api/v1/auth
/api/v1/users
/api/v1/pets
/api/v1/merchants
/api/v1/products
/api/v1/inventory
/api/v1/services
/api/v1/availability
/api/v1/cart
/api/v1/checkout
/api/v1/orders
/api/v1/bookings
/api/v1/payments
/api/v1/refunds
/api/v1/reviews
/api/v1/chat
/api/v1/notifications
/api/v1/merchant/finance
/api/v1/admin
```

A database table does not automatically imply a public CRUD controller.

# Suggested Spring Boot Modules

``` text
auth
identity
rbac
customer
pet
merchant
staff
catalog
inventory
service
scheduling
cart
checkout
order
shipping
booking
payment
refund
finance
review
chat
notification
promotion
dispute
file
admin
integration
audit
configuration
```

Use a modular monolith for MVP unless scaling requirements later justify
extraction.

# MVP Non-Goals

Do not automatically implement: - Full veterinary EMR -
Telemedicine/video consultation - Pet insurance - Adoption marketplace -
Social/community feed - Loyalty points - Subscription plans - Full
procurement/WMS - Full accounting/general ledger - AI recommendation
engine - IoT pet devices - Elasticsearch/OpenSearch infrastructure -
Native mobile apps unless separately requested

# AI / Coding Agent Rules

1.  This file and the database knowledge document are canonical MVP
    context.
2.  Never merge products and services.
3.  Never merge orders and bookings.
4.  Checkout is the aggregation boundary.
5.  Payment belongs to checkout.
6.  Products and services can coexist in one cart.
7.  Cart supports multiple merchants.
8.  Merchant supports multiple branches.
9.  Inventory is variant + branch scoped.
10. Services can be branch-specific.
11. Staff can belong to multiple branches.
12. Enforce verified veterinarian requirements.
13. Never trust frontend prices, inventory, availability, discounts, or
    totals.
14. Preserve transaction snapshots.
15. Use UUID IDs.
16. Use `BigDecimal` / PostgreSQL `NUMERIC` for money.
17. Use timezone-aware timestamps.
18. Use Flyway migrations.
19. Never use Hibernate `ddl-auto=update` in production.
20. Use PostgreSQL constraints whenever practical.
21. Use transactional Spring services for cross-table invariants.
22. Webhooks and checkout finalization must be idempotent.
23. Ledger and stock movement records are immutable.
24. Financial operations require auditability.
25. Enforce customer/merchant/branch ownership.
26. Do not expose JPA entities directly as API DTOs.
27. Keep controllers thin.
28. Put business logic in application/domain services.
29. Put external providers behind adapters/interfaces.
30. Validate state transitions.
31. Add indexes based on real query patterns.
32. Do not create CRUD APIs merely because a table exists.
33. Avoid premature microservices.
34. Keep domain boundaries clear for future extraction.
35. Do not add non-MVP features without an explicit requirement change.

# Source-of-Truth Hierarchy

When requirements conflict, use: 1. Latest explicit human requirement 2.
This feature document 3. `Pet_Marketplace_MVP_Database_Knowledge.md` 4.
Accepted architecture decisions/ADRs 5. Existing production code 6.
Agent assumptions

Agents should flag unresolved conflicts instead of silently inventing
behavior.

# Product Definition

> A multi-vendor pet-commerce marketplace combining physical pet-product
> commerce and pet-service booking in one unified customer experience.

Core pillars:

1.  Multi-vendor marketplace
2.  Product commerce
3.  Service booking
4.  Pet profiles and basic vaccination history
5.  Multi-branch merchant operations
6.  Staff and verified veterinarian management
7.  Inventory and shipping
8.  Unified checkout and payment
9.  Marketplace commission and settlement
10. Reviews, chat, notifications, promotions, and disputes
