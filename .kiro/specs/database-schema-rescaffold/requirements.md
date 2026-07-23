# Requirements Document

## Introduction

This specification covers the complete rescaffolding of the Pet Marketplace MVP database schema and Java entity layer. The existing JPA entities, repositories, DTOs, controllers, and services will be removed and replaced with a comprehensive implementation matching the full MVP Database Knowledge document (80+ tables). This includes rewriting the Flyway migrations (V1__init.sql for DDL and V2__seed_data.sql for reference data).

## Glossary

- **Schema**: The complete PostgreSQL DDL definition including tables, constraints, indexes, and relationships
- **Entity_Layer**: The set of JPA entity classes mapped to the database schema
- **Migration**: A Flyway versioned SQL file that defines or modifies the database structure
- **Seed_Data**: Initial reference data required for the application to function (roles, permissions, pet types, breeds, categories, brands, system config)
- **Soft_Delete**: A pattern where records are marked with a deleted_at timestamp rather than physically removed
- **Immutable_Log**: A table whose records are never updated or deleted after creation (audit logs, ledger entries, stock movements)
- **Snapshot_Field**: A denormalized copy of mutable data preserved at transaction time for historical accuracy
- **Composite_PK**: A primary key consisting of two or more columns
- **UUID_PK**: A UUID primary key with DEFAULT gen_random_uuid()

## Requirements

### Requirement 1: Remove Existing Entity Layer

**User Story:** As a developer, I want all existing JPA entities, repositories, DTOs, controllers, and services removed, so that the codebase starts fresh without conflicts from the outdated schema.

#### Acceptance Criteria

1. WHEN the rescaffold begins, THE Build_System SHALL compile successfully after all existing entity classes in src/main/java/com/petshop/api/entity/ are deleted
2. WHEN the rescaffold begins, THE Build_System SHALL compile successfully after all existing repository interfaces in src/main/java/com/petshop/api/repository/ are deleted
3. WHEN the rescaffold begins, THE Build_System SHALL compile successfully after all existing DTO classes in src/main/java/com/petshop/api/dto/ are deleted
4. WHEN the rescaffold begins, THE Build_System SHALL compile successfully after all existing controller classes in src/main/java/com/petshop/api/controllers/ are deleted (except HealthController)
5. WHEN the rescaffold begins, THE Build_System SHALL compile successfully after all existing service classes in src/main/java/com/petshop/api/service/ are deleted

### Requirement 2: Flyway V1 Migration — Identity and Authentication Tables

**User Story:** As a developer, I want the V1 migration to define all identity and authentication tables, so that user management, OAuth, tokens, OTP, login history, and device tracking are supported.

#### Acceptance Criteria

1. THE Migration SHALL create a users table with UUID_PK, full_name, email (UNIQUE nullable), phone_number (UNIQUE nullable), password_hash (nullable), profile_image_file_id (FK files nullable), status VARCHAR(30), email_verified_at, phone_verified_at, last_login_at, created_at, updated_at, deleted_at
2. THE Migration SHALL create a user_oauth_accounts table with UUID_PK, user_id (FK users), provider VARCHAR(30), provider_user_id VARCHAR(255), provider_email, created_at, and UNIQUE constraint on (provider, provider_user_id)
3. THE Migration SHALL create a refresh_tokens table with UUID_PK, user_id (FK users), token_hash (UNIQUE), device_id (FK user_devices nullable), expires_at, revoked_at, created_at
4. THE Migration SHALL create a verification_tokens table with UUID_PK, user_id (FK users), type VARCHAR(30), token_hash (UNIQUE), expires_at, used_at, created_at
5. THE Migration SHALL create an otp_requests table with UUID_PK, user_id (FK users nullable), destination VARCHAR(255), channel VARCHAR(20), purpose VARCHAR(30), otp_hash, expires_at, verified_at, attempt_count INTEGER DEFAULT 0, created_at
6. THE Migration SHALL create a login_histories table with UUID_PK, user_id (FK users nullable), login_identifier, success BOOLEAN, failure_reason, ip_address INET, user_agent, logged_in_at
7. THE Migration SHALL create a user_devices table with UUID_PK, user_id (FK users), device_identifier, platform VARCHAR(30), device_name, push_token, last_active_at, created_at

### Requirement 3: Flyway V1 Migration — RBAC Tables

**User Story:** As a developer, I want the V1 migration to define RBAC tables, so that role-based access control with granular permissions and platform/merchant scopes is supported.

#### Acceptance Criteria

1. THE Migration SHALL create a roles table with UUID_PK, code VARCHAR(50) UNIQUE, name VARCHAR(100), description VARCHAR(255), scope VARCHAR(30), is_system BOOLEAN, created_at
2. THE Migration SHALL create a permissions table with UUID_PK, code VARCHAR(100) UNIQUE, name VARCHAR(150), module VARCHAR(100), description VARCHAR(255)
3. THE Migration SHALL create a role_permissions table with composite PK (role_id FK roles, permission_id FK permissions)
4. THE Migration SHALL create a user_roles table with composite PK (user_id FK users, role_id FK roles) and created_at

### Requirement 4: Flyway V1 Migration — Customer and Address Tables

**User Story:** As a developer, I want customer profile and address tables, so that customers can manage personal data and multiple delivery addresses.

#### Acceptance Criteria

