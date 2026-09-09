# Oyen --- MVP Database Knowledge Document

**Version:** 1.0\
**Database:** PostgreSQL\
**Backend:** Spring Boot 3 / Java 21\
**Frontend:** Next.js / TypeScript\
**Purpose:** Canonical database knowledge for developers and
AI/knowledge agents.

## Locked Business Decisions

1.  Merchant can have multiple branches.
2.  Cart can contain products from multiple merchants.
3.  Products and services can be checked out together.
4.  Booking confirmation is configurable per service: `AUTO_CONFIRM` /
    `MERCHANT_CONFIRM`.
5.  Platform receives customer payment and settles funds to merchants.
6.  Shipping uses a shipping aggregator.
7.  Veterinary/vaccination services require a verified veterinarian.
8.  MVP includes basic vaccination history.

## Global Conventions

-   PK: `UUID DEFAULT gen_random_uuid()`
-   Time: `TIMESTAMPTZ`; calendar values use `DATE`/`TIME`
-   Money: `NUMERIC(19,2)`
-   Status: `VARCHAR` + CHECK/application validation
-   Transaction records preserve snapshots of mutable
    names/prices/addresses.
-   Common mutable business entities use `created_at`, `created_by`,
    `updated_at`, `updated_by`, `deleted_at`, `deleted_by` where
    appropriate.
-   Immutable logs/ledgers are not soft-deleted.

# Table Catalog

## Identity & Authentication

### users

  Column                  Type           Key / Rule
  ----------------------- -------------- -----------------------------------
  id                      UUID           PK
  full_name               VARCHAR(150)   NOT NULL
  email                   VARCHAR(255)   UNIQUE, nullable
  phone_number            VARCHAR(30)    UNIQUE, nullable
  password_hash           TEXT           nullable for OAuth-only
  profile_image_file_id   UUID           FK → files.id, nullable
  status                  VARCHAR(30)    ACTIVE/INACTIVE/SUSPENDED/BLOCKED
  email_verified_at       TIMESTAMPTZ    nullable
  phone_verified_at       TIMESTAMPTZ    nullable
  last_login_at           TIMESTAMPTZ    nullable
  created_at              TIMESTAMPTZ    NOT NULL
  updated_at              TIMESTAMPTZ    nullable
  deleted_at              TIMESTAMPTZ    nullable

### user_oauth_accounts

  Column             Type           Key / Rule
  ------------------ -------------- ---------------
  id                 UUID           PK
  user_id            UUID           FK → users.id
  provider           VARCHAR(30)    GOOGLE/APPLE
  provider_user_id   VARCHAR(255)   NOT NULL
  provider_email     VARCHAR(255)   nullable
  created_at         TIMESTAMPTZ    NOT NULL

Unique: `(provider, provider_user_id)`.

### refresh_tokens

  Column       Type          Key / Rule
  ------------ ------------- --------------------------------
  id           UUID          PK
  user_id      UUID          FK → users.id
  token_hash   TEXT          UNIQUE
  device_id    UUID          FK → user_devices.id, nullable
  expires_at   TIMESTAMPTZ   NOT NULL
  revoked_at   TIMESTAMPTZ   nullable
  created_at   TIMESTAMPTZ   NOT NULL

### verification_tokens

  Column       Type          Key / Rule
  ------------ ------------- -----------------------------
  id           UUID          PK
  user_id      UUID          FK → users.id
  type         VARCHAR(30)   EMAIL_VERIFY/PASSWORD_RESET
  token_hash   TEXT          UNIQUE
  expires_at   TIMESTAMPTZ   NOT NULL
  used_at      TIMESTAMPTZ   nullable
  created_at   TIMESTAMPTZ   NOT NULL

### otp_requests

  Column          Type           Key / Rule
  --------------- -------------- --------------------------------------------
  id              UUID           PK
  user_id         UUID           FK → users.id, nullable
  destination     VARCHAR(255)   NOT NULL
  channel         VARCHAR(20)    SMS/EMAIL/WHATSAPP
  purpose         VARCHAR(30)    REGISTER/LOGIN/VERIFY_PHONE/RESET_PASSWORD
  otp_hash        TEXT           NOT NULL
  expires_at      TIMESTAMPTZ    NOT NULL
  verified_at     TIMESTAMPTZ    nullable
  attempt_count   INTEGER        default 0
  created_at      TIMESTAMPTZ    NOT NULL

### login_histories

`id UUID PK`, `user_id UUID FK users nullable`,
`login_identifier VARCHAR(255)`, `success BOOLEAN`,
`failure_reason VARCHAR(255)`, `ip_address INET`, `user_agent TEXT`,
`logged_in_at TIMESTAMPTZ`.

### user_devices

`id UUID PK`, `user_id UUID FK users`, `device_identifier VARCHAR(255)`,
`platform VARCHAR(30)`, `device_name VARCHAR(150)`, `push_token TEXT`,
`last_active_at TIMESTAMPTZ`, `created_at TIMESTAMPTZ`.

## RBAC

### roles

`id UUID PK`, `code VARCHAR(50) UNIQUE`, `name VARCHAR(100)`,
`description VARCHAR(255)`, `scope VARCHAR(30)` PLATFORM/MERCHANT,
`is_system BOOLEAN`, `created_at TIMESTAMPTZ`.

