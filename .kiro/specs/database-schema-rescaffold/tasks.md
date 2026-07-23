# Implementation Tasks

## Task 1: Remove Existing Entity Layer
- [x] 1.1 Delete all files in src/main/java/com/petshop/api/entity/ (Category.java, Petshop.java, Product.java, Role.java, User.java)
- [x] 1.2 Delete all files in src/main/java/com/petshop/api/repository/ (CategoryRepository.java, PetshopRepository.java, ProductRepository.java, UserRepository.java)
- [x] 1.3 Delete all files in src/main/java/com/petshop/api/dto/ (CategoryResponse.java, PetshopResponse.java, ProductResponse.java)
- [x] 1.4 Delete controllers except HealthController (CategoryController.java, PetshopController.java, ProductController.java)
- [x] 1.5 Delete all files in src/main/java/com/petshop/api/service/ (CategoryService.java, PetshopService.java, ProductService.java)
- [x] 1.6 Verify project compiles cleanly after deletions (fix any remaining references in HealthController or config classes)

## Task 2: Create Base Entity Classes
- [x] 2.1 Create src/main/java/com/petshop/api/entity/base/BaseEntity.java — abstract MappedSuperclass with UUID id, @GeneratedValue(strategy = UUID)
- [x] 2.2 Create src/main/java/com/petshop/api/entity/base/AuditableEntity.java — extends BaseEntity, adds createdAt, updatedAt, deletedAt with @PrePersist/@PreUpdate lifecycle callbacks

## Task 3: Flyway V1 Migration — Foundation and Identity Tables
- [x] 3.1 Rewrite V1__init.sql: Create files table (UUID PK, storage_provider, bucket_name, object_key UNIQUE, original_filename, content_type, file_size, checksum, uploaded_by nullable initially without FK, created_at, deleted_at)
- [x] 3.2 Add roles table (UUID PK, code UNIQUE, name, description, scope, is_system, created_at)
- [x] 3.3 Add permissions table (UUID PK, code UNIQUE, name, module, description)
- [x] 3.4 Add users table (UUID PK, full_name, email UNIQUE nullable, phone_number UNIQUE nullable, password_hash nullable, profile_image_file_id nullable initially without FK, status, email_verified_at, phone_verified_at, last_login_at, created_at, updated_at, deleted_at)
- [x] 3.5 Add user_oauth_accounts table with UNIQUE(provider, provider_user_id)
- [x] 3.6 Add user_devices table
- [x] 3.7 Add refresh_tokens table with FK to user_devices
- [x] 3.8 Add verification_tokens table
- [x] 3.9 Add otp_requests table
- [x] 3.10 Add login_histories table (immutable, no deleted_at)
- [x] 3.11 Add role_permissions table (composite PK)
- [x] 3.12 Add user_roles table (composite PK with created_at)

## Task 4: Flyway V1 Migration — Customer, Pet, and Merchant Tables
- [x] 4.1 Add customer_profiles table (user_id as PK/FK)
- [x] 4.2 Add addresses table with full location fields
- [x] 4.3 Add pet_types table
- [x] 4.4 Add pet_breeds table with UNIQUE(pet_type_id, name)
- [x] 4.5 Add pets table with all fields and FK to files for profile_image
- [x] 4.6 Add vaccine_types table
- [x] 4.7 Add merchants table with verification_status, rating fields, audit timestamps
- [x] 4.8 Add merchant_documents table
- [x] 4.9 Add merchant_verification_histories table (immutable)
- [x] 4.10 Add merchant_branches table with UNIQUE(merchant_id, code)
- [x] 4.11 Add merchant_business_hours table with UNIQUE(branch_id, day_of_week), CHECK 1-7
- [x] 4.12 Add merchant_branch_closures table with UNIQUE(branch_id, closure_date)