1. THE Migration SHALL create a customer_profiles table with user_id as PK (FK users), gender VARCHAR(20), birth_date DATE, created_at, updated_at
2. THE Migration SHALL create an addresses table with UUID_PK, user_id (FK users), label, recipient_name, recipient_phone, province/city/district/subdistrict code and name fields, postal_code, address_line TEXT, latitude NUMERIC(10,7), longitude NUMERIC(10,7), notes, is_default BOOLEAN, and audit timestamps

### Requirement 5: Flyway V1 Migration — Pet and Vaccination Tables

**User Story:** As a developer, I want pet and vaccination tables, so that customers can manage pet profiles and basic vaccination history.

#### Acceptance Criteria

1. THE Migration SHALL create a pet_types table with UUID_PK, code VARCHAR(50) UNIQUE, name VARCHAR(100), is_active BOOLEAN, sort_order INTEGER
2. THE Migration SHALL create a pet_breeds table with UUID_PK, pet_type_id (FK pet_types), name VARCHAR(150), is_active BOOLEAN, created_at, and UNIQUE constraint on (pet_type_id, name)
3. THE Migration SHALL create a pets table with UUID_PK, owner_user_id (FK users), pet_type_id (FK pet_types), breed_id (FK pet_breeds nullable), name, gender, birth_date, birth_date_estimated, weight_kg NUMERIC(7,2), color, sterilized, microchip_number (UNIQUE nullable), profile_image_file_id (FK files nullable), allergies, special_notes, and audit timestamps
4. THE Migration SHALL create a vaccine_types table with UUID_PK, pet_type_id (FK pet_types nullable), code VARCHAR(100) UNIQUE, name VARCHAR(150), description, is_active BOOLEAN
5. THE Migration SHALL create a pet_vaccinations table with UUID_PK, pet_id (FK pets), vaccine_type_id (FK vaccine_types nullable), booking_id (FK bookings nullable), merchant_id (FK merchants nullable), branch_id (FK merchant_branches nullable), veterinarian_staff_id (FK merchant_staff nullable), vaccine_name_snapshot, vaccination_date DATE, next_vaccination_date DATE, batch_number, certificate_file_id (FK files nullable), notes, created_at, created_by (FK users)

### Requirement 6: Flyway V1 Migration — Merchant and Branch Tables

**User Story:** As a developer, I want merchant and branch tables, so that multi-branch merchant operations including business hours and closures are supported.

#### Acceptance Criteria

1. THE Migration SHALL create a merchants table with UUID_PK, owner_user_id (FK users), business_name, display_name, description, email, phone_number, whatsapp_number, nib, npwp, logo_file_id (FK files nullable), banner_file_id (FK files nullable), verification_status VARCHAR(30), verified_at, verified_by (FK users nullable), rating_average NUMERIC(3,2), rating_count INTEGER, and audit timestamps
2. THE Migration SHALL create a merchant_documents table with UUID_PK, merchant_id (FK merchants), document_type, document_number, file_id (FK files), status VARCHAR(30), rejection_reason, expires_at DATE, created_at
3. THE Migration SHALL create a merchant_verification_histories table with UUID_PK, merchant_id (FK merchants), from_status, to_status, notes, acted_by (FK users), created_at
4. THE Migration SHALL create a merchant_branches table with UUID_PK, merchant_id (FK merchants), code VARCHAR(50), name, phone_number, email, full address fields with province/city/district/subdistrict, postal_code, address_line, latitude NUMERIC(10,7), longitude NUMERIC(10,7), is_active BOOLEAN, audit timestamps, and UNIQUE constraint on (merchant_id, code)
5. THE Migration SHALL create a merchant_business_hours table with UUID_PK, branch_id (FK merchant_branches), day_of_week SMALLINT CHECK 1-7, open_time TIME, close_time TIME, is_closed BOOLEAN, and UNIQUE constraint on (branch_id, day_of_week)
6. THE Migration SHALL create a merchant_branch_closures table with UUID_PK, branch_id (FK merchant_branches), closure_date DATE, is_closed BOOLEAN, open_time TIME, close_time TIME, reason VARCHAR(255), and UNIQUE constraint on (branch_id, closure_date)

### Requirement 7: Flyway V1 Migration — Merchant Staff and Veterinarian Tables

**User Story:** As a developer, I want staff and veterinarian tables, so that merchant employees including groomers and verified veterinarians can be managed across branches.

#### Acceptance Criteria

1. THE Migration SHALL create a merchant_staff table with UUID_PK, merchant_id (FK merchants), user_id (FK users), role_id (FK roles), employee_code VARCHAR(100), display_name VARCHAR(150), status VARCHAR(30), joined_at DATE, audit timestamps, and UNIQUE constraint on (merchant_id, user_id)
2. THE Migration SHALL create a merchant_staff_branches table with composite PK (staff_id FK merchant_staff, branch_id FK merchant_branches)
3. THE Migration SHALL create a veterinarian_profiles table with staff_id as PK (FK merchant_staff), license_number VARCHAR(150), license_file_id (FK files nullable), license_expiry_date DATE, verification_status VARCHAR(30), verified_at, verified_by (FK users nullable), notes

### Requirement 8: Flyway V1 Migration — Product Catalog Tables

**User Story:** As a developer, I want product catalog tables, so that merchants can manage hierarchical categories, brands, products with options/variants, and product images.

#### Acceptance Criteria

