# Oyen — MVP User Stories

Each story inherits the applicable canonical requirements from `ACCEPTANCE_CRITERIA.md`, `DEFINITION_OF_DONE.md`, `FEATURE_KNOWLEDGE.md`, `BUSINESS_RULES.md`, `DATABASE_KNOWLEDGE.md`, `AUTHORIZATION_MATRIX.md`, and `API_CONTRACT.md`.

User stories define observable behavior; detailed rules remain in their canonical documents.

## Identity & Authentication
- **US-AUTH-001 Register:** visitor registers securely; uniqueness is enforced and the customer role is assigned.
- **US-AUTH-002 Login:** valid credentials authenticate; invalid credentials do not enumerate accounts.
- **US-AUTH-003 Sessions:** refresh-token rotation, revocation, expiration, and replay protection work correctly.
- **US-AUTH-004 Logout:** authenticated user terminates the applicable session and revoked refresh credentials cannot be reused.
- **US-AUTH-005 Current User:** authenticated user retrieves their current profile and authorization context.
- **US-AUTH-006 Remember Me:** login with "remember me" extends refresh token duration; without it, session expires at browser close or short duration.
- **US-AUTH-007 Delete Account:** authenticated user can request permanent account deletion; system soft-deletes or schedules hard-delete with grace period; active orders/bookings must be resolved first.

## Platform Foundation
- **US-PLT-001 Storage Service:** application stores and retrieves files through a storage abstraction; provider can be swapped without changing business modules.
- **US-PLT-002 Image Service:** application processes images (resize, thumbnail, format conversion) through an image service abstraction.
- **US-PLT-003 Email Service:** application sends transactional emails through an email abstraction; provider can be swapped without changing business modules.
- **US-PLT-004 Notification Service:** application dispatches notifications (in-app, push, email) through a notification abstraction.
- **US-PLT-005 Spring Scheduling:** background and deferred jobs use Spring @Scheduled; complex scheduling uses Quartz. Business modules never implement scheduling logic directly.
- **US-PLT-006 Spring Cache:** business services use Spring Cache annotations (@Cacheable, @CachePut, @CacheEvict); current backing is ConcurrentMapCacheManager, production uses RedisCacheManager.
- **US-PLT-007 Payment Provider:** application creates payments and processes webhooks through a payment provider interface; provider can be swapped.
- **US-PLT-008 Shipping Provider:** application quotes shipping rates and creates shipments through a shipping provider interface; provider can be swapped.
- **US-PLT-009 API Error Contract:** all API endpoints return errors using one canonical error response structure with code, message, details, timestamp, and traceId.

## Customer
- **US-CUS-001 View Profile:** customer views their own permitted profile information.
- **US-CUS-002 Update Profile:** customer updates permitted fields of their own profile.
- **US-CUS-003 Create Address:** customer creates an address under their own account.
- **US-CUS-004 View Addresses:** customer lists/views only their own addresses.
- **US-CUS-005 Update Address:** customer updates only their own address.
- **US-CUS-006 Delete Address:** customer removes only their own address according to applicable rules.
- **US-CUS-007 Default Address:** customer selects one of their own addresses as default.

## Pets
- **US-PET-001 Register Pet:** customer registers a pet under their own account.
- **US-PET-002 View Pets:** customer lists/views only their own pets.
- **US-PET-003 Update Pet:** customer updates only their own pet.
- **US-PET-004 Delete Pet:** customer removes/deactivates only their own pet according to applicable rules.
- **US-PET-005 Vaccination History:** customer views basic vaccination history for their own pet.

## Pet Ownership Transfer
- **US-PET-TRANSFER-001 Request Transfer:** pet owner requests transfer to another Oyen user by recipient's unique User ID; ownership remains unchanged until accepted; only one pending transfer per pet at a time.
- **US-PET-TRANSFER-002 Accept Transfer:** recipient accepts pending transfer; ownership changes atomically; pet ID unchanged; all pet-level history (grooming, vaccination, care) remains with the pet; previous owner loses owner-level access.
- **US-PET-TRANSFER-003 Reject Transfer:** recipient rejects transfer; ownership remains unchanged; current owner is notified.
- **US-PET-TRANSFER-004 Cancel Transfer:** current owner cancels pending transfer before acceptance; ownership remains unchanged.
- **US-PET-TRANSFER-005 Preserve Pet History:** after transfer, pet profile, grooming history, vaccination history, care events, and eligible reminders remain associated with the same pet ID; no new pet record is created.
- **US-PET-TRANSFER-006 Transfer Audit:** ownership transfers are auditable; transfer records contain pet, previous owner, new owner, status, and timestamps; admin access follows RBAC.