Initial roles: SUPER_ADMIN, ADMIN, CUSTOMER, PETSHOP_OWNER,
PETSHOP_ADMIN, PETSHOP_STAFF, GROOMER, VETERINARIAN.

### permissions

`id UUID PK`, `code VARCHAR(100) UNIQUE`, `name VARCHAR(150)`,
`module VARCHAR(100)`, `description VARCHAR(255)`.

### role_permissions

`role_id UUID PK/FK roles`, `permission_id UUID PK/FK permissions`.

### user_roles

`user_id UUID PK/FK users`, `role_id UUID PK/FK roles`,
`created_at TIMESTAMPTZ`.

## Customer

### customer_profiles

`user_id UUID PK/FK users`, `gender VARCHAR(20)`, `birth_date DATE`,
`created_at TIMESTAMPTZ`, `updated_at TIMESTAMPTZ`.

### addresses

`id UUID PK`, `user_id UUID FK users`, `label VARCHAR(50)`,
`recipient_name VARCHAR(150)`, `recipient_phone VARCHAR(30)`,
`province_code VARCHAR(50)`, `province_name VARCHAR(100)`,
`city_code VARCHAR(50)`, `city_name VARCHAR(100)`,
`district_code VARCHAR(50)`, `district_name VARCHAR(100)`,
`subdistrict_code VARCHAR(50)`, `subdistrict_name VARCHAR(100)`,
`postal_code VARCHAR(10)`, `address_line TEXT`,
`latitude NUMERIC(10,7)`, `longitude NUMERIC(10,7)`,
`notes VARCHAR(500)`, `is_default BOOLEAN`, audit timestamps.

## Pet & Vaccination

### pet_types

`id UUID PK`, `code VARCHAR(50) UNIQUE`, `name VARCHAR(100)`,
`is_active BOOLEAN`, `sort_order INTEGER`.

### pet_breeds

`id UUID PK`, `pet_type_id UUID FK pet_types`, `name VARCHAR(150)`,
`is_active BOOLEAN`, `created_at TIMESTAMPTZ`. Unique
`(pet_type_id,name)`.

### pets

`id UUID PK`, `owner_user_id UUID FK users`,
`pet_type_id UUID FK pet_types`, `breed_id UUID FK pet_breeds nullable`,
`name VARCHAR(100)`, `gender VARCHAR(20)`, `birth_date DATE`,
`birth_date_estimated BOOLEAN`, `weight_kg NUMERIC(7,2)`,
`color VARCHAR(100)`, `sterilized BOOLEAN`,
`microchip_number VARCHAR(100) UNIQUE nullable`,
`profile_image_file_id UUID FK files`, `allergies TEXT`,
`special_notes TEXT`, audit timestamps.

### vaccine_types

`id UUID PK`, `pet_type_id UUID FK pet_types nullable`,
`code VARCHAR(100) UNIQUE`, `name VARCHAR(150)`, `description TEXT`,
`is_active BOOLEAN`.

### pet_vaccinations

`id UUID PK`, `pet_id UUID FK pets`,
`vaccine_type_id UUID FK vaccine_types nullable`,
`booking_id UUID FK bookings nullable`,
`merchant_id UUID FK merchants nullable`,
`branch_id UUID FK merchant_branches nullable`,
`veterinarian_staff_id UUID FK merchant_staff nullable`,
`vaccine_name_snapshot VARCHAR(150)`, `vaccination_date DATE`,
`next_vaccination_date DATE`, `batch_number VARCHAR(100)`,
`certificate_file_id UUID FK files`, `notes TEXT`,
`created_at TIMESTAMPTZ`, `created_by UUID FK users`.

## Merchant & Branch

### merchants

`id UUID PK`, `owner_user_id UUID FK users`,
`business_name VARCHAR(200)`, `display_name VARCHAR(200)`,
`description TEXT`, `email VARCHAR(255)`, `phone_number VARCHAR(30)`,
`whatsapp_number VARCHAR(30)`, `nib VARCHAR(100)`, `npwp VARCHAR(100)`,
`logo_file_id UUID FK files`, `banner_file_id UUID FK files`,
`verification_status VARCHAR(30)`, `verified_at TIMESTAMPTZ`,
`verified_by UUID FK users`, `rating_average NUMERIC(3,2)`,
`rating_count INTEGER`, audit timestamps.

Verification: DRAFT/SUBMITTED/UNDER_REVIEW/APPROVED/REJECTED/SUSPENDED.

### merchant_documents

`id UUID PK`, `merchant_id UUID FK merchants`,
`document_type VARCHAR(50)`, `document_number VARCHAR(150)`,
`file_id UUID FK files`, `status VARCHAR(30)`, `rejection_reason TEXT`,
`expires_at DATE`, `created_at TIMESTAMPTZ`.

### merchant_verification_histories

`id UUID PK`, `merchant_id UUID FK merchants`,
`from_status VARCHAR(30)`, `to_status VARCHAR(30)`, `notes TEXT`,
`acted_by UUID FK users`, `created_at TIMESTAMPTZ`.

### merchant_branches

