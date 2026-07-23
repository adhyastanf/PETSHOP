# Technical Design Document

## Overview

This design describes the implementation plan for rescaffolding the Pet Marketplace MVP database schema and Java entity layer. The approach involves deleting all existing JPA entities/repos/DTOs/controllers/services, creating a comprehensive Flyway V1 migration with 80+ tables, seeding reference data in V2, and building the full JPA entity layer with proper base classes, relationships, and composite key support.

## Architecture

### Project Structure

```
PETSHOP-API/src/main/java/com/petshop/api/
├── config/                          # Keep existing configs
├── controllers/
│   └── HealthController.java        # Keep health check
├── entity/
│   ├── base/                        # Base entity classes
│   │   ├── BaseEntity.java
│   │   └── AuditableEntity.java
│   ├── identity/                    # User, OAuth, tokens, devices
│   ├── rbac/                        # Role, Permission, composites
│   ├── customer/                    # CustomerProfile, Address
│   ├── pet/                         # PetType, PetBreed, Pet, Vaccine
│   ├── merchant/                    # Merchant, Branch, Hours, Docs
│   ├── staff/                       # MerchantStaff, Vet profiles
│   ├── product/                     # Product, Category, Brand, Variant
│   ├── inventory/                   # Inventory, StockMovement
│   ├── service/                     # Service, Scheduling, SlotHold
│   ├── cart/                        # Cart, CartItems
│   ├── checkout/                    # Checkout, CheckoutVoucher
│   ├── order/                       # Order, OrderItem, Shipping
│   ├── booking/                     # Booking, Cancellation, Policy
│   ├── payment/                     # Payment, PaymentMethod, Refund
│   ├── finance/                     # Wallet, Ledger, Settlement
│   ├── review/                      # Review, Wishlist, Favorites
│   ├── chat/                        # Conversation, Message
│   ├── notification/                # Notification, Preferences
│   ├── promotion/                   # Voucher, Campaign, Promotion
│   ├── dispute/                     # Dispute, DisputeMessage
│   └── system/                      # File, AuditLog, Config, Webhook
├── exception/                       # Keep existing exception handling
├── PetshopApiApplication.java       # Keep main class
└── utils/                           # Keep utility classes

PETSHOP-API/src/main/resources/db/migration/
├── V1__init.sql                     # Complete DDL (all 80+ tables)
└── V2__seed_data.sql                # Reference data seeding
```

### Migration Strategy

The V1 migration creates tables in dependency order to satisfy foreign key constraints:

```
Phase 1: Independent/foundation tables (no FK dependencies)
  - files (needed by many tables for FK)
  - roles, permissions

Phase 2: Core identity
  - users (FK → files)
  - user_oauth_accounts, refresh_tokens, verification_tokens, otp_requests
  - login_histories, user_devices
  - role_permissions, user_roles

Phase 3: Customer domain
  - customer_profiles, addresses

Phase 4: Pet domain
  - pet_types, pet_breeds, pets, vaccine_types

Phase 5: Merchant domain
  - merchants, merchant_documents, merchant_verification_histories
  - merchant_branches, merchant_business_hours, merchant_branch_closures

Phase 6: Staff domain
  - merchant_staff, merchant_staff_branches, veterinarian_profiles

Phase 7: Product catalog
  - product_categories, brands, products, product_pet_types
  - product_options, product_option_values
  - product_variants, product_variant_option_values, product_images

Phase 8: Inventory
  - inventories, stock_movements

Phase 9: Service domain
  - service_categories, services, service_branches, service_pet_types
  - service_prices, service_staff
  - staff_schedules, staff_schedule_exceptions, service_slot_holds

Phase 10: Cart
  - carts, cart_product_items, cart_service_items

Phase 11: Vouchers (needed before checkout)
  - vouchers, voucher_product_categories, voucher_products, voucher_services

Phase 12: Checkout
  - checkouts, checkout_vouchers

Phase 13: Orders & Shipping
  - orders, order_items, order_status_histories
  - shipping_providers, shipments, shipment_status_histories

Phase 14: Bookings
  - bookings, booking_status_histories, booking_cancellations
  - booking_cancellation_policies

Phase 15: Payment & Refund
  - payment_methods, payments, payment_status_histories, refunds

Phase 16: Finance
  - commission_rules, merchant_wallets, merchant_ledger_entries
  - merchant_bank_accounts, withdrawals, settlements, settlement_items

Phase 17: Reviews & Wishlists
  - reviews, review_media, review_replies
  - product_wishlists, service_wishlists, favorite_merchants

Phase 18: Chat
  - conversations, conversation_members, messages, message_attachments

Phase 19: Notifications
  - notifications, notification_preferences, notification_deliveries

Phase 20: Promotions & CMS
  - campaigns, product_promotions, service_promotions, banners
  - voucher_usages

Phase 21: Disputes
  - disputes, dispute_messages, dispute_attachments

Phase 22: System & Integration
  - audit_logs, system_configurations
  - integration_webhook_events, shipping_rate_quotes

Phase 23: Pet vaccinations (depends on bookings, merchants, branches, staff)
  - pet_vaccinations

Phase 24: Deferred FK constraints
  - ALTER TABLE users ADD FK profile_image_file_id → files (circular ref)
```

### Base Entity Design

```java
// BaseEntity.java
@MappedSuperclass
@Getter @Setter
public abstract class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;
}

// AuditableEntity.java
@MappedSuperclass
@Getter @Setter
public abstract class AuditableEntity extends BaseEntity {
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
```

### Composite Key Strategy

For composite PK tables, use `@IdClass` with a separate ID class:

```java
// Example: RolePermissionId.java
@Data @NoArgsConstructor @AllArgsConstructor
public class RolePermissionId implements Serializable {
    private UUID role;
    private UUID permission;
}

// RolePermission.java
@Entity @Table(name = "role_permissions")
@IdClass(RolePermissionId.class)
@Getter @Setter @NoArgsConstructor
public class RolePermission {
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private Role role;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "permission_id")
    private Permission permission;
}
```

### Entity Conventions

| Convention | Implementation |
|---|---|
| UUID PK | `@GeneratedValue(strategy = GenerationType.UUID)` |
| Money | `BigDecimal` + `@Column(precision = 19, scale = 2)` |
| Timestamps | `Instant` for TIMESTAMPTZ |
| Dates | `LocalDate` for DATE |
| Times | `LocalTime` for TIME |
| FKs | `@ManyToOne(fetch = LAZY)` + `@JoinColumn` |
| Soft delete | `Instant deletedAt` field |
| Lombok | `@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder` |
| Table name | `@Table(name = "snake_case_table")` |
| No bidirectional | Omit `@OneToMany` unless cascade needed |

### Index Strategy

Indexes are created in the migration for:
- All FK columns not part of a PK
- Status columns (for filtering)
- Email, phone_number (for login lookups)
- Slug fields (for URL lookups)
- Commonly filtered combinations (e.g., user_id + status)

### Circular Dependency Handling

The `users.profile_image_file_id → files.id` creates a circular FK reference since `files.uploaded_by → users.id`. Solution: Create the `files` table first without the `uploaded_by` FK, create the `users` table without `profile_image_file_id` FK, then add both FKs via ALTER TABLE at the end of the migration.

## Implementation Tasks Summary

1. Delete existing entity/repo/dto/controller/service files
2. Write V1__init.sql with all 80+ tables in dependency order
3. Write V2__seed_data.sql with reference data
4. Create base entity classes (BaseEntity, AuditableEntity)
5. Create all JPA entity classes organized by domain package
6. Create composite key ID classes
7. Verify compilation with mvn compile