1. THE Migration SHALL create a product_categories table with UUID_PK, parent_id (self-FK nullable), name VARCHAR(150), slug VARCHAR(180) UNIQUE, description, image_file_id (FK files nullable), is_active BOOLEAN, sort_order INTEGER
2. THE Migration SHALL create a brands table with UUID_PK, name VARCHAR(150) UNIQUE, slug VARCHAR(180) UNIQUE, logo_file_id (FK files nullable), is_active BOOLEAN
3. THE Migration SHALL create a products table with UUID_PK, merchant_id (FK merchants), category_id (FK product_categories), brand_id (FK brands nullable), name VARCHAR(255), slug VARCHAR(300), description, status VARCHAR(30), condition VARCHAR(20), min_purchase_qty INTEGER, rating_average NUMERIC(3,2), rating_count INTEGER, sold_count BIGINT, audit timestamps, and UNIQUE constraint on (merchant_id, slug)
4. THE Migration SHALL create a product_pet_types table with composite PK (product_id FK products, pet_type_id FK pet_types)
5. THE Migration SHALL create a product_options table with UUID_PK, product_id (FK products), name VARCHAR(100), sort_order INTEGER
6. THE Migration SHALL create a product_option_values table with UUID_PK, option_id (FK product_options), value VARCHAR(150), sort_order INTEGER
7. THE Migration SHALL create a product_variants table with UUID_PK, product_id (FK products), sku VARCHAR(100), barcode VARCHAR(100), price NUMERIC(19,2), compare_at_price NUMERIC(19,2), weight_gram INTEGER, length_cm NUMERIC(8,2), width_cm NUMERIC(8,2), height_cm NUMERIC(8,2), is_active BOOLEAN, created_at, updated_at
8. THE Migration SHALL create a product_variant_option_values table with composite PK (variant_id FK product_variants, option_value_id FK product_option_values)
9. THE Migration SHALL create a product_images table with UUID_PK, product_id (FK products), variant_id (FK product_variants nullable), file_id (FK files), is_primary BOOLEAN, sort_order INTEGER

### Requirement 9: Flyway V1 Migration — Inventory Tables

**User Story:** As a developer, I want inventory tables, so that stock is tracked per variant per branch with immutable movement history.

#### Acceptance Criteria

1. THE Migration SHALL create an inventories table with UUID_PK, branch_id (FK merchant_branches), variant_id (FK product_variants), quantity_on_hand INTEGER, quantity_reserved INTEGER, reorder_level INTEGER, updated_at, and UNIQUE constraint on (branch_id, variant_id)
2. THE Migration SHALL create a stock_movements table with UUID_PK, inventory_id (FK inventories), movement_type VARCHAR(30), quantity INTEGER, reference_type VARCHAR(30), reference_id UUID, quantity_before INTEGER, quantity_after INTEGER, notes VARCHAR(500), created_by (FK users), created_at — this table is immutable

### Requirement 10: Flyway V1 Migration — Service and Scheduling Tables

**User Story:** As a developer, I want service and scheduling tables, so that merchants can offer bookable services with branch availability, pricing, staff assignment, and scheduling.

#### Acceptance Criteria

1. THE Migration SHALL create a service_categories table with UUID_PK, parent_id (self-FK nullable), name VARCHAR(150), slug VARCHAR(180) UNIQUE, is_veterinary BOOLEAN, is_active BOOLEAN
2. THE Migration SHALL create a services table with UUID_PK, merchant_id (FK merchants), category_id (FK service_categories), name VARCHAR(255), description, duration_minutes INTEGER, confirmation_mode VARCHAR(30), requires_pet BOOLEAN, requires_verified_veterinarian BOOLEAN, status VARCHAR(30), rating_average NUMERIC(3,2), rating_count INTEGER, and audit timestamps
3. THE Migration SHALL create a service_branches table with composite PK (service_id FK services, branch_id FK merchant_branches) and is_active BOOLEAN
4. THE Migration SHALL create a service_pet_types table with composite PK (service_id FK services, pet_type_id FK pet_types)
5. THE Migration SHALL create a service_prices table with UUID_PK, service_id (FK services), pet_type_id (FK pet_types nullable), breed_id (FK pet_breeds nullable), min_weight_kg NUMERIC(7,2), max_weight_kg NUMERIC(7,2), label VARCHAR(150), price NUMERIC(19,2), is_active BOOLEAN
6. THE Migration SHALL create a service_staff table with composite PK (service_id FK services, staff_id FK merchant_staff, branch_id FK merchant_branches)
7. THE Migration SHALL create a staff_schedules table with UUID_PK, staff_id (FK merchant_staff), branch_id (FK merchant_branches), day_of_week SMALLINT, start_time TIME, end_time TIME, capacity INTEGER DEFAULT 1, is_active BOOLEAN
8. THE Migration SHALL create a staff_schedule_exceptions table with UUID_PK, staff_id (FK merchant_staff), branch_id (FK merchant_branches), exception_date DATE, is_available BOOLEAN, start_time TIME, end_time TIME, reason VARCHAR(255)
9. THE Migration SHALL create a service_slot_holds table with UUID_PK, service_id (FK services), branch_id (FK merchant_branches), staff_id (FK merchant_staff nullable), user_id (FK users), pet_id (FK pets), start_at TIMESTAMPTZ, end_at TIMESTAMPTZ, expires_at TIMESTAMPTZ, status VARCHAR(20), created_at

### Requirement 11: Flyway V1 Migration — Cart Tables

**User Story:** As a developer, I want cart tables, so that customers can build multi-merchant carts with both product and service items.

#### Acceptance Criteria