## Pet Care & Reminders
- **US-PETCARE-001 View Pet Care History:** customer views their pet's care history including grooming, vaccination, vet, and other care events; only owned pets accessible.
- **US-PETCARE-002 Merchant Records Next Care Date:** authorized merchant staff records a recommended next care date after completing a service; creates reminder for pet owner.
- **US-PETCARE-003 Receive Care Reminder:** customer receives push notification before pet's next recommended care date; deduplication enforced; preferences respected.
- **US-PETCARE-004 Rebook From Care Reminder:** customer can book a relevant service directly from a care reminder; can choose original merchant or alternatives.

## Discovery & Recommendations
- **US-DISCOVERY-001 Find Nearby Merchants:** customer discovers nearby merchants by geographic proximity with filters (radius, category, service, open now, rating).
- **US-DISCOVERY-002 View Nearby Merchant on Map:** customer sees nearby merchants on a map with markers; selecting a marker shows merchant summary.
- **US-HOME-001 Personalized Home:** customer's home page shows relevant products, services, and pet-care actions using deterministic rule-based recommendations.
- **US-HOME-002 Pet-Specific Recommendations:** recommendations account for selected pet; purchases for one pet do not contaminate another pet's context.

## Merchant Acquisition
- **US-MERCHANT-QR-001 Merchant Acquisition QR:** each eligible merchant receives a unique QR/deep link for customer acquisition attribution.
- **US-MERCHANT-QR-002 Merchant Acquisition Analytics:** authorized merchant views aggregate acquisition metrics (scans, registrations, activations) within their scope.
- **US-MARKETING-001 Track Acquisition Funnel:** platform tracks core acquisition funnel events for campaign evaluation and optimization.

## Merchant
- **US-MER-001 Apply:** business submits a merchant application and required documents.
- **US-MER-002 View Application:** applicant views their merchant application status/details.
- **US-MER-003 Verify Application:** authorized admin approves/rejects applications with history/audit.
- **US-MER-004 Merchant Profile:** authorized merchant user manages permitted merchant profile information.
- **US-MER-005 Create Branch:** merchant creates a branch under their merchant.
- **US-MER-006 Manage Branch:** merchant views/updates only owned branches.
- **US-MER-007 Branch Hours:** merchant configures operating hours and closures.
- **US-MER-008 Manage Staff:** merchant manages staff within authorized scope.
- **US-MER-009 Staff Assignment:** merchant assigns eligible staff to authorized branches.
- **US-MER-010 Veterinarian Verification:** authorized admin verifies/rejects veterinarian credentials.

## Product Catalog
- **US-PROD-001 Create Product:** merchant creates a product under their catalog.
- **US-PROD-002 View Merchant Products:** merchant views products within authorized scope.
- **US-PROD-003 Update Product:** merchant updates an owned product.
- **US-PROD-004 Product Media:** merchant manages permitted product media.
- **US-PROD-005 Product Options:** merchant configures product options.
- **US-PROD-006 Product Variants:** merchant manages variants, SKU, prices, and attributes.
- **US-PROD-007 Product Discovery:** customer browses/searches available products.
- **US-PROD-008 Product Detail:** customer views public product detail and applicable availability.

## Inventory
- **US-INV-001 View Inventory:** merchant views branch-variant inventory within scope.
- **US-INV-002 Adjust Stock:** merchant adjusts stock and every mutation creates movement history.
- **US-INV-003 Reserve Stock:** checkout atomically reserves inventory without overselling.
- **US-INV-004 Release Reservation:** cancelled/expired reservations release exactly once.
- **US-INV-005 Finalize Reservation:** successful fulfillment finalizes reservations exactly once.
- **US-INV-006 View Movements:** merchant views inventory movement history within scope.

## Services & Scheduling
- **US-SVC-001 Create Service:** merchant creates a service and confirmation mode.
- **US-SVC-002 Manage Service:** merchant views/updates an owned service.
- **US-SVC-003 Service Pricing:** merchant configures documented pet/breed/weight pricing rules.
- **US-SVC-004 Service Branches:** merchant configures branches where a service is available.
- **US-SVC-005 Service Staff:** merchant assigns eligible staff/veterinarians.
- **US-SVC-006 Staff Schedule:** merchant configures schedules and exceptions.
- **US-SVC-007 Service Discovery:** customer browses/searches available services.
- **US-SVC-008 Service Detail:** customer views service details and booking requirements.
- **US-SVC-009 Search Slots:** customer receives backend-computed available slots.
- **US-SVC-010 Hold Slot:** checkout temporarily holds eligible service capacity safely.
- **US-SVC-011 Release Slot:** cancelled/expired holds restore capacity exactly once.