## Task 5: Flyway V1 Migration — Staff, Product, Inventory Tables
- [x] 5.1 Add merchant_staff table with UNIQUE(merchant_id, user_id)
- [x] 5.2 Add merchant_staff_branches table (composite PK)
- [x] 5.3 Add veterinarian_profiles table (staff_id as PK/FK)
- [x] 5.4 Add product_categories table (self-referencing parent_id, slug UNIQUE)
- [x] 5.5 Add brands table (name UNIQUE, slug UNIQUE)
- [x] 5.6 Add products table with UNIQUE(merchant_id, slug)
- [x] 5.7 Add product_pet_types table (composite PK)
- [x] 5.8 Add product_options and product_option_values tables
- [x] 5.9 Add product_variants table
- [x] 5.10 Add product_variant_option_values table (composite PK)
- [x] 5.11 Add product_images table
- [x] 5.12 Add inventories table with UNIQUE(branch_id, variant_id)
- [x] 5.13 Add stock_movements table (immutable)

## Task 6: Flyway V1 Migration — Service and Scheduling Tables
- [x] 6.1 Add service_categories table (self-referencing parent_id, slug UNIQUE, is_veterinary)
- [x] 6.2 Add services table with confirmation_mode, requires_pet, requires_verified_veterinarian
- [x] 6.3 Add service_branches table (composite PK + is_active)
- [x] 6.4 Add service_pet_types table (composite PK)
- [x] 6.5 Add service_prices table with pet_type/breed/weight-based pricing
- [x] 6.6 Add service_staff table (composite PK: service_id, staff_id, branch_id)
- [x] 6.7 Add staff_schedules table
- [x] 6.8 Add staff_schedule_exceptions table
- [x] 6.9 Add service_slot_holds table with status and expiration

## Task 7: Flyway V1 Migration — Cart, Voucher, Checkout Tables
- [x] 7.1 Add carts table with partial unique index for one ACTIVE cart per user
- [x] 7.2 Add cart_product_items table with UNIQUE(cart_id, branch_id, product_variant_id), CHECK quantity > 0
- [x] 7.3 Add cart_service_items table
- [x] 7.4 Add vouchers table (code UNIQUE, merchant_id nullable for platform vouchers)
- [x] 7.5 Add voucher_product_categories, voucher_products, voucher_services tables (composite PKs)
- [x] 7.6 Add checkouts table (checkout_number UNIQUE, all financial totals)
- [x] 7.7 Add checkout_vouchers table (composite PK)

## Task 8: Flyway V1 Migration — Order, Shipping, Booking Tables
- [x] 8.1 Add orders table (order_number UNIQUE, recipient/address snapshot columns, all financial fields)
- [x] 8.2 Add order_items table with snapshot fields (product_name, variant_name, sku, unit_price)
- [x] 8.3 Add order_status_histories table (immutable)
- [x] 8.4 Add shipping_providers table (code UNIQUE)
- [x] 8.5 Add shipments table (order_id UNIQUE for MVP)
- [x] 8.6 Add shipment_status_histories table with raw_payload JSONB
- [x] 8.7 Add bookings table (booking_number UNIQUE, service/price snapshots, financial totals, confirmation_mode snapshot)
- [x] 8.8 Add booking_status_histories table (immutable)
- [x] 8.9 Add booking_cancellations table (booking_id UNIQUE)
- [x] 8.10 Add booking_cancellation_policies table

## Task 9: Flyway V1 Migration — Payment, Finance, Review Tables
- [x] 9.1 Add payment_methods table with UNIQUE(provider_code, method_code)
- [x] 9.2 Add payments table (payment_number UNIQUE)
- [x] 9.3 Add payment_status_histories table (immutable)
- [x] 9.4 Add refunds table (refund_number UNIQUE, order_id/booking_id nullable)
- [x] 9.5 Add commission_rules table
- [x] 9.6 Add merchant_wallets table (merchant_id as PK/FK)
- [x] 9.7 Add merchant_ledger_entries table (immutable)
- [x] 9.8 Add merchant_bank_accounts table
- [x] 9.9 Add withdrawals table (withdrawal_number UNIQUE)
- [x] 9.10 Add settlements table (settlement_number UNIQUE)
- [x] 9.11 Add settlement_items table
- [x] 9.12 Add reviews table with CHECK rating 1-5
- [x] 9.13 Add review_media, review_replies tables
- [x] 9.14 Add product_wishlists, service_wishlists, favorite_merchants tables (composite PKs)