1. THE Migration SHALL create a carts table with UUID_PK, user_id (FK users), status VARCHAR(20), created_at, updated_at — enforce one ACTIVE cart per user via application logic or partial unique index
2. THE Migration SHALL create a cart_product_items table with UUID_PK, cart_id (FK carts), branch_id (FK merchant_branches), product_variant_id (FK product_variants), quantity INTEGER CHECK > 0, created_at, updated_at, and UNIQUE constraint on (cart_id, branch_id, product_variant_id)
3. THE Migration SHALL create a cart_service_items table with UUID_PK, cart_id (FK carts), service_id (FK services), service_price_id (FK service_prices), branch_id (FK merchant_branches), pet_id (FK pets), staff_id (FK merchant_staff nullable), slot_hold_id (FK service_slot_holds), scheduled_start_at TIMESTAMPTZ, scheduled_end_at TIMESTAMPTZ, created_at

### Requirement 12: Flyway V1 Migration — Checkout Tables

**User Story:** As a developer, I want checkout tables, so that unified checkout with voucher support is represented in the schema.

#### Acceptance Criteria

1. THE Migration SHALL create a checkouts table with UUID_PK, checkout_number VARCHAR(50) UNIQUE, user_id (FK users), cart_id (FK carts nullable), status VARCHAR(30), product_subtotal NUMERIC(19,2), service_subtotal NUMERIC(19,2), shipping_total NUMERIC(19,2), platform_fee NUMERIC(19,2), discount_total NUMERIC(19,2), grand_total NUMERIC(19,2), expires_at TIMESTAMPTZ, created_at, updated_at
2. THE Migration SHALL create a checkout_vouchers table with composite PK (checkout_id FK checkouts, voucher_id FK vouchers) and discount_amount NUMERIC(19,2)

### Requirement 13: Flyway V1 Migration — Order and Shipping Tables

**User Story:** As a developer, I want order and shipping tables, so that multi-merchant order splitting, order items with snapshots, shipment tracking, and status histories are supported.

#### Acceptance Criteria

1. THE Migration SHALL create an orders table with UUID_PK, order_number VARCHAR(50) UNIQUE, checkout_id (FK checkouts), user_id (FK users), merchant_id (FK merchants), branch_id (FK merchant_branches), status VARCHAR(30), subtotal/shipping_cost/discount_amount/platform_fee/total as NUMERIC(19,2), recipient/address snapshot columns, created_at, paid_at, completed_at, cancelled_at
2. THE Migration SHALL create an order_items table with UUID_PK, order_id (FK orders), product_id (FK products), product_variant_id (FK product_variants), product_name snapshot, variant_name snapshot, sku snapshot, unit_price NUMERIC(19,2), quantity INTEGER, subtotal NUMERIC(19,2), discount_amount NUMERIC(19,2), final_amount NUMERIC(19,2)
3. THE Migration SHALL create an order_status_histories table with UUID_PK, order_id (FK orders), from_status VARCHAR(30), to_status VARCHAR(30), notes, changed_by (FK users), created_at
4. THE Migration SHALL create a shipping_providers table with UUID_PK, code VARCHAR(50) UNIQUE, name VARCHAR(150), provider_type VARCHAR(30), is_active BOOLEAN, created_at
5. THE Migration SHALL create a shipments table with UUID_PK, order_id (FK orders UNIQUE), shipping_provider_id (FK shipping_providers), courier_code, courier_name, service_code, service_name, external_shipment_id VARCHAR(255), tracking_number VARCHAR(150), shipping_cost NUMERIC(19,2), status VARCHAR(30), estimated/shipped/delivered timestamps, audit timestamps
6. THE Migration SHALL create a shipment_status_histories table with UUID_PK, shipment_id (FK shipments), status VARCHAR(50), description, location VARCHAR(255), event_at TIMESTAMPTZ, raw_payload JSONB

### Requirement 14: Flyway V1 Migration — Booking Tables

**User Story:** As a developer, I want booking tables, so that service bookings with lifecycle tracking, cancellation policies, and cancellation records are supported.

#### Acceptance Criteria

1. THE Migration SHALL create a bookings table with UUID_PK, booking_number VARCHAR(50) UNIQUE, checkout_id (FK checkouts), user_id (FK users), merchant_id (FK merchants), branch_id (FK merchant_branches), service_id (FK services), service_price_id (FK service_prices nullable), pet_id (FK pets), staff_id (FK merchant_staff nullable), service/price snapshot fields, financial totals as NUMERIC(19,2), confirmation_mode snapshot, status VARCHAR(30), scheduled timestamps, notes, confirmed_at, completed_at, cancelled_at, created_at
2. THE Migration SHALL create a booking_status_histories table with UUID_PK, booking_id (FK bookings), from_status, to_status, notes, changed_by (FK users), created_at
3. THE Migration SHALL create a booking_cancellations table with UUID_PK, booking_id (FK bookings UNIQUE), cancelled_by (FK users), reason_code VARCHAR(50), reason TEXT, refundable_amount NUMERIC(19,2), cancellation_fee NUMERIC(19,2), created_at
4. THE Migration SHALL create a booking_cancellation_policies table with UUID_PK, service_id (FK services nullable for global), min_hours_before INTEGER, max_hours_before INTEGER nullable, refund_percentage NUMERIC(5,2) CHECK 0-100, is_active BOOLEAN, created_at

### Requirement 15: Flyway V1 Migration — Payment and Refund Tables

**User Story:** As a developer, I want payment and refund tables, so that checkout payments with multiple attempts, status tracking, and refund processing are supported.