## Cart
- **US-CART-001 View Cart:** customer views their current cart and grouping.
- **US-CART-002 Add Product:** customer adds an eligible product variant.
- **US-CART-003 Update Product Item:** customer changes product quantity.
- **US-CART-004 Remove Product Item:** customer removes a product item.
- **US-CART-005 Add Service:** customer adds an eligible service with required booking context.
- **US-CART-006 Update Service Item:** customer changes permitted service selections.
- **US-CART-007 Remove Service Item:** customer removes a service item.
- **US-CART-008 Mixed Cart:** documented multi-merchant and product/service combinations coexist.

## Voucher
- **US-VOU-001 Apply Voucher:** backend validates voucher scope, period, limits, and discount.
- **US-VOU-002 Remove Voucher:** customer removes an applied voucher before completion.
- **US-VOU-003 Voucher Usage:** successful usage is recorded with concurrency-safe limits.

## Checkout
- **US-CHK-001 Create Checkout:** backend revalidates an eligible cart and creates checkout.
- **US-CHK-002 Checkout Snapshots:** required historical product/service/price/merchant/branch data is preserved.
- **US-CHK-003 Calculate Totals:** backend calculates canonical totals, discounts, shipping, and fees.
- **US-CHK-004 Select Shipping:** customer selects eligible shipping per fulfillment group.
- **US-CHK-005 Reserve Resources:** checkout safely reserves stock and service capacity.
- **US-CHK-006 Confirm Checkout:** eligible checkout becomes ready for payment.
- **US-CHK-007 Checkout Expiration:** expiration releases held resources exactly once.

## Payment
- **US-PAY-001 Payment Attempt:** customer creates a payment attempt for eligible checkout.
- **US-PAY-002 Payment Status:** customer retrieves authoritative backend payment state.
- **US-PAY-003 Payment Webhook:** verified webhook updates/finalizes exactly once.
- **US-PAY-004 Retry Payment:** eligible unpaid checkout can retry without duplicate effects.
- **US-PAY-005 Reconciliation:** provider amount, currency, identity, and checkout are validated.

## Orders
- **US-ORD-001 Split Orders:** paid product items become correct merchant/branch orders.
- **US-ORD-002 Customer Orders:** customer views only their own orders.
- **US-ORD-003 Merchant Orders:** merchant views only orders within authorized scope.
- **US-ORD-004 Process Order:** merchant progresses owned orders through valid transitions.
- **US-ORD-005 Cancel Order:** eligible actor cancels according to policy/state rules.

## Shipping
- **US-SHP-001 Shipping Quotes:** backend retrieves eligible quotes through the aggregator.
- **US-SHP-002 Create Shipment:** eligible fulfillment creates a provider shipment.
- **US-SHP-003 View Shipment:** authorized customer/merchant views shipment information.
- **US-SHP-004 Track Shipment:** authorized user retrieves tracking information.
- **US-SHP-005 Shipping Webhook:** verified provider events update state idempotently.

## Bookings
- **US-BKG-001 Create Booking:** paid service checkout creates booking exactly once.
- **US-BKG-002 Customer Bookings:** customer views only their bookings.
- **US-BKG-003 Merchant Bookings:** merchant/staff views bookings within scope.
- **US-BKG-004 Auto Confirm:** eligible auto-confirm services confirm automatically.
- **US-BKG-005 Merchant Confirm:** merchant-confirm services require authorized acceptance.
- **US-BKG-006 Reject Booking:** authorized merchant rejects an eligible booking.
- **US-BKG-007 Check In:** authorized staff checks in an eligible booking.
- **US-BKG-008 Start Service:** authorized staff starts an eligible booking.
- **US-BKG-009 Complete Service:** authorized staff completes an eligible booking.
- **US-BKG-010 No Show:** authorized actor marks eligible booking no-show.
- **US-BKG-011 Cancel Booking:** eligible actor cancels according to policy.
- **US-BKG-012 Vaccination Completion:** completed vaccination creates history exactly once with eligible verified veterinarian context.