## Task 10: Flyway V1 Migration — Chat, Notification, Promotion, Dispute, System Tables
- [x] 10.1 Add conversations table
- [x] 10.2 Add conversation_members table (composite PK)
- [x] 10.3 Add messages table with soft delete
- [x] 10.4 Add message_attachments table
- [x] 10.5 Add notifications table
- [x] 10.6 Add notification_preferences table (composite PK)
- [x] 10.7 Add notification_deliveries table
- [x] 10.8 Add campaigns table
- [x] 10.9 Add product_promotions, service_promotions tables
- [x] 10.10 Add banners table
- [x] 10.11 Add voucher_usages table
- [x] 10.12 Add disputes table (dispute_number UNIQUE)
- [x] 10.13 Add dispute_messages, dispute_attachments tables
- [x] 10.14 Add audit_logs table (immutable)
- [x] 10.15 Add system_configurations table (config_key UNIQUE)
- [x] 10.16 Add integration_webhook_events table with partial UNIQUE on (provider, external_event_id)
- [x] 10.17 Add shipping_rate_quotes table
- [x] 10.18 Add pet_vaccinations table (depends on bookings, merchants, branches, staff)
- [x] 10.19 Add deferred ALTER TABLE for circular FKs: users.profile_image_file_id → files, files.uploaded_by → users
- [x] 10.20 Create all indexes on FK columns, status fields, email, phone, slugs, and common query patterns

## Task 11: Flyway V2 Seed Data
- [x] 11.1 Rewrite V2__seed_data.sql: Insert roles (SUPER_ADMIN, ADMIN, CUSTOMER, PETSHOP_OWNER, PETSHOP_ADMIN, PETSHOP_STAFF, GROOMER, VETERINARIAN) with correct scope and is_system=true
- [x] 11.2 Insert permissions for all major modules (users, merchants, products, services, orders, bookings, payments, finance, reviews, disputes, admin)
- [x] 11.3 Insert role_permissions assignments
- [x] 11.4 Insert pet_types (Dog, Cat, Bird, Fish, Reptile, Small Animal)
- [x] 11.5 Insert pet_breeds for Dog and Cat (common breeds)
- [x] 11.6 Insert product_categories hierarchy (Food, Treats, Toys, Accessories, Health & Hygiene, Beds & Furniture with subcategories)
- [x] 11.7 Insert service_categories (Grooming, Vaccination, Veterinary Consultation, Dental Care, Boarding) with is_veterinary flags
- [x] 11.8 Insert vaccine_types for common dog and cat vaccines
- [x] 11.9 Insert system_configurations (checkout_expiration_minutes, slot_hold_duration_minutes, minimum_withdrawal_amount, default_commission_percentage, review_window_days)
- [x] 11.10 Insert shipping_providers (at least one aggregator)
- [x] 11.11 Insert payment_methods (QRIS, Virtual Account, E-Wallet types)

## Task 12: JPA Entities — Identity, RBAC, Customer
- [x] 12.1 Create entity/identity/User.java extending AuditableEntity
- [x] 12.2 Create entity/identity/UserOauthAccount.java
- [x] 12.3 Create entity/identity/RefreshToken.java
- [x] 12.4 Create entity/identity/VerificationToken.java
- [x] 12.5 Create entity/identity/OtpRequest.java
- [x] 12.6 Create entity/identity/LoginHistory.java (extends BaseEntity, no soft delete)
- [x] 12.7 Create entity/identity/UserDevice.java
- [x] 12.8 Create entity/rbac/Role.java
- [x] 12.9 Create entity/rbac/Permission.java
- [x] 12.10 Create entity/rbac/RolePermission.java with RolePermissionId @IdClass
- [x] 12.11 Create entity/rbac/UserRole.java with UserRoleId @IdClass
- [x] 12.12 Create entity/customer/CustomerProfile.java (user_id as PK, not extending BaseEntity)
- [x] 12.13 Create entity/customer/Address.java extending AuditableEntity