`id UUID PK`, `merchant_id UUID FK merchants`, `code VARCHAR(50)`,
`name VARCHAR(200)`, `phone_number VARCHAR(30)`, `email VARCHAR(255)`,
province/city/district/subdistrict/postal/address fields,
`latitude NUMERIC(10,7)`, `longitude NUMERIC(10,7)`,
`is_active BOOLEAN`, audit timestamps. Unique `(merchant_id,code)`.

### merchant_business_hours

`id UUID PK`, `branch_id UUID FK merchant_branches`,
`day_of_week SMALLINT CHECK 1..7`, `open_time TIME`, `close_time TIME`,
`is_closed BOOLEAN`. Unique `(branch_id,day_of_week)`.

### merchant_branch_closures

`id UUID PK`, `branch_id UUID FK merchant_branches`,
`closure_date DATE`, `is_closed BOOLEAN`, `open_time TIME`,
`close_time TIME`, `reason VARCHAR(255)`. Unique
`(branch_id,closure_date)`.

## Merchant Staff & Veterinarian

### merchant_staff

`id UUID PK`, `merchant_id UUID FK merchants`, `user_id UUID FK users`,
`role_id UUID FK roles`, `employee_code VARCHAR(100)`,
`display_name VARCHAR(150)`, `status VARCHAR(30)`, `joined_at DATE`,
audit timestamps. Unique `(merchant_id,user_id)`.

### merchant_staff_branches

Composite PK: `staff_id UUID FK merchant_staff`,
`branch_id UUID FK merchant_branches`.

### veterinarian_profiles

`staff_id UUID PK/FK merchant_staff`, `license_number VARCHAR(150)`,
`license_file_id UUID FK files`, `license_expiry_date DATE`,
`verification_status VARCHAR(30)` PENDING/VERIFIED/REJECTED/EXPIRED,
`verified_at TIMESTAMPTZ`, `verified_by UUID FK users`, `notes TEXT`.

## Product Catalog

### product_categories

`id UUID PK`, `parent_id UUID FK product_categories nullable`,
`name VARCHAR(150)`, `slug VARCHAR(180) UNIQUE`, `description TEXT`,
`image_file_id UUID FK files`, `is_active BOOLEAN`,
`sort_order INTEGER`.

### brands

`id UUID PK`, `name VARCHAR(150) UNIQUE`, `slug VARCHAR(180) UNIQUE`,
`logo_file_id UUID FK files`, `is_active BOOLEAN`.

### products

`id UUID PK`, `merchant_id UUID FK merchants`,
`category_id UUID FK product_categories`,
`brand_id UUID FK brands nullable`, `name VARCHAR(255)`,
`slug VARCHAR(300)`, `description TEXT`, `status VARCHAR(30)`,
`condition VARCHAR(20)`, `min_purchase_qty INTEGER`,
`rating_average NUMERIC(3,2)`, `rating_count INTEGER`,
`sold_count BIGINT`, audit timestamps. Unique `(merchant_id,slug)`.

### product_pet_types

Composite PK/FK: `product_id → products`, `pet_type_id → pet_types`.

### product_options

`id UUID PK`, `product_id UUID FK products`, `name VARCHAR(100)`,
`sort_order INTEGER`.

### product_option_values

`id UUID PK`, `option_id UUID FK product_options`, `value VARCHAR(150)`,
`sort_order INTEGER`.

### product_variants

`id UUID PK`, `product_id UUID FK products`, `sku VARCHAR(100)`,
`barcode VARCHAR(100)`, `price NUMERIC(19,2)`,
`compare_at_price NUMERIC(19,2)`, `weight_gram INTEGER`,
`length_cm NUMERIC(8,2)`, `width_cm NUMERIC(8,2)`,
`height_cm NUMERIC(8,2)`, `is_active BOOLEAN`, timestamps.

### product_variant_option_values

Composite PK/FK: `variant_id → product_variants`,
`option_value_id → product_option_values`.

### product_images

`id UUID PK`, `product_id UUID FK products`,
`variant_id UUID FK product_variants nullable`, `file_id UUID FK files`,
`is_primary BOOLEAN`, `sort_order INTEGER`.

## Inventory

### inventories

`id UUID PK`, `branch_id UUID FK merchant_branches`,
`variant_id UUID FK product_variants`, `quantity_on_hand INTEGER`,
`quantity_reserved INTEGER`, `reorder_level INTEGER`,
`updated_at TIMESTAMPTZ`. Unique `(branch_id,variant_id)`. Available =
on_hand - reserved.

### stock_movements

`id UUID PK`, `inventory_id UUID FK inventories`,
`movement_type VARCHAR(30)`, `quantity INTEGER`,
`reference_type VARCHAR(30)`, `reference_id UUID`,
`quantity_before INTEGER`, `quantity_after INTEGER`,
`notes VARCHAR(500)`, `created_by UUID FK users`,
`created_at TIMESTAMPTZ`. Immutable.

## Services & Scheduling

### service_categories

`id UUID PK`, `parent_id UUID FK service_categories nullable`,
`name VARCHAR(150)`, `slug VARCHAR(180) UNIQUE`,
`is_veterinary BOOLEAN`, `is_active BOOLEAN`.

### services