#### Acceptance Criteria

1. THE Migration SHALL create a payment_methods table with UUID_PK, provider_code VARCHAR(50), method_code VARCHAR(50), name VARCHAR(150), type VARCHAR(30), is_active BOOLEAN, sort_order INTEGER, and UNIQUE constraint on (provider_code, method_code)
2. THE Migration SHALL create a payments table with UUID_PK, payment_number VARCHAR(50) UNIQUE, checkout_id (FK checkouts), user_id (FK users), payment_method_id (FK payment_methods), provider VARCHAR(50), external_transaction_id VARCHAR(255), amount NUMERIC(19,2), status VARCHAR(30), payment_url TEXT, expires_at, paid_at, created_at, updated_at
3. THE Migration SHALL create a payment_status_histories table with UUID_PK, payment_id (FK payments), from_status, to_status, external_status VARCHAR(100), created_at
4. THE Migration SHALL create a refunds table with UUID_PK, refund_number VARCHAR(50) UNIQUE, payment_id (FK payments), order_id (FK orders nullable), booking_id (FK bookings nullable), amount NUMERIC(19,2), reason TEXT, status VARCHAR(30), requested_by (FK users), approved_by (FK users nullable), provider_refund_id VARCHAR(255), created_at, processed_at

### Requirement 16: Flyway V1 Migration — Finance and Settlement Tables

**User Story:** As a developer, I want finance and settlement tables, so that commission rules, merchant wallets, immutable ledger entries, bank accounts, withdrawals, and settlements are supported.

#### Acceptance Criteria

1. THE Migration SHALL create a commission_rules table with UUID_PK, merchant_id (FK merchants nullable), transaction_type VARCHAR(20), category_id UUID nullable, commission_type VARCHAR(20), commission_value NUMERIC(19,4), priority INTEGER, valid_from, valid_until, is_active BOOLEAN
2. THE Migration SHALL create a merchant_wallets table with merchant_id as PK (FK merchants), pending_balance NUMERIC(19,2), available_balance NUMERIC(19,2), updated_at
3. THE Migration SHALL create a merchant_ledger_entries table with UUID_PK, merchant_id (FK merchants), order_id (FK orders nullable), booking_id (FK bookings nullable), refund_id (FK refunds nullable), entry_type VARCHAR(30), balance_type VARCHAR(20), amount NUMERIC(19,2) signed, description VARCHAR(500), created_at — this table is immutable
4. THE Migration SHALL create a merchant_bank_accounts table with UUID_PK, merchant_id (FK merchants), bank_code VARCHAR(50), bank_name VARCHAR(150), account_number_encrypted TEXT, account_number_last4 VARCHAR(4), account_holder_name VARCHAR(200), is_primary BOOLEAN, verification_status VARCHAR(30), created_at, updated_at
5. THE Migration SHALL create a withdrawals table with UUID_PK, withdrawal_number VARCHAR(50) UNIQUE, merchant_id (FK merchants), bank_account_id (FK merchant_bank_accounts), amount NUMERIC(19,2), admin_fee NUMERIC(19,2), status VARCHAR(30), requested_at, processed_at, processed_by (FK users nullable), external_reference VARCHAR(255), rejection_reason TEXT
6. THE Migration SHALL create a settlements table with UUID_PK, settlement_number VARCHAR(50) UNIQUE, merchant_id (FK merchants), gross_amount, commission_amount, refund_amount, net_amount as NUMERIC(19,2), status VARCHAR(30), available_at, created_at
7. THE Migration SHALL create a settlement_items table with UUID_PK, settlement_id (FK settlements), order_id (FK orders nullable), booking_id (FK bookings nullable), gross_amount, commission_amount, net_amount as NUMERIC(19,2)

### Requirement 17: Flyway V1 Migration — Review and Wishlist Tables

**User Story:** As a developer, I want review and wishlist tables, so that product/service reviews with media, merchant replies, and wishlists/favorites are supported.

#### Acceptance Criteria

1. THE Migration SHALL create a reviews table with UUID_PK, user_id (FK users), order_item_id (FK order_items nullable), booking_id (FK bookings nullable), merchant_id (FK merchants), product_id (FK products nullable), service_id (FK services nullable), review_type VARCHAR(20), rating SMALLINT CHECK 1-5, title VARCHAR(200), content TEXT, status VARCHAR(20), created_at, updated_at
2. THE Migration SHALL create a review_media table with UUID_PK, review_id (FK reviews), file_id (FK files), media_type VARCHAR(20), sort_order INTEGER
3. THE Migration SHALL create a review_replies table with UUID_PK, review_id (FK reviews), merchant_id (FK merchants), replied_by (FK users), content TEXT, created_at, updated_at
4. THE Migration SHALL create a product_wishlists table with composite PK (user_id FK users, product_id FK products) and created_at
5. THE Migration SHALL create a service_wishlists table with composite PK (user_id FK users, service_id FK services) and created_at
6. THE Migration SHALL create a favorite_merchants table with composite PK (user_id FK users, merchant_id FK merchants) and created_at

### Requirement 18: Flyway V1 Migration — Chat Tables

**User Story:** As a developer, I want chat tables, so that customer-merchant conversations with attachments and read tracking are supported.

#### Acceptance Criteria