## Task 13: JPA Entities — Pet, Merchant, Staff
- [x] 13.1 Create entity/pet/PetType.java
- [x] 13.2 Create entity/pet/PetBreed.java
- [x] 13.3 Create entity/pet/Pet.java extending AuditableEntity
- [x] 13.4 Create entity/pet/VaccineType.java
- [x] 13.5 Create entity/pet/PetVaccination.java (extends BaseEntity with createdAt/createdBy only)
- [x] 13.6 Create entity/merchant/Merchant.java extending AuditableEntity
- [x] 13.7 Create entity/merchant/MerchantDocument.java
- [x] 13.8 Create entity/merchant/MerchantVerificationHistory.java (extends BaseEntity, immutable)
- [x] 13.9 Create entity/merchant/MerchantBranch.java extending AuditableEntity
- [x] 13.10 Create entity/merchant/MerchantBusinessHour.java
- [x] 13.11 Create entity/merchant/MerchantBranchClosure.java
- [x] 13.12 Create entity/staff/MerchantStaff.java extending AuditableEntity
- [x] 13.13 Create entity/staff/MerchantStaffBranch.java with MerchantStaffBranchId @IdClass
- [x] 13.14 Create entity/staff/VeterinarianProfile.java (staff_id as PK)

## Task 14: JPA Entities — Product, Inventory, Service
- [x] 14.1 Create entity/product/ProductCategory.java
- [x] 14.2 Create entity/product/Brand.java
- [x] 14.3 Create entity/product/Product.java extending AuditableEntity
- [x] 14.4 Create entity/product/ProductPetType.java with @IdClass
- [x] 14.5 Create entity/product/ProductOption.java
- [x] 14.6 Create entity/product/ProductOptionValue.java
- [x] 14.7 Create entity/product/ProductVariant.java
- [x] 14.8 Create entity/product/ProductVariantOptionValue.java with @IdClass
- [x] 14.9 Create entity/product/ProductImage.java
- [x] 14.10 Create entity/inventory/Inventory.java
- [x] 14.11 Create entity/inventory/StockMovement.java (extends BaseEntity, immutable)
- [x] 14.12 Create entity/service/ServiceCategory.java
- [x] 14.13 Create entity/service/ServiceEntity.java extending AuditableEntity (named ServiceEntity to avoid java.lang.Service conflict)
- [x] 14.14 Create entity/service/ServiceBranch.java with @IdClass
- [x] 14.15 Create entity/service/ServicePetType.java with @IdClass
- [x] 14.16 Create entity/service/ServicePrice.java
- [x] 14.17 Create entity/service/ServiceStaff.java with @IdClass (3-column composite)
- [x] 14.18 Create entity/service/StaffSchedule.java
- [x] 14.19 Create entity/service/StaffScheduleException.java
- [x] 14.20 Create entity/service/ServiceSlotHold.java

## Task 15: JPA Entities — Cart, Checkout, Order, Booking
- [x] 15.1 Create entity/cart/Cart.java extending AuditableEntity
- [x] 15.2 Create entity/cart/CartProductItem.java
- [x] 15.3 Create entity/cart/CartServiceItem.java
- [x] 15.4 Create entity/checkout/Checkout.java
- [x] 15.5 Create entity/checkout/CheckoutVoucher.java with @IdClass
- [x] 15.6 Create entity/order/Order.java (named OrderEntity to avoid java.lang conflicts if needed, @Table name = "orders")
- [x] 15.7 Create entity/order/OrderItem.java with snapshot fields
- [x] 15.8 Create entity/order/OrderStatusHistory.java (immutable)
- [x] 15.9 Create entity/order/ShippingProvider.java
- [x] 15.10 Create entity/order/Shipment.java
- [x] 15.11 Create entity/order/ShipmentStatusHistory.java
- [x] 15.12 Create entity/booking/Booking.java with snapshot fields
- [x] 15.13 Create entity/booking/BookingStatusHistory.java (immutable)
- [x] 15.14 Create entity/booking/BookingCancellation.java
- [x] 15.15 Create entity/booking/BookingCancellationPolicy.java