`id UUID PK`, `merchant_id UUID FK merchants`,
`category_id UUID FK service_categories`, `name VARCHAR(255)`,
`description TEXT`, `duration_minutes INTEGER`,
`confirmation_mode VARCHAR(30)` AUTO_CONFIRM/MERCHANT_CONFIRM,
`requires_pet BOOLEAN`, `requires_verified_veterinarian BOOLEAN`,
`status VARCHAR(30)`, rating fields, audit timestamps.

### service_branches

Composite PK/FK: `service_id → services`,
`branch_id → merchant_branches`; plus `is_active BOOLEAN`.

### service_pet_types

Composite PK/FK: `service_id → services`, `pet_type_id → pet_types`.

### service_prices

`id UUID PK`, `service_id UUID FK services`,
`pet_type_id UUID FK pet_types nullable`,
`breed_id UUID FK pet_breeds nullable`, `min_weight_kg NUMERIC(7,2)`,
`max_weight_kg NUMERIC(7,2)`, `label VARCHAR(150)`,
`price NUMERIC(19,2)`, `is_active BOOLEAN`.

### service_staff

Composite PK: `service_id UUID FK services`,
`staff_id UUID FK merchant_staff`,
`branch_id UUID FK merchant_branches`.

### staff_schedules

`id UUID PK`, `staff_id UUID FK merchant_staff`,
`branch_id UUID FK merchant_branches`, `day_of_week SMALLINT`,
`start_time TIME`, `end_time TIME`, `capacity INTEGER default 1`,
`is_active BOOLEAN`.

### staff_schedule_exceptions

`id UUID PK`, `staff_id UUID FK merchant_staff`,
`branch_id UUID FK merchant_branches`, `exception_date DATE`,
`is_available BOOLEAN`, `start_time TIME`, `end_time TIME`,
`reason VARCHAR(255)`.

### service_slot_holds

`id UUID PK`, `service_id UUID FK services`,
`branch_id UUID FK merchant_branches`,
`staff_id UUID FK merchant_staff nullable`, `user_id UUID FK users`,
`pet_id UUID FK pets`, `start_at TIMESTAMPTZ`, `end_at TIMESTAMPTZ`,
`expires_at TIMESTAMPTZ`, `status VARCHAR(20)`
ACTIVE/CONSUMED/EXPIRED/RELEASED, `created_at TIMESTAMPTZ`.

## Cart

### carts

`id UUID PK`, `user_id UUID FK users`, `status VARCHAR(20)`
ACTIVE/CHECKED_OUT/ABANDONED, timestamps. Enforce one ACTIVE cart/user.

### cart_product_items

`id UUID PK`, `cart_id UUID FK carts`,
`branch_id UUID FK merchant_branches`,
`product_variant_id UUID FK product_variants`,
`quantity INTEGER CHECK >0`, timestamps. Unique
`(cart_id,branch_id,product_variant_id)`.

### cart_service_items

`id UUID PK`, `cart_id UUID FK carts`, `service_id UUID FK services`,
`service_price_id UUID FK service_prices`,
`branch_id UUID FK merchant_branches`, `pet_id UUID FK pets`,
`staff_id UUID FK merchant_staff nullable`,
`slot_hold_id UUID FK service_slot_holds`,
`scheduled_start_at TIMESTAMPTZ`, `scheduled_end_at TIMESTAMPTZ`,
`created_at TIMESTAMPTZ`.

## Checkout

### checkouts

`id UUID PK`, `checkout_number VARCHAR(50) UNIQUE`,
`user_id UUID FK users`, `cart_id UUID FK carts nullable`,
`status VARCHAR(30)`, `product_subtotal NUMERIC(19,2)`,
`service_subtotal NUMERIC(19,2)`, `shipping_total NUMERIC(19,2)`,
`platform_fee NUMERIC(19,2)`, `discount_total NUMERIC(19,2)`,
`grand_total NUMERIC(19,2)`, `expires_at TIMESTAMPTZ`, timestamps.

### checkout_vouchers

Composite PK: `checkout_id UUID FK checkouts`,
`voucher_id UUID FK vouchers`; `discount_amount NUMERIC(19,2)`.

## Orders & Shipping

### orders

`id UUID PK`, `order_number VARCHAR(50) UNIQUE`,
`checkout_id UUID FK checkouts`, `user_id UUID FK users`,
`merchant_id UUID FK merchants`, `branch_id UUID FK merchant_branches`,
`status VARCHAR(30)`, subtotal/shipping/discount/platform_fee/total
NUMERIC(19,2), complete recipient/address snapshot columns,
`created_at`, `paid_at`, `completed_at`, `cancelled_at`.

### order_items

`id UUID PK`, `order_id UUID FK orders`, `product_id UUID FK products`,
`product_variant_id UUID FK product_variants`,
`product_name VARCHAR(255)` snapshot, `variant_name VARCHAR(255)`
snapshot, `sku VARCHAR(100)` snapshot, `unit_price NUMERIC(19,2)`,
`quantity INTEGER`, `subtotal NUMERIC(19,2)`,
`discount_amount NUMERIC(19,2)`, `final_amount NUMERIC(19,2)`.

### order_status_histories

`id UUID PK`, `order_id UUID FK orders`, `from_status VARCHAR(30)`,
`to_status VARCHAR(30)`, `notes TEXT`, `changed_by UUID FK users`,
`created_at TIMESTAMPTZ`.

### shipping_providers