## Pet Hotel (Boarding)
- **US-HTL-001 Search Rooms:** customer searches available room types at a branch for given dates and pet type/size.
- **US-HTL-002 Book Stay:** customer books a multi-night stay with selected room type and add-on services.
- **US-HTL-003 Check In:** authorized staff checks in pet for boarding stay.
- **US-HTL-004 Daily Updates:** staff posts daily activity log, photos, or notes visible to the pet owner.
- **US-HTL-005 Check Out:** authorized staff checks out pet; owner confirms pickup.
- **US-HTL-006 Extend Stay:** eligible booking can be extended if room remains available.
- **US-HTL-007 Early Checkout:** customer requests early checkout with applicable refund policy.
- **US-HTL-008 Room Management:** merchant manages room types, capacity, and pricing per branch.
- **US-HTL-009 Boarding Cancellation:** cancellation follows boarding-specific policy with applicable refund calculation.

## Refunds
- **US-REF-001 Determine Refund:** backend computes cancellation/refund eligibility and amount.
- **US-REF-002 Request Refund:** eligible customer requests refund.
- **US-REF-003 Review Refund:** authorized admin approves/rejects according to policy.
- **US-REF-004 Process Refund:** approved provider refund is idempotent.
- **US-REF-005 Refund Status:** eligible actor views authoritative refund state/history.

## Finance
- **US-FIN-001 Commission:** applicable commission is determined and preserved.
- **US-FIN-002 Ledger:** financial movements post immutably and exactly once.
- **US-FIN-003 Merchant Balance:** merchant views balance from canonical financial records.
- **US-FIN-004 Settlement:** eligible earnings settle without duplication.
- **US-FIN-005 View Settlements:** authorized actor views settlement details/items.
- **US-FIN-006 Bank Account:** merchant securely manages permitted payout account data.
- **US-FIN-007 Request Withdrawal:** merchant requests within available balance/limits.
- **US-FIN-008 Process Withdrawal:** authorized payout processing is idempotent.
- **US-FIN-009 Withdrawal History:** merchant views withdrawals within their scope.
- **US-FIN-010 COD Commission Accrual:** when a COD order reaches its applicable completion state, backend calculates the 4% commission and accrues it as an outstanding merchant commission payable in the ledger, without recording COD collection as an Oyen cash receipt. *(Planned — Phase 13; depends on ledger/settlement foundations.)*
- **US-FIN-011 Outstanding Commission Visibility:** merchant (and authorized admin) views current outstanding commission payable derived from canonical financial records. *(Planned — Phase 13.)*
- **US-FIN-012 Automatic Debt Recovery:** an eligible Oyen-controlled payment-gateway settlement automatically recovers outstanding COD commission debt from the amount available after current deductions, recorded as a financial event separate from current-transaction commission. *(Planned — Phase 13.)*
- **US-FIN-013 Partial Debt Recovery:** when the amount available for settlement is less than the outstanding COD commission debt, backend recovers only the available amount and reduces the outstanding debt accordingly. *(Planned — Phase 13.)*
- **US-FIN-014 Debt Carry-Forward:** any COD commission debt not recovered in a settlement remains outstanding and carries forward to a future eligible settlement. *(Planned — Phase 13.)*
- **US-FIN-015 No Negative Settlement:** debt recovery never exceeds the amount available for settlement and never produces a negative merchant payout. *(Planned — Phase 13.)*
- **US-FIN-016 Auditable Recovery:** current-transaction commission and historical COD debt recovery are separately traceable in the immutable ledger, and recovery is idempotent so duplicate payment/settlement processing never duplicates commission or recovery. *(Planned — Phase 13.)*
- **US-FIN-017 Settlement Deduction Visibility:** authorized merchant/admin can see settlement deductions including current commission and any COD debt recovered, plus remaining outstanding balance. *(Planned — Phase 13.)*

## Business Configuration (Admin)
- **US-CFG-001 View Business Settings:** an internal admin views managed platform business settings from backend-authoritative configuration.
- **US-CFG-002 Update Business Setting:** an internal admin updates a whitelisted business setting; the value is validated server-side, audited, and cache-invalidated so subsequent operations use the new value.
- **US-CFG-003 List Commission Rules:** an internal admin views commission rules with scope, value, priority, effective dates, and status.
- **US-CFG-004 Create Commission Rule:** an internal admin creates a commission rule (transaction type, scope, percentage/fixed value, priority, effective dates); invalid or ambiguously overlapping rules are rejected.
- **US-CFG-005 Activate/Deactivate Commission Rule:** an internal admin toggles a commission rule's active state.
- **US-CFG-006 Manage Payment Method Availability:** an internal admin enables/disables payment methods; availability is served by the backend and never hardcoded in the frontend.
- **US-CFG-007 Configuration Authorization:** only ADMIN/SUPER_ADMIN may modify platform business configuration; merchant and customer roles are rejected server-side.
- **US-CFG-008 Configuration Audit:** every business-configuration change is recorded in the audit log with actor, action, entity, previous/new value, and timestamp.