1. THE Migration SHALL create a conversations table with UUID_PK, merchant_id (FK merchants nullable), conversation_type VARCHAR(20), order_id (FK orders nullable), booking_id (FK bookings nullable), last_message_at, created_at
2. THE Migration SHALL create a conversation_members table with composite PK (conversation_id FK conversations, user_id FK users), joined_at, last_read_at
3. THE Migration SHALL create a messages table with UUID_PK, conversation_id (FK conversations), sender_user_id (FK users), message_type VARCHAR(20), content TEXT, product_id (FK products nullable), order_id (FK orders nullable), booking_id (FK bookings nullable), created_at, edited_at, deleted_at
4. THE Migration SHALL create a message_attachments table with UUID_PK, message_id (FK messages), file_id (FK files)

### Requirement 19: Flyway V1 Migration — Notification Tables

**User Story:** As a developer, I want notification tables, so that in-app notifications with per-type preferences and multi-channel delivery tracking are supported.

#### Acceptance Criteria

1. THE Migration SHALL create a notifications table with UUID_PK, user_id (FK users), type VARCHAR(50), title VARCHAR(255), body TEXT, reference_type VARCHAR(50), reference_id UUID, read_at, created_at
2. THE Migration SHALL create a notification_preferences table with composite PK (user_id FK users, notification_type VARCHAR(50)), in_app_enabled BOOLEAN, push_enabled BOOLEAN, email_enabled BOOLEAN
3. THE Migration SHALL create a notification_deliveries table with UUID_PK, notification_id (FK notifications), channel VARCHAR(20), provider VARCHAR(50), status VARCHAR(30), external_id VARCHAR(255), error_message TEXT, sent_at, created_at

### Requirement 20: Flyway V1 Migration — Voucher, Promotion, and CMS Tables

**User Story:** As a developer, I want voucher, promotion, and CMS tables, so that platform/merchant vouchers, campaigns, product/service promotions, and banners are supported.

#### Acceptance Criteria

1. THE Migration SHALL create a vouchers table with UUID_PK, merchant_id (FK merchants nullable for platform vouchers), code VARCHAR(50) UNIQUE, name VARCHAR(150), description, discount_type VARCHAR(30), discount_value NUMERIC(19,2), max_discount NUMERIC(19,2), minimum_purchase NUMERIC(19,2), usage_limit INTEGER, usage_limit_per_user INTEGER, valid_from, valid_until, status VARCHAR(20), created_at
2. THE Migration SHALL create a voucher_product_categories table with composite PK (voucher_id FK vouchers, product_category_id FK product_categories)
3. THE Migration SHALL create a voucher_products table with composite PK (voucher_id FK vouchers, product_id FK products)
4. THE Migration SHALL create a voucher_services table with composite PK (voucher_id FK vouchers, service_id FK services)
5. THE Migration SHALL create a voucher_usages table with UUID_PK, voucher_id (FK vouchers), user_id (FK users), checkout_id (FK checkouts), discount_amount NUMERIC(19,2), used_at
6. THE Migration SHALL create a campaigns table with UUID_PK, name VARCHAR(200), description TEXT, start_at, end_at, status VARCHAR(20), created_at
7. THE Migration SHALL create a product_promotions table with UUID_PK, campaign_id (FK campaigns nullable), product_variant_id (FK product_variants), merchant_id (FK merchants), discount_type VARCHAR(30), discount_value NUMERIC(19,2), start_at, end_at, is_active BOOLEAN
8. THE Migration SHALL create a service_promotions table with UUID_PK, campaign_id (FK campaigns nullable), service_id (FK services), merchant_id (FK merchants), discount_type VARCHAR(30), discount_value NUMERIC(19,2), start_at, end_at, is_active BOOLEAN
9. THE Migration SHALL create a banners table with UUID_PK, title VARCHAR(200), file_id (FK files), target_type VARCHAR(30), target_value TEXT, placement VARCHAR(50), start_at, end_at, sort_order INTEGER, is_active BOOLEAN

### Requirement 21: Flyway V1 Migration — Dispute Tables

**User Story:** As a developer, I want dispute tables, so that order/booking-related disputes with messaging and evidence attachments are supported.

#### Acceptance Criteria

1. THE Migration SHALL create a disputes table with UUID_PK, dispute_number VARCHAR(50) UNIQUE, user_id (FK users), merchant_id (FK merchants nullable), order_id (FK orders nullable), booking_id (FK bookings nullable), type VARCHAR(50), reason TEXT, status VARCHAR(30), resolution TEXT, assigned_admin_id (FK users nullable), created_at, resolved_at
2. THE Migration SHALL create a dispute_messages table with UUID_PK, dispute_id (FK disputes), sender_user_id (FK users), message TEXT, created_at
3. THE Migration SHALL create a dispute_attachments table with UUID_PK, dispute_id (FK disputes), file_id (FK files), uploaded_by (FK users), created_at

### Requirement 22: Flyway V1 Migration — File, Audit, Configuration, and Integration Tables

**User Story:** As a developer, I want file, audit, configuration, and integration tables, so that file metadata, immutable audit logs, system configuration, webhook events, and shipping quotes are supported.

#### Acceptance Criteria