`id UUID PK`, `code VARCHAR(50) UNIQUE`, `name VARCHAR(150)`,
`provider_type VARCHAR(30)` AGGREGATOR/DIRECT, `is_active BOOLEAN`,
`created_at TIMESTAMPTZ`.

### shipments

`id UUID PK`, `order_id UUID FK orders UNIQUE (MVP)`,
`shipping_provider_id UUID FK shipping_providers`, courier/service
codes/names, `external_shipment_id VARCHAR(255)`,
`tracking_number VARCHAR(150)`, `shipping_cost NUMERIC(19,2)`,
`status VARCHAR(30)`, estimated/shipped/delivered timestamps, audit
timestamps.

### shipment_status_histories

`id UUID PK`, `shipment_id UUID FK shipments`, `status VARCHAR(50)`,
`description TEXT`, `location VARCHAR(255)`, `event_at TIMESTAMPTZ`,
`raw_payload JSONB`.

## Bookings

### bookings

`id UUID PK`, `booking_number VARCHAR(50) UNIQUE`,
`checkout_id UUID FK checkouts`, `user_id UUID FK users`,
`merchant_id UUID FK merchants`, `branch_id UUID FK merchant_branches`,
`service_id UUID FK services`,
`service_price_id UUID FK service_prices nullable`,
`pet_id UUID FK pets`, `staff_id UUID FK merchant_staff nullable`,
service/price snapshot fields, financial totals,
`confirmation_mode VARCHAR(30)` snapshot, `status VARCHAR(30)`,
scheduled timestamps, notes, confirmed/completed/cancelled/created
timestamps.

Statuses: PENDING_PAYMENT, PAID, PENDING_CONFIRMATION, CONFIRMED,
CHECKED_IN, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW, REFUNDED.

### booking_status_histories

`id UUID PK`, `booking_id UUID FK bookings`, `from_status`, `to_status`,
`notes`, `changed_by UUID FK users`, `created_at`.

### booking_cancellations

`id UUID PK`, `booking_id UUID FK bookings UNIQUE`,
`cancelled_by UUID FK users`, `reason_code VARCHAR(50)`, `reason TEXT`,
`refundable_amount NUMERIC(19,2)`, `cancellation_fee NUMERIC(19,2)`,
`created_at TIMESTAMPTZ`.

## Payment & Refund

### payment_methods

`id UUID PK`, `provider_code VARCHAR(50)`, `method_code VARCHAR(50)`,
`name VARCHAR(150)`, `type VARCHAR(30)`, `is_active BOOLEAN`,
`sort_order INTEGER`. Unique `(provider_code,method_code)`.

### payments

`id UUID PK`, `payment_number VARCHAR(50) UNIQUE`,
`checkout_id UUID FK checkouts`, `user_id UUID FK users`,
`payment_method_id UUID FK payment_methods`, `provider VARCHAR(50)`,
`external_transaction_id VARCHAR(255)`, `amount NUMERIC(19,2)`,
`status VARCHAR(30)`, `payment_url TEXT`, `expires_at`, `paid_at`,
timestamps.

### payment_status_histories

`id UUID PK`, `payment_id UUID FK payments`, `from_status`, `to_status`,
`external_status VARCHAR(100)`, `created_at`.

### refunds

`id UUID PK`, `refund_number VARCHAR(50) UNIQUE`,
`payment_id UUID FK payments`, `order_id UUID FK orders nullable`,
`booking_id UUID FK bookings nullable`, `amount NUMERIC(19,2)`,
`reason TEXT`, `status VARCHAR(30)`, `requested_by UUID FK users`,
`approved_by UUID FK users nullable`, `provider_refund_id VARCHAR(255)`,
`created_at`, `processed_at`. Normally exactly one of
order_id/booking_id.

## Finance & Settlement

### commission_rules

`id UUID PK`, `merchant_id UUID FK merchants nullable`,
`transaction_type VARCHAR(20)` PRODUCT/SERVICE,
`category_id UUID nullable`, `commission_type VARCHAR(20)`,
`commission_value NUMERIC(19,4)`, `priority INTEGER`, `valid_from`,
`valid_until`, `is_active`.

### merchant_wallets

`merchant_id UUID PK/FK merchants`, `pending_balance NUMERIC(19,2)`,
`available_balance NUMERIC(19,2)`, `updated_at`.

### merchant_ledger_entries

`id UUID PK`, `merchant_id UUID FK merchants`,
`order_id UUID FK orders nullable`,
`booking_id UUID FK bookings nullable`,
`refund_id UUID FK refunds nullable`, `entry_type VARCHAR(30)`,
`balance_type VARCHAR(20)`, `amount NUMERIC(19,2)` signed,
`description VARCHAR(500)`, `created_at`. Immutable.

### merchant_bank_accounts

`id UUID PK`, `merchant_id UUID FK merchants`, `bank_code VARCHAR(50)`,
`bank_name VARCHAR(150)`, `account_number_encrypted TEXT`,
`account_number_last4 VARCHAR(4)`, `account_holder_name VARCHAR(200)`,
`is_primary BOOLEAN`, `verification_status VARCHAR(30)`, timestamps.

### withdrawals