## Reviews
- **US-REV-001 Product Review:** eligible customer reviews a product from a qualifying transaction.
- **US-REV-002 Service Review:** eligible customer reviews a service from a qualifying booking.
- **US-REV-003 View Reviews:** users view applicable public reviews.
- **US-REV-004 Review Moderation:** authorized admin moderates reviews.

## Favorites
- **US-FAV-001 Favorite Product:** customer adds/removes product favorites.
- **US-FAV-002 Favorite Service:** customer adds/removes service favorites.
- **US-FAV-003 Favorite Merchant:** customer adds/removes merchant favorites.
- **US-FAV-004 View Favorites:** customer views only their favorites.

## Chat
- **US-CHAT-001 Start Conversation:** eligible participant starts/obtains an authorized conversation.
- **US-CHAT-002 View Conversations:** participant views only authorized conversations.
- **US-CHAT-003 Send Message:** authorized participant sends a message.
- **US-CHAT-004 Attach File:** authorized participant sends permitted private attachments.
- **US-CHAT-005 Read Status:** participant manages message read state according to rules.

## Notifications
- **US-NOT-001 Receive Notification:** relevant events create notifications for eligible recipients.
- **US-NOT-002 View Notifications:** user views only their notifications.
- **US-NOT-003 Mark Read:** user marks their notifications as read.
- **US-NOT-004 Preferences:** user manages supported notification preferences.

## Promotions & Campaigns
- **US-CAM-001 Create Promotion:** authorized merchant/admin creates an eligible promotion.
- **US-CAM-002 Manage Promotion:** authorized owner schedules/updates/deactivates promotion.
- **US-CAM-003 Campaign Management:** authorized admin manages marketplace campaigns.
- **US-CAM-004 Banner Management:** authorized admin manages scheduled banners.
- **US-CAM-005 Promotion Discovery:** customer sees only active/eligible marketing content.

## Disputes
- **US-DIS-001 Open Dispute:** eligible participant opens a dispute.
- **US-DIS-002 Submit Evidence:** authorized participant submits permitted evidence securely.
- **US-DIS-003 View Dispute:** authorized participant/admin views dispute information.
- **US-DIS-004 Resolve Dispute:** authorized admin resolves with decision/audit information.

## Administration
- **US-ADM-001 User Administration:** authorized admin performs permitted user operations with audit.
- **US-ADM-002 Merchant Administration:** authorized admin manages merchant verification/moderation.
- **US-ADM-003 Catalog Administration:** authorized admin manages reference catalog/moderation.
- **US-ADM-004 Transaction Administration:** authorized admin operates transactions only through explicit permissions and valid operations.
- **US-ADM-005 Marketplace Configuration:** authorized admin manages supported system configuration.
- **US-ADM-006 Audit Logs:** authorized admin views audit history according to permissions.

## Legal & Store Compliance
- **US-LEGAL-001 Terms of Service:** terms of service page is publicly accessible, versioned, and linked from registration and app footer/settings.
- **US-LEGAL-002 Privacy Policy:** privacy policy page is publicly accessible, versioned, and discloses data collection, usage, sharing, retention, and deletion practices.
- **US-LEGAL-003 Consent & Agreement:** user must explicitly accept ToS and Privacy Policy during registration; consent is recorded with timestamp and policy version.
- **US-LEGAL-004 Cookie/Tracking Disclosure:** applicable cookie or tracking disclosure is presented to users where required by law.
- **US-LEGAL-005 Data Export:** authenticated user can request a downloadable export of their personal data (profile, pets, orders, bookings, addresses, messages).
- **US-LEGAL-006 Content Guidelines:** community/content guidelines page exists and is accessible from app settings and store listing.
- **US-LEGAL-007 App Store Metadata:** app store listing metadata (title, description, screenshots, category, age rating, developer contact, privacy policy URL) is prepared for Google Play and Apple App Store submission.

## Story Execution Rule

A user-story ID identifies product behavior, not an individual class or file.

When asked to implement a story, the agent resolves detailed requirements from
canonical documentation, inspects what already exists, and implements the
smallest complete vertical slice required by that story.

The agent must not invent missing business rules or duplicate canonical
requirements into temporary planning documents.