1. THE Migration SHALL create a files table with UUID_PK, storage_provider VARCHAR(30), bucket_name VARCHAR(150), object_key TEXT UNIQUE, original_filename VARCHAR(255), content_type VARCHAR(150), file_size BIGINT, checksum VARCHAR(128), uploaded_by (FK users nullable), created_at, deleted_at
2. THE Migration SHALL create an audit_logs table with UUID_PK, actor_user_id (FK users nullable), action VARCHAR(100), entity_type VARCHAR(100), entity_id UUID, old_value JSONB, new_value JSONB, ip_address INET, user_agent TEXT, created_at — this table is immutable
3. THE Migration SHALL create a system_configurations table with UUID_PK, config_key VARCHAR(150) UNIQUE, config_value JSONB, description TEXT, is_public BOOLEAN, updated_by (FK users nullable), updated_at
4. THE Migration SHALL create an integration_webhook_events table with UUID_PK, provider VARCHAR(50), event_type VARCHAR(100), external_event_id VARCHAR(255), payload JSONB, signature_valid BOOLEAN, processing_status VARCHAR(30), processing_error TEXT, received_at, processed_at, and UNIQUE constraint on (provider, external_event_id) where external_event_id IS NOT NULL
5. THE Migration SHALL create a shipping_rate_quotes table with UUID_PK, checkout_id (FK checkouts), branch_id (FK merchant_branches), provider VARCHAR(50), courier_code VARCHAR(50), service_code VARCHAR(50), service_name VARCHAR(100), cost NUMERIC(19,2), estimated_days_min INTEGER, estimated_days_max INTEGER, external_quote_id VARCHAR(255), expires_at, selected BOOLEAN, raw_payload JSONB, created_at

### Requirement 23: Flyway V1 Migration — Global Conventions and Indexes

**User Story:** As a developer, I want the migration to follow global conventions and include appropriate indexes, so that queries perform well and the schema is consistent.

#### Acceptance Criteria

1. THE Migration SHALL use UUID DEFAULT gen_random_uuid() for all primary keys
2. THE Migration SHALL use TIMESTAMPTZ for all timestamp columns
3. THE Migration SHALL use DATE for calendar date columns and TIME for time-of-day columns
4. THE Migration SHALL use NUMERIC(19,2) for all monetary amount columns
5. THE Migration SHALL use VARCHAR with appropriate length limits for status columns
6. THE Migration SHALL include created_at, updated_at, deleted_at columns on mutable business entities as specified in the database knowledge document
7. THE Migration SHALL NOT include deleted_at on immutable log/ledger tables (audit_logs, stock_movements, merchant_ledger_entries, login_histories, status history tables)
8. THE Migration SHALL create indexes on all foreign key columns that are not part of a primary key
9. THE Migration SHALL create indexes on commonly queried columns including status fields, email, phone_number, and slug fields
10. THE Migration SHALL use ON DELETE CASCADE or ON DELETE SET NULL as appropriate for referential integrity

### Requirement 24: Flyway V2 Seed Data — Roles and Permissions

**User Story:** As a developer, I want seed data for roles and permissions, so that the RBAC system is initialized with the required platform and merchant roles.

#### Acceptance Criteria

1. THE Seed_Data SHALL insert roles: SUPER_ADMIN, ADMIN, CUSTOMER, PETSHOP_OWNER, PETSHOP_ADMIN, PETSHOP_STAFF, GROOMER, VETERINARIAN with appropriate scope (PLATFORM or MERCHANT) and is_system = true
2. THE Seed_Data SHALL insert initial permissions covering major modules: users, merchants, products, services, orders, bookings, payments, finance, reviews, disputes, admin
3. THE Seed_Data SHALL assign permissions to roles via role_permissions matching each role's intended access level

### Requirement 25: Flyway V2 Seed Data — Reference Data

**User Story:** As a developer, I want seed data for pet types, breeds, categories, brands, and system configurations, so that the application has essential reference data available at startup.

#### Acceptance Criteria

1. THE Seed_Data SHALL insert pet types: Dog, Cat, Bird, Fish, Reptile, Small Animal (hamster/rabbit/guinea pig) with appropriate codes and sort orders
2. THE Seed_Data SHALL insert common breeds for at least Dog and Cat pet types
3. THE Seed_Data SHALL insert product categories including at minimum: Food, Treats, Toys, Accessories, Health & Hygiene, Beds & Furniture with hierarchical parent-child relationships
4. THE Seed_Data SHALL insert service categories including at minimum: Grooming, Vaccination, Veterinary Consultation, Dental Care, Boarding with is_veterinary flag set correctly
5. THE Seed_Data SHALL insert vaccine types for common dog and cat vaccines
6. THE Seed_Data SHALL insert system_configurations with keys for: checkout_expiration_minutes, slot_hold_duration_minutes, minimum_withdrawal_amount, default_commission_percentage, review_window_days
7. THE Seed_Data SHALL insert at least one shipping_provider record for the shipping aggregator
8. THE Seed_Data SHALL insert payment_methods covering common Indonesian payment types (QRIS, virtual account, e-wallet)

### Requirement 26: JPA Entity Layer — Base Entity and Common Patterns

**User Story:** As a developer, I want a consistent JPA entity layer with shared base classes and common patterns, so that entities follow the project conventions and reduce code duplication.

#### Acceptance Criteria

1. THE Entity_Layer SHALL provide a BaseEntity abstract class with UUID id field annotated with @GeneratedValue(strategy = GenerationType.UUID)
2. THE Entity_Layer SHALL provide an AuditableEntity abstract class extending BaseEntity with createdAt, updatedAt, deletedAt TIMESTAMPTZ fields using JPA auditing annotations
3. THE Entity_Layer SHALL use Lombok @Getter, @Setter, @NoArgsConstructor, @AllArgsConstructor, and @Builder annotations on entities where appropriate
4. THE Entity_Layer SHALL map all monetary fields to BigDecimal with @Column(precision = 19, scale = 2)
5. THE Entity_Layer SHALL map all timestamp fields to java.time.Instant or java.time.OffsetDateTime
6. THE Entity_Layer SHALL map DATE columns to java.time.LocalDate and TIME columns to java.time.LocalTime
7. THE Entity_Layer SHALL use @Table annotations with explicit table names matching the database schema