`id UUID PK`, `withdrawal_number VARCHAR(50) UNIQUE`,
`merchant_id UUID FK merchants`,
`bank_account_id UUID FK merchant_bank_accounts`,
`amount NUMERIC(19,2)`, `admin_fee NUMERIC(19,2)`, `status VARCHAR(30)`,
`requested_at`, `processed_at`, `processed_by UUID FK users`,
`external_reference VARCHAR(255)`, `rejection_reason TEXT`.

### settlements

`id UUID PK`, `settlement_number VARCHAR(50) UNIQUE`,
`merchant_id UUID FK merchants`, `gross_amount`, `commission_amount`,
`refund_amount`, `net_amount` NUMERIC(19,2), `status VARCHAR(30)`,
`available_at`, `created_at`.

### settlement_items

`id UUID PK`, `settlement_id UUID FK settlements`,
`order_id UUID FK orders nullable`,
`booking_id UUID FK bookings nullable`, `gross_amount`,
`commission_amount`, `net_amount` NUMERIC(19,2).

### COD Commission Debt Recovery — Conceptual Data Requirements

*(Planned — see Phase 13 in the roadmap. The behavior is documented; the schema
below is not yet implemented. Do not assume these fields already exist.)*

The COD commission accrual and recovery model is expressed through the existing
finance tables wherever possible, without introducing a separate parallel
wallet/debt subsystem:

- **payment_methods / payments:** COD is represented as a merchant-collected
  payment method distinct from provider-collected gateway methods. A COD payment
  record represents merchant-collected funds and is never treated as an
  Oyen-received amount. (Distinguishing COD may require a method/collection
  classification — see future consideration below.)
- **commission_rules:** the same 4% rule (subtotal only) applies to COD orders;
  no new rule entity is required for the baseline rate.
- **merchant_ledger_entries:** the authoritative record. COD commission accrual
  and later debt recovery are posted as distinct immutable entries so current
  commission and historical recovery remain separately auditable. This likely
  requires additional `entry_type` values (e.g. a COD commission-payable accrual
  type and a COD debt-recovery type) rather than new tables.
- **merchant_wallets / balances:** outstanding commission payable is a merchant
  obligation derived from ledger entries; it must reconcile with ledger logic and
  must not be an independent mutable counter that bypasses the ledger.
- **settlements / settlement_items:** an eligible settlement records the current
  commission and any recovered COD debt as separate amounts, ensuring the final
  net amount is never negative and that unrecovered debt carries forward.
- **orders / bookings:** provide the transaction context (COD vs gateway,
  subtotal snapshot) used to compute the accrued commission and to trace recovery
  back to the originating COD transaction.

Future implementation considerations (likely new fields/values, to be defined by
a Phase 13 migration — documented here as future work, not as existing schema):

- A COD/collection classification on `payment_methods` and/or `payments`
  (e.g. a `collection_type` such as PROVIDER_COLLECTED / MERCHANT_COLLECTED).
- Additional `merchant_ledger_entries.entry_type` values for COD commission
  payable accrual and COD debt recovery.
- A means to express current outstanding commission payable and per-settlement
  recovered amount (derivable from ledger entries, or a dedicated
  `settlement_items` amount/`entry_type`), preserving separate auditability of
  current commission versus historical debt recovery.

No new tables are assumed necessary at this time; the requirement is expressed
through existing commission, ledger, balance, settlement, payment, and order
concepts. Any concrete columns/enums are introduced only by a future Flyway
migration.

## Reviews & Wishlist

### reviews

`id UUID PK`, `user_id UUID FK users`,
`order_item_id UUID FK order_items nullable`,
`booking_id UUID FK bookings nullable`, `merchant_id UUID FK merchants`,
`product_id UUID FK products nullable`,
`service_id UUID FK services nullable`, `review_type VARCHAR(20)`,
`rating SMALLINT CHECK 1..5`, `title VARCHAR(200)`, `content TEXT`,
`status VARCHAR(20)`, timestamps.

### review_media

`id UUID PK`, `review_id UUID FK reviews`, `file_id UUID FK files`,
`media_type VARCHAR(20)`, `sort_order INTEGER`.

### review_replies

`id UUID PK`, `review_id UUID FK reviews`,
`merchant_id UUID FK merchants`, `replied_by UUID FK users`,
`content TEXT`, timestamps.

### product_wishlists

Composite PK: `user_id UUID FK users`, `product_id UUID FK products`;
`created_at`.

### service_wishlists

Composite PK: `user_id UUID FK users`, `service_id UUID FK services`;
`created_at`.

### favorite_merchants

Composite PK: `user_id UUID FK users`, `merchant_id UUID FK merchants`;
`created_at`.

## Chat

### conversations

`id UUID PK`, `merchant_id UUID FK merchants nullable`,
`conversation_type VARCHAR(20)`, `order_id UUID FK orders nullable`,
`booking_id UUID FK bookings nullable`, `last_message_at`, `created_at`.

### conversation_members

Composite PK: `conversation_id UUID FK conversations`,
`user_id UUID FK users`; `joined_at`, `last_read_at`.

### messages

`id UUID PK`, `conversation_id UUID FK conversations`,
`sender_user_id UUID FK users`, `message_type VARCHAR(20)`,
`content TEXT`, `product_id UUID FK products nullable`,
`order_id UUID FK orders nullable`,
`booking_id UUID FK bookings nullable`, `created_at`, `edited_at`,
`deleted_at`.