## Task 16: JPA Entities — Payment, Finance
- [x] 16.1 Create entity/payment/PaymentMethod.java
- [x] 16.2 Create entity/payment/Payment.java
- [x] 16.3 Create entity/payment/PaymentStatusHistory.java (immutable)
- [x] 16.4 Create entity/payment/Refund.java
- [x] 16.5 Create entity/finance/CommissionRule.java
- [x] 16.6 Create entity/finance/MerchantWallet.java (merchant_id as PK)
- [x] 16.7 Create entity/finance/MerchantLedgerEntry.java (extends BaseEntity, immutable)
- [x] 16.8 Create entity/finance/MerchantBankAccount.java
- [x] 16.9 Create entity/finance/Withdrawal.java
- [x] 16.10 Create entity/finance/Settlement.java
- [x] 16.11 Create entity/finance/SettlementItem.java

## Task 17: JPA Entities — Review, Chat, Notification, Promotion, Dispute, System
- [x] 17.1 Create entity/review/Review.java
- [x] 17.2 Create entity/review/ReviewMedia.java
- [x] 17.3 Create entity/review/ReviewReply.java
- [x] 17.4 Create entity/review/ProductWishlist.java with @IdClass
- [x] 17.5 Create entity/review/ServiceWishlist.java with @IdClass
- [x] 17.6 Create entity/review/FavoriteMerchant.java with @IdClass
- [x] 17.7 Create entity/chat/Conversation.java
- [x] 17.8 Create entity/chat/ConversationMember.java with @IdClass
- [x] 17.9 Create entity/chat/Message.java
- [x] 17.10 Create entity/chat/MessageAttachment.java
- [x] 17.11 Create entity/notification/Notification.java
- [x] 17.12 Create entity/notification/NotificationPreference.java with @IdClass
- [x] 17.13 Create entity/notification/NotificationDelivery.java
- [x] 17.14 Create entity/promotion/Voucher.java
- [x] 17.15 Create entity/promotion/VoucherProductCategory.java with @IdClass
- [x] 17.16 Create entity/promotion/VoucherProduct.java with @IdClass
- [x] 17.17 Create entity/promotion/VoucherService.java with @IdClass
- [x] 17.18 Create entity/promotion/VoucherUsage.java
- [x] 17.19 Create entity/promotion/Campaign.java
- [x] 17.20 Create entity/promotion/ProductPromotion.java
- [x] 17.21 Create entity/promotion/ServicePromotion.java
- [x] 17.22 Create entity/promotion/Banner.java
- [x] 17.23 Create entity/dispute/Dispute.java
- [x] 17.24 Create entity/dispute/DisputeMessage.java
- [x] 17.25 Create entity/dispute/DisputeAttachment.java
- [x] 17.26 Create entity/system/FileEntity.java (named FileEntity to avoid java.io.File conflict, @Table name = "files")
- [x] 17.27 Create entity/system/AuditLog.java (extends BaseEntity, immutable)
- [x] 17.28 Create entity/system/SystemConfiguration.java
- [x] 17.29 Create entity/system/IntegrationWebhookEvent.java
- [x] 17.30 Create entity/system/ShippingRateQuote.java

## Task 18: Build Verification
- [x] 18.1 Run mvn compile and fix any compilation errors
- [x] 18.2 Verify all entity @Table names match V1 migration table names
- [x] 18.3 Verify all @Column types match DDL column types (BigDecimal↔NUMERIC, Instant↔TIMESTAMPTZ, LocalDate↔DATE, LocalTime↔TIME)