### Requirement 27: JPA Entity Layer — All Domain Entities

**User Story:** As a developer, I want JPA entity classes for all 80+ tables, so that Spring Data JPA can interact with the complete database schema.

#### Acceptance Criteria

1. THE Entity_Layer SHALL create entity classes for all Identity and Authentication tables: User, UserOauthAccount, RefreshToken, VerificationToken, OtpRequest, LoginHistory, UserDevice
2. THE Entity_Layer SHALL create entity classes for all RBAC tables: Role, Permission, RolePermission, UserRole
3. THE Entity_Layer SHALL create entity classes for Customer tables: CustomerProfile, Address
4. THE Entity_Layer SHALL create entity classes for Pet tables: PetType, PetBreed, Pet, VaccineType, PetVaccination
5. THE Entity_Layer SHALL create entity classes for Merchant tables: Merchant, MerchantDocument, MerchantVerificationHistory, MerchantBranch, MerchantBusinessHour, MerchantBranchClosure
6. THE Entity_Layer SHALL create entity classes for Staff tables: MerchantStaff, MerchantStaffBranch, VeterinarianProfile
7. THE Entity_Layer SHALL create entity classes for Product tables: ProductCategory, Brand, Product, ProductPetType, ProductOption, ProductOptionValue, ProductVariant, ProductVariantOptionValue, ProductImage
8. THE Entity_Layer SHALL create entity classes for Inventory tables: Inventory, StockMovement
9. THE Entity_Layer SHALL create entity classes for Service tables: ServiceCategory, Service, ServiceBranch, ServicePetType, ServicePrice, ServiceStaff, StaffSchedule, StaffScheduleException, ServiceSlotHold
10. THE Entity_Layer SHALL create entity classes for Cart tables: Cart, CartProductItem, CartServiceItem
11. THE Entity_Layer SHALL create entity classes for Checkout tables: Checkout, CheckoutVoucher
12. THE Entity_Layer SHALL create entity classes for Order tables: Order, OrderItem, OrderStatusHistory, ShippingProvider, Shipment, ShipmentStatusHistory
13. THE Entity_Layer SHALL create entity classes for Booking tables: Booking, BookingStatusHistory, BookingCancellation, BookingCancellationPolicy
14. THE Entity_Layer SHALL create entity classes for Payment tables: PaymentMethod, Payment, PaymentStatusHistory, Refund
15. THE Entity_Layer SHALL create entity classes for Finance tables: CommissionRule, MerchantWallet, MerchantLedgerEntry, MerchantBankAccount, Withdrawal, Settlement, SettlementItem
16. THE Entity_Layer SHALL create entity classes for Review tables: Review, ReviewMedia, ReviewReply, ProductWishlist, ServiceWishlist, FavoriteMerchant
17. THE Entity_Layer SHALL create entity classes for Chat tables: Conversation, ConversationMember, Message, MessageAttachment
18. THE Entity_Layer SHALL create entity classes for Notification tables: Notification, NotificationPreference, NotificationDelivery
19. THE Entity_Layer SHALL create entity classes for Voucher/Promotion tables: Voucher, VoucherProductCategory, VoucherProduct, VoucherService, VoucherUsage, Campaign, ProductPromotion, ServicePromotion, Banner
20. THE Entity_Layer SHALL create entity classes for Dispute tables: Dispute, DisputeMessage, DisputeAttachment
21. THE Entity_Layer SHALL create entity classes for System tables: File, AuditLog, SystemConfiguration, IntegrationWebhookEvent, ShippingRateQuote

### Requirement 28: JPA Entity Layer — Relationships and Composite Keys

**User Story:** As a developer, I want correct JPA relationship mappings and composite key handling, so that entity associations reflect the database schema accurately.

#### Acceptance Criteria

1. THE Entity_Layer SHALL use @ManyToOne with @JoinColumn for all foreign key relationships
2. THE Entity_Layer SHALL use @IdClass or @EmbeddedId for composite primary key tables (role_permissions, user_roles, product_pet_types, product_variant_option_values, service_branches, service_pet_types, service_staff, merchant_staff_branches, cart composite unique, checkout_vouchers, conversation_members, notification_preferences, product_wishlists, service_wishlists, favorite_merchants, voucher_product_categories, voucher_products, voucher_services)
3. THE Entity_Layer SHALL use FetchType.LAZY for all @ManyToOne and @OneToMany relationships by default
4. THE Entity_Layer SHALL NOT define bidirectional @OneToMany collections unless required for cascade operations — prefer unidirectional @ManyToOne
5. THE Entity_Layer SHALL annotate nullable foreign key columns with @Column(nullable = true) and required ones with @Column(nullable = false)

### Requirement 29: Build Verification

**User Story:** As a developer, I want the project to compile successfully after the rescaffold, so that the new schema and entity layer are consistent and ready for development.

#### Acceptance Criteria

1. WHEN all files are generated, THE Build_System SHALL compile the project without errors using mvn compile
2. WHEN Flyway migrations are applied against a clean PostgreSQL database, THE Migration SHALL execute without errors
3. THE Entity_Layer SHALL not produce any JPA mapping warnings related to unmapped columns or incorrect type mappings