### message_attachments

`id UUID PK`, `message_id UUID FK messages`, `file_id UUID FK files`.

## Notification

### notifications

`id UUID PK`, `user_id UUID FK users`, `type VARCHAR(50)`,
`title VARCHAR(255)`, `body TEXT`, `reference_type VARCHAR(50)`,
`reference_id UUID`, `read_at`, `created_at`.

### notification_preferences

Composite PK: `user_id UUID FK users`, `notification_type VARCHAR(50)`;
`in_app_enabled`, `push_enabled`, `email_enabled` BOOLEAN.

### notification_deliveries

`id UUID PK`, `notification_id UUID FK notifications`,
`channel VARCHAR(20)`, `provider VARCHAR(50)`, `status VARCHAR(30)`,
`external_id VARCHAR(255)`, `error_message TEXT`, `sent_at`,
`created_at`.

## Voucher, Promotion & CMS

### vouchers

`id UUID PK`, `merchant_id UUID FK merchants nullable (null=platform)`,
`code VARCHAR(50) UNIQUE`, `name VARCHAR(150)`, `description TEXT`,
`discount_type VARCHAR(30)`, `discount_value NUMERIC(19,2)`,
`max_discount NUMERIC(19,2)`, `minimum_purchase NUMERIC(19,2)`,
`usage_limit INTEGER`, `usage_limit_per_user INTEGER`, `valid_from`,
`valid_until`, `status`, `created_at`.

### voucher_product_categories

Composite PK/FK: `voucher_id`, `product_category_id`.

### voucher_products

Composite PK/FK: `voucher_id`, `product_id`.

### voucher_services

Composite PK/FK: `voucher_id`, `service_id`.

### voucher_usages

`id UUID PK`, `voucher_id UUID FK vouchers`, `user_id UUID FK users`,
`checkout_id UUID FK checkouts`, `discount_amount NUMERIC(19,2)`,
`used_at`.

### campaigns

`id UUID PK`, `name VARCHAR(200)`, `description TEXT`, `start_at`,
`end_at`, `status VARCHAR(20)`, `created_at`.

### product_promotions

`id UUID PK`, `campaign_id UUID FK campaigns nullable`,
`product_variant_id UUID FK product_variants`,
`merchant_id UUID FK merchants`, `discount_type`,
`discount_value NUMERIC(19,2)`, `start_at`, `end_at`, `is_active`.

### service_promotions

`id UUID PK`, `campaign_id UUID FK campaigns nullable`,
`service_id UUID FK services`, `merchant_id UUID FK merchants`, discount
fields/times, `is_active`.

### banners

`id UUID PK`, `title VARCHAR(200)`, `file_id UUID FK files`,
`target_type VARCHAR(30)`, `target_value TEXT`, `placement VARCHAR(50)`,
`start_at`, `end_at`, `sort_order INTEGER`, `is_active`.

## Dispute

### disputes

`id UUID PK`, `dispute_number VARCHAR(50) UNIQUE`,
`user_id UUID FK users`, `merchant_id UUID FK merchants nullable`,
`order_id UUID FK orders nullable`,
`booking_id UUID FK bookings nullable`, `type VARCHAR(50)`,
`reason TEXT`, `status VARCHAR(30)`, `resolution TEXT`,
`assigned_admin_id UUID FK users`, `created_at`, `resolved_at`.

### dispute_messages

`id UUID PK`, `dispute_id UUID FK disputes`,
`sender_user_id UUID FK users`, `message TEXT`, `created_at`.

### dispute_attachments

`id UUID PK`, `dispute_id UUID FK disputes`, `file_id UUID FK files`,
`uploaded_by UUID FK users`, `created_at`.

## File Management

### files

`id UUID PK`, `storage_provider VARCHAR(30)`,
`bucket_name VARCHAR(150)`, `object_key TEXT UNIQUE`,
`original_filename VARCHAR(255)`, `content_type VARCHAR(150)`,
`file_size BIGINT`, `checksum VARCHAR(128)`,
`uploaded_by UUID FK users nullable`, `created_at`, `deleted_at`.

Note: users↔files creates a migration-order cycle; add one FK in a later
Flyway migration.

## Admin / Audit / Configuration

### audit_logs

`id UUID PK`, `actor_user_id UUID FK users nullable`,
`action VARCHAR(100)`, `entity_type VARCHAR(100)`, `entity_id UUID`,
`old_value JSONB`, `new_value JSONB`, `ip_address INET`,
`user_agent TEXT`, `created_at`. Immutable.

### system_configurations

`id UUID PK`, `config_key VARCHAR(150) UNIQUE`, `config_value JSONB`,
`description TEXT`, `is_public BOOLEAN`, `updated_by UUID FK users`,
`updated_at`.

### booking_cancellation_policies

`id UUID PK`, `service_id UUID FK services nullable (null=global)`,
`min_hours_before INTEGER`, `max_hours_before INTEGER nullable`,
`refund_percentage NUMERIC(5,2) CHECK 0..100`, `is_active BOOLEAN`,
`created_at`.

## Integration

### integration_webhook_events

`id UUID PK`, `provider VARCHAR(50)`, `event_type VARCHAR(100)`,
`external_event_id VARCHAR(255)`, `payload JSONB`,
`signature_valid BOOLEAN`, `processing_status VARCHAR(30)`,
`processing_error TEXT`, `received_at`, `processed_at`. Unique
`(provider,external_event_id)` when external ID exists.

### shipping_rate_quotes

`id UUID PK`, `checkout_id UUID FK checkouts`,
`branch_id UUID FK merchant_branches`, `provider VARCHAR(50)`,
`courier_code VARCHAR(50)`, `service_code VARCHAR(50)`,
`service_name VARCHAR(100)`, `cost NUMERIC(19,2)`,
`estimated_days_min INTEGER`, `estimated_days_max INTEGER`,
`external_quote_id VARCHAR(255)`, `expires_at`, `selected BOOLEAN`,
`raw_payload JSONB`, `created_at`.

# Critical Relationships

``` text
users -> customer_profiles / addresses / pets / carts / checkouts / user_roles

merchants
  -> merchant_branches
  -> merchant_staff
  -> products
  -> services
  -> merchant_wallets
  -> settlements

products -> product_variants -> inventories (per branch)
services -> service_branches / service_prices / service_staff -> bookings

cart -> cart_product_items + cart_service_items

checkout
  -> orders (0..N)
  -> bookings (0..N)
  -> payments (1..N attempts)

orders -> order_items / shipment / reviews / settlement_items
bookings -> histories / pet_vaccinations / reviews / settlement_items
```

# Mixed Product + Service Checkout

1.  Cart can contain product items from multiple merchants and multiple
    service items.
2.  Product items are grouped into orders by merchant/fulfillment
    branch.
3.  Each service item becomes an independent booking.
4.  Service slots are temporarily held before payment.
5.  Backend recalculates all prices, discounts, shipping and fees.
6.  Payment belongs to checkout.
7.  Successful payment updates all related orders/bookings idempotently.
8.  AUTO_CONFIRM booking confirms after payment if constraints remain
    valid.
9.  MERCHANT_CONFIRM booking becomes PENDING_CONFIRMATION.
10. Failed/expired checkout releases inventory reservations and slot
    holds.
11. Veterinary booking requires verified veterinarian before
    confirmation.

# Shipping Aggregator Flow

Customer address + branch origin + package weight/dimensions →
aggregator quote → `shipping_rate_quotes` → customer selects → order
shipping snapshot → payment → shipment creation → aggregator
webhook/polling → `shipment_status_histories`.

# Required Integrity Rules

1.  Pet used in booking must belong to customer.
2.  Branch must belong to the referenced merchant.
3.  Product variant/order branch ownership must be valid.
4.  Available inventory must never become negative.
5.  Booking overlap must respect staff/service capacity.
6.  Veterinary service cannot confirm without VERIFIED veterinarian.
7.  Reviews require completed eligible transactions.
8.  Withdrawal cannot exceed available merchant balance.
9.  Payment and shipping webhooks must be idempotent.
10. Stock movements and financial ledger entries are immutable.
11. Transaction snapshots are immutable historical facts.
12. Expired checkout releases temporary reservations.
13. All financial/inventory writes use database transactions and
    concurrency control.

# Important Indexes

Index all frequently joined FK columns plus: - users(email),
users(phone_number), users(status) -
merchant_branches(merchant_id,is_active) - products(merchant_id,status),
products(category_id,status) - product_variants(product_id,is_active) -
inventories(branch_id,variant_id) UNIQUE - services(merchant_id,status),
services(category_id,status) - bookings(branch_id,scheduled_start_at) -
bookings(staff_id,scheduled_start_at) - bookings(user_id,created_at
DESC) - orders(user_id,created_at DESC) -
orders(merchant_id,status,created_at DESC) - payments(checkout_id),
payments(external_transaction_id) -
messages(conversation_id,created_at) -
notifications(user_id,read_at,created_at DESC) -
stock_movements(inventory_id,created_at DESC) -
merchant_ledger_entries(merchant_id,created_at DESC) -
integration_webhook_events(provider,external_event_id)

# Out of Scope for MVP

-   Full electronic medical record
-   Telemedicine/video consultation
-   Pet insurance
-   Adoption marketplace
-   Social/community feed
-   Loyalty points
-   Subscription plans
-   Full procurement/WMS
-   Advanced accounting/general ledger
-   Elasticsearch/OpenSearch domain persistence
-   AI recommendation history
-   IoT pet devices

# Knowledge-Agent Rules

1.  This document is the canonical MVP relational model.
2.  Never merge products and services.
3.  Never merge orders and bookings.
4.  Checkout is the aggregation boundary enabling mixed product +
    service checkout.
5.  Payments belong to checkout.
6.  Product fulfillment uses orders; service fulfillment uses bookings.
7.  Never trust frontend prices.
8.  Use UUID IDs and BigDecimal/NUMERIC for money.
9.  Use TIMESTAMPTZ-compatible Java time types.
10. Preserve transaction snapshots.
11. Use Flyway; never rely on Hibernate `ddl-auto=update` in production.
12. Add optimistic locking where required, especially
    inventory/wallet-like mutable balances.
13. External callbacks must be idempotent.
14. Secrets/bank account values must not appear in plaintext logs.
15. Enforce relational constraints in PostgreSQL whenever practical and
    cross-domain rules in transactional Spring services.
