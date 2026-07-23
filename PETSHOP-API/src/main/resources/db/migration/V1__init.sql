-- ============================================================
-- V1: Pet Marketplace MVP - Complete DDL Schema
-- ============================================================
-- Phase 1: Foundation tables (no FK dependencies)
-- Phase 2: Identity and authentication tables
-- ============================================================

-- ============================================================
-- PHASE 1: FOUNDATION TABLES
-- ============================================================

-- 3.1: files table
CREATE TABLE files (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    storage_provider    VARCHAR(50) NOT NULL,
    bucket_name         VARCHAR(255) NOT NULL,
    object_key          VARCHAR(500) NOT NULL UNIQUE,
    original_filename   VARCHAR(255),
    content_type        VARCHAR(100),
    file_size           BIGINT,
    checksum            VARCHAR(255),
    uploaded_by         UUID,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

-- 3.2: roles table
CREATE TABLE roles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code            VARCHAR(50) NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    description     VARCHAR(255),
    scope           VARCHAR(30) NOT NULL,
    is_system       BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.3: permissions table
CREATE TABLE permissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code            VARCHAR(100) NOT NULL UNIQUE,
    name            VARCHAR(150) NOT NULL,
    module          VARCHAR(100) NOT NULL,
    description     VARCHAR(255)
);

-- ============================================================
-- PHASE 2: IDENTITY AND AUTHENTICATION TABLES
-- ============================================================

-- 3.4: users table
CREATE TABLE users (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name               VARCHAR(150) NOT NULL,
    email                   VARCHAR(255) UNIQUE,
    phone_number            VARCHAR(30) UNIQUE,
    password_hash           VARCHAR(255),
    profile_image_file_id   UUID,
    status                  VARCHAR(30) NOT NULL,
    email_verified_at       TIMESTAMPTZ,
    phone_verified_at       TIMESTAMPTZ,
    last_login_at           TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ,
    deleted_at              TIMESTAMPTZ
);

-- 3.5: user_oauth_accounts table
CREATE TABLE user_oauth_accounts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id),
    provider            VARCHAR(30) NOT NULL,
    provider_user_id    VARCHAR(255) NOT NULL,
    provider_email      VARCHAR(255),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_oauth_provider_user UNIQUE (provider, provider_user_id)
);

-- 3.6: user_devices table
CREATE TABLE user_devices (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id),
    device_identifier   VARCHAR(255) NOT NULL,
    platform            VARCHAR(30) NOT NULL,
    device_name         VARCHAR(255),
    push_token          TEXT,
    last_active_at      TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.7: refresh_tokens table
CREATE TABLE refresh_tokens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    token_hash      VARCHAR(255) NOT NULL UNIQUE,
    device_id       UUID REFERENCES user_devices(id),
    expires_at      TIMESTAMPTZ NOT NULL,
    revoked_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.8: verification_tokens table
CREATE TABLE verification_tokens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    type            VARCHAR(30) NOT NULL,
    token_hash      VARCHAR(255) NOT NULL UNIQUE,
    expires_at      TIMESTAMPTZ NOT NULL,
    used_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.9: otp_requests table
CREATE TABLE otp_requests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    destination     VARCHAR(255) NOT NULL,
    channel         VARCHAR(20) NOT NULL,
    purpose         VARCHAR(30) NOT NULL,
    otp_hash        VARCHAR(255) NOT NULL,
    expires_at      TIMESTAMPTZ NOT NULL,
    verified_at     TIMESTAMPTZ,
    attempt_count   INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.10: login_histories table (immutable, no deleted_at)
CREATE TABLE login_histories (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID REFERENCES users(id),
    login_identifier    VARCHAR(255),
    success             BOOLEAN NOT NULL,
    failure_reason      VARCHAR(255),
    ip_address          INET,
    user_agent          TEXT,
    logged_in_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PHASE 2B: RBAC JUNCTION TABLES
-- ============================================================

-- 3.11: role_permissions table (composite PK)
CREATE TABLE role_permissions (
    role_id         UUID NOT NULL REFERENCES roles(id),
    permission_id   UUID NOT NULL REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);

-- 3.12: user_roles table (composite PK with created_at)
CREATE TABLE user_roles (
    user_id         UUID NOT NULL REFERENCES users(id),
    role_id         UUID NOT NULL REFERENCES roles(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

-- ============================================================
-- PHASE 3: CUSTOMER DOMAIN
-- ============================================================

-- 4.1: customer_profiles table (user_id as PK and FK to users)
CREATE TABLE customer_profiles (
    user_id         UUID PRIMARY KEY REFERENCES users(id),
    gender          VARCHAR(20),
    birth_date      DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ
);

-- 4.2: addresses table
CREATE TABLE addresses (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID REFERENCES users(id),
    label               VARCHAR(100),
    recipient_name      VARCHAR(150),
    recipient_phone     VARCHAR(30),
    province_code       VARCHAR(10),
    province_name       VARCHAR(100),
    city_code           VARCHAR(10),
    city_name           VARCHAR(100),
    district_code       VARCHAR(10),
    district_name       VARCHAR(100),
    subdistrict_code    VARCHAR(10),
    subdistrict_name    VARCHAR(100),
    postal_code         VARCHAR(10),
    address_line        TEXT,
    latitude            NUMERIC(10,7),
    longitude           NUMERIC(10,7),
    notes               TEXT,
    is_default          BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ,
    deleted_at          TIMESTAMPTZ
);

-- ============================================================
-- PHASE 4: PET DOMAIN
-- ============================================================

-- 4.3: pet_types table
CREATE TABLE pet_types (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code            VARCHAR(50) NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order      INTEGER
);

-- 4.4: pet_breeds table
CREATE TABLE pet_breeds (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_type_id     UUID NOT NULL REFERENCES pet_types(id),
    name            VARCHAR(150) NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_pet_breeds_type_name UNIQUE (pet_type_id, name)
);

-- 4.5: pets table
CREATE TABLE pets (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id           UUID NOT NULL REFERENCES users(id),
    pet_type_id             UUID NOT NULL REFERENCES pet_types(id),
    breed_id                UUID REFERENCES pet_breeds(id),
    name                    VARCHAR(150) NOT NULL,
    gender                  VARCHAR(20),
    birth_date              DATE,
    birth_date_estimated    BOOLEAN DEFAULT FALSE,
    weight_kg               NUMERIC(7,2),
    color                   VARCHAR(100),
    sterilized              BOOLEAN,
    microchip_number        VARCHAR(100) UNIQUE,
    profile_image_file_id   UUID REFERENCES files(id),
    allergies               TEXT,
    special_notes           TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ,
    deleted_at              TIMESTAMPTZ
);

-- 4.6: vaccine_types table
CREATE TABLE vaccine_types (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_type_id     UUID REFERENCES pet_types(id),
    code            VARCHAR(100) NOT NULL UNIQUE,
    name            VARCHAR(150) NOT NULL,
    description     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================
-- PHASE 5: MERCHANT DOMAIN
-- ============================================================

-- 4.7: merchants table
CREATE TABLE merchants (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id           UUID NOT NULL REFERENCES users(id),
    business_name           VARCHAR(200) NOT NULL,
    display_name            VARCHAR(200),
    description             TEXT,
    email                   VARCHAR(255),
    phone_number            VARCHAR(30),
    whatsapp_number         VARCHAR(30),
    nib                     VARCHAR(50),
    npwp                    VARCHAR(50),
    logo_file_id            UUID REFERENCES files(id),
    banner_file_id          UUID REFERENCES files(id),
    verification_status     VARCHAR(30) NOT NULL,
    verified_at             TIMESTAMPTZ,
    verified_by             UUID REFERENCES users(id),
    rating_average          NUMERIC(3,2) DEFAULT 0,
    rating_count            INTEGER NOT NULL DEFAULT 0,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ,
    deleted_at              TIMESTAMPTZ
);

-- 4.8: merchant_documents table
CREATE TABLE merchant_documents (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id         UUID NOT NULL REFERENCES merchants(id),
    document_type       VARCHAR(50) NOT NULL,
    document_number     VARCHAR(100),
    file_id             UUID NOT NULL REFERENCES files(id),
    status              VARCHAR(30) NOT NULL,
    rejection_reason    TEXT,
    expires_at          DATE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.9: merchant_verification_histories table (immutable)
CREATE TABLE merchant_verification_histories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id),
    from_status     VARCHAR(30),
    to_status       VARCHAR(30) NOT NULL,
    notes           TEXT,
    acted_by        UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.10: merchant_branches table
CREATE TABLE merchant_branches (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id         UUID NOT NULL REFERENCES merchants(id),
    code                VARCHAR(50) NOT NULL,
    name                VARCHAR(150) NOT NULL,
    phone_number        VARCHAR(30),
    email               VARCHAR(255),
    province_code       VARCHAR(10),
    province_name       VARCHAR(100),
    city_code           VARCHAR(10),
    city_name           VARCHAR(100),
    district_code       VARCHAR(10),
    district_name       VARCHAR(100),
    subdistrict_code    VARCHAR(10),
    subdistrict_name    VARCHAR(100),
    postal_code         VARCHAR(10),
    address_line        TEXT,
    latitude            NUMERIC(10,7),
    longitude           NUMERIC(10,7),
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ,
    deleted_at          TIMESTAMPTZ,
    CONSTRAINT uq_merchant_branches_merchant_code UNIQUE (merchant_id, code)
);

-- 4.11: merchant_business_hours table
CREATE TABLE merchant_business_hours (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id       UUID NOT NULL REFERENCES merchant_branches(id),
    day_of_week     SMALLINT NOT NULL,
    open_time       TIME,
    close_time      TIME,
    is_closed       BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_merchant_business_hours_branch_day UNIQUE (branch_id, day_of_week),
    CONSTRAINT chk_day_of_week CHECK (day_of_week >= 1 AND day_of_week <= 7)
);

-- 4.12: merchant_branch_closures table
CREATE TABLE merchant_branch_closures (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id       UUID NOT NULL REFERENCES merchant_branches(id),
    closure_date    DATE NOT NULL,
    is_closed       BOOLEAN NOT NULL DEFAULT TRUE,
    open_time       TIME,
    close_time      TIME,
    reason          VARCHAR(255),
    CONSTRAINT uq_merchant_branch_closures_branch_date UNIQUE (branch_id, closure_date)
);

-- ============================================================
-- PHASE 6: STAFF DOMAIN
-- ============================================================

-- 5.1: merchant_staff table
CREATE TABLE merchant_staff (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id),
    user_id         UUID NOT NULL REFERENCES users(id),
    role_id         UUID NOT NULL REFERENCES roles(id),
    employee_code   VARCHAR(100),
    display_name    VARCHAR(150),
    status          VARCHAR(30) NOT NULL,
    joined_at       DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ,
    deleted_at      TIMESTAMPTZ,
    CONSTRAINT uq_merchant_staff_merchant_user UNIQUE (merchant_id, user_id)
);

-- 5.2: merchant_staff_branches table (composite PK)
CREATE TABLE merchant_staff_branches (
    staff_id        UUID NOT NULL REFERENCES merchant_staff(id),
    branch_id       UUID NOT NULL REFERENCES merchant_branches(id),
    PRIMARY KEY (staff_id, branch_id)
);

-- 5.3: veterinarian_profiles table (staff_id as PK)
CREATE TABLE veterinarian_profiles (
    staff_id                UUID PRIMARY KEY REFERENCES merchant_staff(id),
    license_number          VARCHAR(150),
    license_file_id         UUID REFERENCES files(id),
    license_expiry_date     DATE,
    verification_status     VARCHAR(30) NOT NULL,
    verified_at             TIMESTAMPTZ,
    verified_by             UUID REFERENCES users(id),
    notes                   TEXT
);

-- ============================================================
-- PHASE 7: PRODUCT CATALOG
-- ============================================================

-- 5.4: product_categories table (self-referencing)
CREATE TABLE product_categories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id       UUID REFERENCES product_categories(id),
    name            VARCHAR(150) NOT NULL,
    slug            VARCHAR(180) NOT NULL UNIQUE,
    description     TEXT,
    image_file_id   UUID REFERENCES files(id),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order      INTEGER
);

-- 5.5: brands table
CREATE TABLE brands (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(150) NOT NULL UNIQUE,
    slug            VARCHAR(180) NOT NULL UNIQUE,
    logo_file_id    UUID REFERENCES files(id),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE
);

-- 5.6: products table
CREATE TABLE products (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id         UUID NOT NULL REFERENCES merchants(id),
    category_id         UUID NOT NULL REFERENCES product_categories(id),
    brand_id            UUID REFERENCES brands(id),
    name                VARCHAR(255) NOT NULL,
    slug                VARCHAR(300) NOT NULL,
    description         TEXT,
    status              VARCHAR(30) NOT NULL,
    condition           VARCHAR(20),
    min_purchase_qty    INTEGER DEFAULT 1,
    rating_average      NUMERIC(3,2) DEFAULT 0,
    rating_count        INTEGER NOT NULL DEFAULT 0,
    sold_count          BIGINT NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ,
    deleted_at          TIMESTAMPTZ,
    CONSTRAINT uq_products_merchant_slug UNIQUE (merchant_id, slug)
);

-- 5.7: product_pet_types table (composite PK)
CREATE TABLE product_pet_types (
    product_id      UUID NOT NULL REFERENCES products(id),
    pet_type_id     UUID NOT NULL REFERENCES pet_types(id),
    PRIMARY KEY (product_id, pet_type_id)
);

-- 5.8: product_options table
CREATE TABLE product_options (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id),
    name            VARCHAR(100) NOT NULL,
    sort_order      INTEGER
);

-- 5.8: product_option_values table
CREATE TABLE product_option_values (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    option_id       UUID NOT NULL REFERENCES product_options(id),
    value           VARCHAR(150) NOT NULL,
    sort_order      INTEGER
);

-- 5.9: product_variants table
CREATE TABLE product_variants (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id          UUID NOT NULL REFERENCES products(id),
    sku                 VARCHAR(100),
    barcode             VARCHAR(100),
    price               NUMERIC(19,2) NOT NULL,
    compare_at_price    NUMERIC(19,2),
    weight_gram         INTEGER,
    length_cm           NUMERIC(8,2),
    width_cm            NUMERIC(8,2),
    height_cm           NUMERIC(8,2),
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ
);

-- 5.10: product_variant_option_values table (composite PK)
CREATE TABLE product_variant_option_values (
    variant_id          UUID NOT NULL REFERENCES product_variants(id),
    option_value_id     UUID NOT NULL REFERENCES product_option_values(id),
    PRIMARY KEY (variant_id, option_value_id)
);

-- 5.11: product_images table
CREATE TABLE product_images (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id),
    variant_id      UUID REFERENCES product_variants(id),
    file_id         UUID NOT NULL REFERENCES files(id),
    is_primary      BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order      INTEGER
);

-- ============================================================
-- PHASE 8: INVENTORY
-- ============================================================

-- 5.12: inventories table
CREATE TABLE inventories (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id           UUID NOT NULL REFERENCES merchant_branches(id),
    variant_id          UUID NOT NULL REFERENCES product_variants(id),
    quantity_on_hand    INTEGER NOT NULL DEFAULT 0,
    quantity_reserved   INTEGER NOT NULL DEFAULT 0,
    reorder_level       INTEGER,
    updated_at          TIMESTAMPTZ,
    CONSTRAINT uq_inventories_branch_variant UNIQUE (branch_id, variant_id)
);

-- 5.13: stock_movements table (immutable)
CREATE TABLE stock_movements (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id        UUID NOT NULL REFERENCES inventories(id),
    movement_type       VARCHAR(30) NOT NULL,
    quantity            INTEGER NOT NULL,
    reference_type      VARCHAR(30),
    reference_id        UUID,
    quantity_before     INTEGER NOT NULL,
    quantity_after      INTEGER NOT NULL,
    notes               VARCHAR(500),
    created_by          UUID REFERENCES users(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PHASE 9: SERVICE DOMAIN
-- ============================================================

-- 6.1: service_categories table (self-referencing parent_id)
CREATE TABLE service_categories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id       UUID REFERENCES service_categories(id),
    name            VARCHAR(150) NOT NULL,
    slug            VARCHAR(180) NOT NULL UNIQUE,
    is_veterinary   BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE
);

-- 6.2: services table
CREATE TABLE services (
    id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id                     UUID NOT NULL REFERENCES merchants(id),
    category_id                     UUID NOT NULL REFERENCES service_categories(id),
    name                            VARCHAR(255) NOT NULL,
    description                     TEXT,
    duration_minutes                INTEGER NOT NULL,
    confirmation_mode               VARCHAR(30) NOT NULL,
    requires_pet                    BOOLEAN NOT NULL DEFAULT FALSE,
    requires_verified_veterinarian  BOOLEAN NOT NULL DEFAULT FALSE,
    status                          VARCHAR(30) NOT NULL,
    rating_average                  NUMERIC(3,2) DEFAULT 0,
    rating_count                    INTEGER NOT NULL DEFAULT 0,
    created_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                      TIMESTAMPTZ,
    deleted_at                      TIMESTAMPTZ
);

-- 6.3: service_branches table (composite PK)
CREATE TABLE service_branches (
    service_id      UUID NOT NULL REFERENCES services(id),
    branch_id       UUID NOT NULL REFERENCES merchant_branches(id),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (service_id, branch_id)
);

-- 6.4: service_pet_types table (composite PK)
CREATE TABLE service_pet_types (
    service_id      UUID NOT NULL REFERENCES services(id),
    pet_type_id     UUID NOT NULL REFERENCES pet_types(id),
    PRIMARY KEY (service_id, pet_type_id)
);

-- 6.5: service_prices table
CREATE TABLE service_prices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id      UUID NOT NULL REFERENCES services(id),
    pet_type_id     UUID REFERENCES pet_types(id),
    breed_id        UUID REFERENCES pet_breeds(id),
    min_weight_kg   NUMERIC(7,2),
    max_weight_kg   NUMERIC(7,2),
    label           VARCHAR(150),
    price           NUMERIC(19,2) NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE
);

-- 6.6: service_staff table (composite PK)
CREATE TABLE service_staff (
    service_id      UUID NOT NULL REFERENCES services(id),
    staff_id        UUID NOT NULL REFERENCES merchant_staff(id),
    branch_id       UUID NOT NULL REFERENCES merchant_branches(id),
    PRIMARY KEY (service_id, staff_id, branch_id)
);

-- 6.7: staff_schedules table
CREATE TABLE staff_schedules (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id        UUID NOT NULL REFERENCES merchant_staff(id),
    branch_id       UUID NOT NULL REFERENCES merchant_branches(id),
    day_of_week     SMALLINT NOT NULL,
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    capacity        INTEGER NOT NULL DEFAULT 1,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE
);

-- 6.8: staff_schedule_exceptions table
CREATE TABLE staff_schedule_exceptions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id        UUID NOT NULL REFERENCES merchant_staff(id),
    branch_id       UUID NOT NULL REFERENCES merchant_branches(id),
    exception_date  DATE NOT NULL,
    is_available    BOOLEAN NOT NULL DEFAULT FALSE,
    start_time      TIME,
    end_time        TIME,
    reason          VARCHAR(255)
);

-- 6.9: service_slot_holds table
CREATE TABLE service_slot_holds (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id      UUID NOT NULL REFERENCES services(id),
    branch_id       UUID NOT NULL REFERENCES merchant_branches(id),
    staff_id        UUID REFERENCES merchant_staff(id),
    user_id         UUID NOT NULL REFERENCES users(id),
    pet_id          UUID NOT NULL REFERENCES pets(id),
    start_at        TIMESTAMPTZ NOT NULL,
    end_at          TIMESTAMPTZ NOT NULL,
    expires_at      TIMESTAMPTZ NOT NULL,
    status          VARCHAR(20) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PHASE 10: CART
-- ============================================================

-- 7.1: carts table
CREATE TABLE carts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    status          VARCHAR(20) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ
);

-- Partial unique index: enforce one ACTIVE cart per user
CREATE UNIQUE INDEX uq_carts_user_active ON carts (user_id) WHERE status = 'ACTIVE';

-- 7.2: cart_product_items table
CREATE TABLE cart_product_items (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id             UUID NOT NULL REFERENCES carts(id),
    branch_id           UUID NOT NULL REFERENCES merchant_branches(id),
    product_variant_id  UUID NOT NULL REFERENCES product_variants(id),
    quantity            INTEGER NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ,
    CONSTRAINT uq_cart_product_items UNIQUE (cart_id, branch_id, product_variant_id),
    CONSTRAINT chk_cart_product_items_qty CHECK (quantity > 0)
);

-- 7.3: cart_service_items table
CREATE TABLE cart_service_items (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id             UUID NOT NULL REFERENCES carts(id),
    service_id          UUID NOT NULL REFERENCES services(id),
    service_price_id    UUID NOT NULL REFERENCES service_prices(id),
    branch_id           UUID NOT NULL REFERENCES merchant_branches(id),
    pet_id              UUID NOT NULL REFERENCES pets(id),
    staff_id            UUID REFERENCES merchant_staff(id),
    slot_hold_id        UUID NOT NULL REFERENCES service_slot_holds(id),
    scheduled_start_at  TIMESTAMPTZ NOT NULL,
    scheduled_end_at    TIMESTAMPTZ NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PHASE 11: VOUCHERS
-- ============================================================

-- 7.4: vouchers table
CREATE TABLE vouchers (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id             UUID REFERENCES merchants(id),
    code                    VARCHAR(50) NOT NULL UNIQUE,
    name                    VARCHAR(150) NOT NULL,
    description             TEXT,
    discount_type           VARCHAR(30) NOT NULL,
    discount_value          NUMERIC(19,2) NOT NULL,
    max_discount            NUMERIC(19,2),
    minimum_purchase        NUMERIC(19,2),
    usage_limit             INTEGER,
    usage_limit_per_user    INTEGER,
    valid_from              TIMESTAMPTZ,
    valid_until             TIMESTAMPTZ,
    status                  VARCHAR(20) NOT NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7.5: voucher_product_categories table (composite PK)
CREATE TABLE voucher_product_categories (
    voucher_id              UUID NOT NULL REFERENCES vouchers(id),
    product_category_id     UUID NOT NULL REFERENCES product_categories(id),
    PRIMARY KEY (voucher_id, product_category_id)
);

-- 7.5: voucher_products table (composite PK)
CREATE TABLE voucher_products (
    voucher_id      UUID NOT NULL REFERENCES vouchers(id),
    product_id      UUID NOT NULL REFERENCES products(id),
    PRIMARY KEY (voucher_id, product_id)
);

-- 7.5: voucher_services table (composite PK)
CREATE TABLE voucher_services (
    voucher_id      UUID NOT NULL REFERENCES vouchers(id),
    service_id      UUID NOT NULL REFERENCES services(id),
    PRIMARY KEY (voucher_id, service_id)
);

-- ============================================================
-- PHASE 12: CHECKOUT
-- ============================================================

-- 7.6: checkouts table
CREATE TABLE checkouts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checkout_number     VARCHAR(50) NOT NULL UNIQUE,
    user_id             UUID NOT NULL REFERENCES users(id),
    cart_id             UUID REFERENCES carts(id),
    status              VARCHAR(30) NOT NULL,
    product_subtotal    NUMERIC(19,2) NOT NULL DEFAULT 0,
    service_subtotal    NUMERIC(19,2) NOT NULL DEFAULT 0,
    shipping_total      NUMERIC(19,2) NOT NULL DEFAULT 0,
    platform_fee        NUMERIC(19,2) NOT NULL DEFAULT 0,
    discount_total      NUMERIC(19,2) NOT NULL DEFAULT 0,
    grand_total         NUMERIC(19,2) NOT NULL DEFAULT 0,
    expires_at          TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ
);

-- 7.7: checkout_vouchers table (composite PK)
CREATE TABLE checkout_vouchers (
    checkout_id         UUID NOT NULL REFERENCES checkouts(id),
    voucher_id          UUID NOT NULL REFERENCES vouchers(id),
    discount_amount     NUMERIC(19,2) NOT NULL,
    PRIMARY KEY (checkout_id, voucher_id)
);

-- ============================================================
-- PHASE 13: ORDERS & SHIPPING
-- ============================================================

-- 8.1: orders table
CREATE TABLE orders (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number            VARCHAR(50) NOT NULL UNIQUE,
    checkout_id             UUID NOT NULL REFERENCES checkouts(id),
    user_id                 UUID NOT NULL REFERENCES users(id),
    merchant_id             UUID NOT NULL REFERENCES merchants(id),
    branch_id               UUID NOT NULL REFERENCES merchant_branches(id),
    status                  VARCHAR(30) NOT NULL,
    subtotal                NUMERIC(19,2) NOT NULL DEFAULT 0,
    shipping_cost           NUMERIC(19,2) NOT NULL DEFAULT 0,
    discount_amount         NUMERIC(19,2) NOT NULL DEFAULT 0,
    platform_fee            NUMERIC(19,2) NOT NULL DEFAULT 0,
    total                   NUMERIC(19,2) NOT NULL DEFAULT 0,
    recipient_name          VARCHAR(150),
    recipient_phone         VARCHAR(30),
    shipping_province       VARCHAR(100),
    shipping_city           VARCHAR(100),
    shipping_district       VARCHAR(100),
    shipping_postal_code    VARCHAR(10),
    shipping_address_line   TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    paid_at                 TIMESTAMPTZ,
    completed_at            TIMESTAMPTZ,
    cancelled_at            TIMESTAMPTZ
);

-- 8.2: order_items table
CREATE TABLE order_items (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id            UUID NOT NULL REFERENCES orders(id),
    product_id          UUID NOT NULL REFERENCES products(id),
    product_variant_id  UUID NOT NULL REFERENCES product_variants(id),
    product_name        VARCHAR(255) NOT NULL,
    variant_name        VARCHAR(255),
    sku                 VARCHAR(100),
    unit_price          NUMERIC(19,2) NOT NULL,
    quantity            INTEGER NOT NULL,
    subtotal            NUMERIC(19,2) NOT NULL,
    discount_amount     NUMERIC(19,2) NOT NULL DEFAULT 0,
    final_amount        NUMERIC(19,2) NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8.3: order_status_histories table (immutable)
CREATE TABLE order_status_histories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID NOT NULL REFERENCES orders(id),
    from_status     VARCHAR(30),
    to_status       VARCHAR(30) NOT NULL,
    notes           TEXT,
    changed_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8.4: shipping_providers table
CREATE TABLE shipping_providers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code            VARCHAR(50) NOT NULL UNIQUE,
    name            VARCHAR(150) NOT NULL,
    provider_type   VARCHAR(30) NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8.5: shipments table
CREATE TABLE shipments (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id                UUID NOT NULL UNIQUE REFERENCES orders(id),
    shipping_provider_id    UUID NOT NULL REFERENCES shipping_providers(id),
    courier_code            VARCHAR(50),
    courier_name            VARCHAR(150),
    service_code            VARCHAR(50),
    service_name            VARCHAR(150),
    external_shipment_id    VARCHAR(255),
    tracking_number         VARCHAR(150),
    shipping_cost           NUMERIC(19,2) NOT NULL DEFAULT 0,
    status                  VARCHAR(30) NOT NULL,
    estimated_delivery_at   TIMESTAMPTZ,
    shipped_at              TIMESTAMPTZ,
    delivered_at            TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ
);

-- 8.6: shipment_status_histories table
CREATE TABLE shipment_status_histories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id     UUID NOT NULL REFERENCES shipments(id),
    status          VARCHAR(50) NOT NULL,
    description     TEXT,
    location        VARCHAR(255),
    event_at        TIMESTAMPTZ,
    raw_payload     JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PHASE 14: BOOKINGS
-- ============================================================

-- 8.7: bookings table
CREATE TABLE bookings (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_number              VARCHAR(50) NOT NULL UNIQUE,
    checkout_id                 UUID NOT NULL REFERENCES checkouts(id),
    user_id                     UUID NOT NULL REFERENCES users(id),
    merchant_id                 UUID NOT NULL REFERENCES merchants(id),
    branch_id                   UUID NOT NULL REFERENCES merchant_branches(id),
    service_id                  UUID NOT NULL REFERENCES services(id),
    service_price_id            UUID REFERENCES service_prices(id),
    pet_id                      UUID NOT NULL REFERENCES pets(id),
    staff_id                    UUID REFERENCES merchant_staff(id),
    service_name_snapshot       VARCHAR(255),
    service_duration_snapshot   INTEGER,
    price_label_snapshot        VARCHAR(150),
    price_amount_snapshot       NUMERIC(19,2),
    subtotal                    NUMERIC(19,2) NOT NULL DEFAULT 0,
    discount_amount             NUMERIC(19,2) NOT NULL DEFAULT 0,
    platform_fee                NUMERIC(19,2) NOT NULL DEFAULT 0,
    total                       NUMERIC(19,2) NOT NULL DEFAULT 0,
    confirmation_mode_snapshot  VARCHAR(30),
    status                      VARCHAR(30) NOT NULL,
    scheduled_start_at          TIMESTAMPTZ,
    scheduled_end_at            TIMESTAMPTZ,
    notes                       TEXT,
    confirmed_at                TIMESTAMPTZ,
    completed_at                TIMESTAMPTZ,
    cancelled_at                TIMESTAMPTZ,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8.8: booking_status_histories table (immutable)
CREATE TABLE booking_status_histories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id      UUID NOT NULL REFERENCES bookings(id),
    from_status     VARCHAR(30),
    to_status       VARCHAR(30) NOT NULL,
    notes           TEXT,
    changed_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8.9: booking_cancellations table
CREATE TABLE booking_cancellations (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id          UUID NOT NULL UNIQUE REFERENCES bookings(id),
    cancelled_by        UUID NOT NULL REFERENCES users(id),
    reason_code         VARCHAR(50),
    reason              TEXT,
    refundable_amount   NUMERIC(19,2),
    cancellation_fee    NUMERIC(19,2),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8.10: booking_cancellation_policies table
CREATE TABLE booking_cancellation_policies (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id          UUID REFERENCES services(id),
    min_hours_before    INTEGER NOT NULL,
    max_hours_before    INTEGER,
    refund_percentage   NUMERIC(5,2) NOT NULL,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_refund_percentage CHECK (refund_percentage >= 0 AND refund_percentage <= 100)
);

-- ============================================================
-- PHASE 15: PAYMENT & REFUND
-- ============================================================

-- 9.1: payment_methods table
CREATE TABLE payment_methods (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_code   VARCHAR(50) NOT NULL,
    method_code     VARCHAR(50) NOT NULL,
    name            VARCHAR(150) NOT NULL,
    type            VARCHAR(30) NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order      INTEGER,
    CONSTRAINT uq_payment_methods_provider_method UNIQUE (provider_code, method_code)
);

-- 9.2: payments table
CREATE TABLE payments (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_number          VARCHAR(50) NOT NULL UNIQUE,
    checkout_id             UUID NOT NULL REFERENCES checkouts(id),
    user_id                 UUID NOT NULL REFERENCES users(id),
    payment_method_id       UUID NOT NULL REFERENCES payment_methods(id),
    provider                VARCHAR(50),
    external_transaction_id VARCHAR(255),
    amount                  NUMERIC(19,2) NOT NULL,
    status                  VARCHAR(30) NOT NULL,
    payment_url             TEXT,
    expires_at              TIMESTAMPTZ,
    paid_at                 TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ
);

-- 9.3: payment_status_histories table (immutable)
CREATE TABLE payment_status_histories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id      UUID NOT NULL REFERENCES payments(id),
    from_status     VARCHAR(30),
    to_status       VARCHAR(30) NOT NULL,
    external_status VARCHAR(100),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9.4: refunds table
CREATE TABLE refunds (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    refund_number       VARCHAR(50) NOT NULL UNIQUE,
    payment_id          UUID NOT NULL REFERENCES payments(id),
    order_id            UUID REFERENCES orders(id),
    booking_id          UUID REFERENCES bookings(id),
    amount              NUMERIC(19,2) NOT NULL,
    reason              TEXT,
    status              VARCHAR(30) NOT NULL,
    requested_by        UUID NOT NULL REFERENCES users(id),
    approved_by         UUID REFERENCES users(id),
    provider_refund_id  VARCHAR(255),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at        TIMESTAMPTZ
);

-- ============================================================
-- PHASE 16: FINANCE
-- ============================================================

-- 9.5: commission_rules table
CREATE TABLE commission_rules (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id         UUID REFERENCES merchants(id),
    transaction_type    VARCHAR(20) NOT NULL,
    category_id         UUID,
    commission_type     VARCHAR(20) NOT NULL,
    commission_value    NUMERIC(19,4) NOT NULL,
    priority            INTEGER,
    valid_from          TIMESTAMPTZ,
    valid_until         TIMESTAMPTZ,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE
);

-- 9.6: merchant_wallets table (merchant_id as PK)
CREATE TABLE merchant_wallets (
    merchant_id         UUID PRIMARY KEY REFERENCES merchants(id),
    pending_balance     NUMERIC(19,2) NOT NULL DEFAULT 0,
    available_balance   NUMERIC(19,2) NOT NULL DEFAULT 0,
    updated_at          TIMESTAMPTZ
);

-- 9.7: merchant_ledger_entries table (immutable)
CREATE TABLE merchant_ledger_entries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(id),
    order_id        UUID REFERENCES orders(id),
    booking_id      UUID REFERENCES bookings(id),
    refund_id       UUID REFERENCES refunds(id),
    entry_type      VARCHAR(30) NOT NULL,
    balance_type    VARCHAR(20) NOT NULL,
    amount          NUMERIC(19,2) NOT NULL,
    description     VARCHAR(500),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9.8: merchant_bank_accounts table
CREATE TABLE merchant_bank_accounts (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id                 UUID NOT NULL REFERENCES merchants(id),
    bank_code                   VARCHAR(50) NOT NULL,
    bank_name                   VARCHAR(150) NOT NULL,
    account_number_encrypted    TEXT NOT NULL,
    account_number_last4        VARCHAR(4) NOT NULL,
    account_holder_name         VARCHAR(200) NOT NULL,
    is_primary                  BOOLEAN NOT NULL DEFAULT FALSE,
    verification_status         VARCHAR(30) NOT NULL,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ
);

-- 9.9: withdrawals table
CREATE TABLE withdrawals (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    withdrawal_number   VARCHAR(50) NOT NULL UNIQUE,
    merchant_id         UUID NOT NULL REFERENCES merchants(id),
    bank_account_id     UUID NOT NULL REFERENCES merchant_bank_accounts(id),
    amount              NUMERIC(19,2) NOT NULL,
    admin_fee           NUMERIC(19,2) NOT NULL DEFAULT 0,
    status              VARCHAR(30) NOT NULL,
    requested_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at        TIMESTAMPTZ,
    processed_by        UUID REFERENCES users(id),
    external_reference  VARCHAR(255),
    rejection_reason    TEXT
);

-- 9.10: settlements table
CREATE TABLE settlements (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    settlement_number   VARCHAR(50) NOT NULL UNIQUE,
    merchant_id         UUID NOT NULL REFERENCES merchants(id),
    gross_amount        NUMERIC(19,2) NOT NULL DEFAULT 0,
    commission_amount   NUMERIC(19,2) NOT NULL DEFAULT 0,
    refund_amount       NUMERIC(19,2) NOT NULL DEFAULT 0,
    net_amount          NUMERIC(19,2) NOT NULL DEFAULT 0,
    status              VARCHAR(30) NOT NULL,
    available_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9.11: settlement_items table
CREATE TABLE settlement_items (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    settlement_id       UUID NOT NULL REFERENCES settlements(id),
    order_id            UUID REFERENCES orders(id),
    booking_id          UUID REFERENCES bookings(id),
    gross_amount        NUMERIC(19,2) NOT NULL DEFAULT 0,
    commission_amount   NUMERIC(19,2) NOT NULL DEFAULT 0,
    net_amount          NUMERIC(19,2) NOT NULL DEFAULT 0
);

-- ============================================================
-- PHASE 17: REVIEWS & WISHLISTS
-- ============================================================

-- 9.12: reviews table
CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    order_item_id   UUID REFERENCES order_items(id),
    booking_id      UUID REFERENCES bookings(id),
    merchant_id     UUID NOT NULL REFERENCES merchants(id),
    product_id      UUID REFERENCES products(id),
    service_id      UUID REFERENCES services(id),
    review_type     VARCHAR(20) NOT NULL,
    rating          SMALLINT NOT NULL,
    title           VARCHAR(200),
    content         TEXT,
    status          VARCHAR(20) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ,
    CONSTRAINT chk_reviews_rating CHECK (rating >= 1 AND rating <= 5)
);

-- 9.13: review_media table
CREATE TABLE review_media (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id       UUID NOT NULL REFERENCES reviews(id),
    file_id         UUID NOT NULL REFERENCES files(id),
    media_type      VARCHAR(20) NOT NULL,
    sort_order      INTEGER
);

-- 9.13: review_replies table
CREATE TABLE review_replies (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id       UUID NOT NULL REFERENCES reviews(id),
    merchant_id     UUID NOT NULL REFERENCES merchants(id),
    replied_by      UUID NOT NULL REFERENCES users(id),
    content         TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ
);

-- 9.14: product_wishlists table (composite PK)
CREATE TABLE product_wishlists (
    user_id         UUID NOT NULL REFERENCES users(id),
    product_id      UUID NOT NULL REFERENCES products(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, product_id)
);

-- 9.14: service_wishlists table (composite PK)
CREATE TABLE service_wishlists (
    user_id         UUID NOT NULL REFERENCES users(id),
    service_id      UUID NOT NULL REFERENCES services(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, service_id)
);

-- 9.14: favorite_merchants table (composite PK)
CREATE TABLE favorite_merchants (
    user_id         UUID NOT NULL REFERENCES users(id),
    merchant_id     UUID NOT NULL REFERENCES merchants(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, merchant_id)
);

-- ============================================================
-- PHASE 18: CHAT
-- ============================================================

-- 10.1: conversations table
CREATE TABLE conversations (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id         UUID REFERENCES merchants(id),
    conversation_type   VARCHAR(20) NOT NULL,
    order_id            UUID REFERENCES orders(id),
    booking_id          UUID REFERENCES bookings(id),
    last_message_at     TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10.2: conversation_members table (composite PK)
CREATE TABLE conversation_members (
    conversation_id     UUID NOT NULL REFERENCES conversations(id),
    user_id             UUID NOT NULL REFERENCES users(id),
    joined_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_read_at        TIMESTAMPTZ,
    PRIMARY KEY (conversation_id, user_id)
);

-- 10.3: messages table (soft delete)
CREATE TABLE messages (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id     UUID NOT NULL REFERENCES conversations(id),
    sender_user_id      UUID NOT NULL REFERENCES users(id),
    message_type        VARCHAR(20) NOT NULL,
    content             TEXT,
    product_id          UUID REFERENCES products(id),
    order_id            UUID REFERENCES orders(id),
    booking_id          UUID REFERENCES bookings(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    edited_at           TIMESTAMPTZ,
    deleted_at          TIMESTAMPTZ
);

-- 10.4: message_attachments table
CREATE TABLE message_attachments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id          UUID NOT NULL REFERENCES messages(id),
    file_id             UUID NOT NULL REFERENCES files(id)
);

-- ============================================================
-- PHASE 19: NOTIFICATIONS
-- ============================================================

-- 10.5: notifications table
CREATE TABLE notifications (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id),
    type                VARCHAR(50) NOT NULL,
    title               VARCHAR(255) NOT NULL,
    body                TEXT,
    reference_type      VARCHAR(50),
    reference_id        UUID,
    read_at             TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10.6: notification_preferences table (composite PK)
CREATE TABLE notification_preferences (
    user_id             UUID NOT NULL REFERENCES users(id),
    notification_type   VARCHAR(50) NOT NULL,
    in_app_enabled      BOOLEAN NOT NULL DEFAULT TRUE,
    push_enabled        BOOLEAN NOT NULL DEFAULT TRUE,
    email_enabled       BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (user_id, notification_type)
);

-- 10.7: notification_deliveries table
CREATE TABLE notification_deliveries (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id     UUID NOT NULL REFERENCES notifications(id),
    channel             VARCHAR(20) NOT NULL,
    provider            VARCHAR(50),
    status              VARCHAR(30) NOT NULL,
    external_id         VARCHAR(255),
    error_message       TEXT,
    sent_at             TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PHASE 20: PROMOTIONS & CMS
-- ============================================================

-- 10.8: campaigns table
CREATE TABLE campaigns (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(200) NOT NULL,
    description         TEXT,
    start_at            TIMESTAMPTZ,
    end_at              TIMESTAMPTZ,
    status              VARCHAR(20) NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10.9: product_promotions table
CREATE TABLE product_promotions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id         UUID REFERENCES campaigns(id),
    product_variant_id  UUID NOT NULL REFERENCES product_variants(id),
    merchant_id         UUID NOT NULL REFERENCES merchants(id),
    discount_type       VARCHAR(30) NOT NULL,
    discount_value      NUMERIC(19,2) NOT NULL,
    start_at            TIMESTAMPTZ NOT NULL,
    end_at              TIMESTAMPTZ NOT NULL,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE
);

-- 10.9: service_promotions table
CREATE TABLE service_promotions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id         UUID REFERENCES campaigns(id),
    service_id          UUID NOT NULL REFERENCES services(id),
    merchant_id         UUID NOT NULL REFERENCES merchants(id),
    discount_type       VARCHAR(30) NOT NULL,
    discount_value      NUMERIC(19,2) NOT NULL,
    start_at            TIMESTAMPTZ NOT NULL,
    end_at              TIMESTAMPTZ NOT NULL,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE
);

-- 10.10: banners table
CREATE TABLE banners (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               VARCHAR(200) NOT NULL,
    file_id             UUID NOT NULL REFERENCES files(id),
    target_type         VARCHAR(30),
    target_value        TEXT,
    placement           VARCHAR(50),
    start_at            TIMESTAMPTZ,
    end_at              TIMESTAMPTZ,
    sort_order          INTEGER,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE
);

-- 10.11: voucher_usages table
CREATE TABLE voucher_usages (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voucher_id          UUID NOT NULL REFERENCES vouchers(id),
    user_id             UUID NOT NULL REFERENCES users(id),
    checkout_id         UUID NOT NULL REFERENCES checkouts(id),
    discount_amount     NUMERIC(19,2) NOT NULL,
    used_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PHASE 21: DISPUTES
-- ============================================================

-- 10.12: disputes table
CREATE TABLE disputes (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispute_number      VARCHAR(50) NOT NULL UNIQUE,
    user_id             UUID NOT NULL REFERENCES users(id),
    merchant_id         UUID REFERENCES merchants(id),
    order_id            UUID REFERENCES orders(id),
    booking_id          UUID REFERENCES bookings(id),
    type                VARCHAR(50) NOT NULL,
    reason              TEXT,
    status              VARCHAR(30) NOT NULL,
    resolution          TEXT,
    assigned_admin_id   UUID REFERENCES users(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at         TIMESTAMPTZ
);

-- 10.13: dispute_messages table
CREATE TABLE dispute_messages (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispute_id          UUID NOT NULL REFERENCES disputes(id),
    sender_user_id      UUID NOT NULL REFERENCES users(id),
    message             TEXT NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10.13: dispute_attachments table
CREATE TABLE dispute_attachments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispute_id          UUID NOT NULL REFERENCES disputes(id),
    file_id             UUID NOT NULL REFERENCES files(id),
    uploaded_by         UUID NOT NULL REFERENCES users(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PHASE 22: SYSTEM & INTEGRATION
-- ============================================================

-- 10.14: audit_logs table (immutable)
CREATE TABLE audit_logs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id       UUID REFERENCES users(id),
    action              VARCHAR(100) NOT NULL,
    entity_type         VARCHAR(100) NOT NULL,
    entity_id           UUID,
    old_value           JSONB,
    new_value           JSONB,
    ip_address          INET,
    user_agent          TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10.15: system_configurations table
CREATE TABLE system_configurations (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key          VARCHAR(150) NOT NULL UNIQUE,
    config_value        JSONB,
    description         TEXT,
    is_public           BOOLEAN NOT NULL DEFAULT FALSE,
    updated_by          UUID REFERENCES users(id),
    updated_at          TIMESTAMPTZ
);

-- 10.16: integration_webhook_events table
CREATE TABLE integration_webhook_events (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider            VARCHAR(50) NOT NULL,
    event_type          VARCHAR(100) NOT NULL,
    external_event_id   VARCHAR(255),
    payload             JSONB,
    signature_valid     BOOLEAN,
    processing_status   VARCHAR(30) NOT NULL,
    processing_error    TEXT,
    received_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at        TIMESTAMPTZ
);

-- Partial unique index for webhook deduplication
CREATE UNIQUE INDEX uq_webhook_provider_event ON integration_webhook_events (provider, external_event_id) WHERE external_event_id IS NOT NULL;

-- 10.17: shipping_rate_quotes table
CREATE TABLE shipping_rate_quotes (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checkout_id         UUID NOT NULL REFERENCES checkouts(id),
    branch_id           UUID NOT NULL REFERENCES merchant_branches(id),
    provider            VARCHAR(50) NOT NULL,
    courier_code        VARCHAR(50),
    service_code        VARCHAR(50),
    service_name        VARCHAR(100),
    cost                NUMERIC(19,2) NOT NULL,
    estimated_days_min  INTEGER,
    estimated_days_max  INTEGER,
    external_quote_id   VARCHAR(255),
    expires_at          TIMESTAMPTZ,
    selected            BOOLEAN NOT NULL DEFAULT FALSE,
    raw_payload         JSONB,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PHASE 23: PET VACCINATIONS
-- ============================================================

-- 10.18: pet_vaccinations table
CREATE TABLE pet_vaccinations (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id                  UUID NOT NULL REFERENCES pets(id),
    vaccine_type_id         UUID REFERENCES vaccine_types(id),
    booking_id              UUID REFERENCES bookings(id),
    merchant_id             UUID REFERENCES merchants(id),
    branch_id               UUID REFERENCES merchant_branches(id),
    veterinarian_staff_id   UUID REFERENCES merchant_staff(id),
    vaccine_name_snapshot   VARCHAR(150) NOT NULL,
    vaccination_date        DATE NOT NULL,
    next_vaccination_date   DATE,
    batch_number            VARCHAR(100),
    certificate_file_id     UUID REFERENCES files(id),
    notes                   TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by              UUID NOT NULL REFERENCES users(id)
);

-- ============================================================
-- PHASE 24: DEFERRED FK CONSTRAINTS
-- ============================================================

-- 10.19: Circular FK resolution
ALTER TABLE users ADD CONSTRAINT fk_users_profile_image FOREIGN KEY (profile_image_file_id) REFERENCES files(id);
ALTER TABLE files ADD CONSTRAINT fk_files_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES users(id);

-- ============================================================
-- PHASE 25: INDEXES
-- ============================================================

-- 10.20: Create all indexes

-- Users & Identity
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_phone_number ON users (phone_number);
CREATE INDEX idx_users_status ON users (status);
CREATE INDEX idx_user_oauth_accounts_user_id ON user_oauth_accounts (user_id);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);
CREATE INDEX idx_otp_requests_user_id ON otp_requests (user_id);
CREATE INDEX idx_login_histories_user_id ON login_histories (user_id);
CREATE INDEX idx_user_devices_user_id ON user_devices (user_id);

-- Customer & Pets
CREATE INDEX idx_addresses_user_id ON addresses (user_id);
CREATE INDEX idx_pets_owner_user_id ON pets (owner_user_id);

-- Merchants
CREATE INDEX idx_merchants_owner_user_id ON merchants (owner_user_id);
CREATE INDEX idx_merchants_verification_status ON merchants (verification_status);
CREATE INDEX idx_merchant_documents_merchant_id ON merchant_documents (merchant_id);
CREATE INDEX idx_merchant_branches_merchant_id ON merchant_branches (merchant_id);
CREATE INDEX idx_merchant_staff_user_id ON merchant_staff (user_id);
CREATE INDEX idx_merchant_staff_merchant_id ON merchant_staff (merchant_id);

-- Products
CREATE INDEX idx_products_merchant_id ON products (merchant_id);
CREATE INDEX idx_products_category_id ON products (category_id);
CREATE INDEX idx_products_status ON products (status);
CREATE INDEX idx_products_slug ON products (slug);
CREATE INDEX idx_product_categories_slug ON product_categories (slug);
CREATE INDEX idx_product_variants_product_id ON product_variants (product_id);

-- Inventory
CREATE INDEX idx_inventories_variant_id ON inventories (variant_id);

-- Services
CREATE INDEX idx_services_merchant_id ON services (merchant_id);
CREATE INDEX idx_services_category_id ON services (category_id);
CREATE INDEX idx_services_status ON services (status);
CREATE INDEX idx_service_categories_slug ON service_categories (slug);

-- Cart
CREATE INDEX idx_carts_user_id ON carts (user_id);

-- Checkouts
CREATE INDEX idx_checkouts_user_id ON checkouts (user_id);
CREATE INDEX idx_checkouts_status ON checkouts (status);

-- Orders
CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_orders_merchant_id ON orders (merchant_id);
CREATE INDEX idx_orders_checkout_id ON orders (checkout_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_user_id_status ON orders (user_id, status);
CREATE INDEX idx_order_items_order_id ON order_items (order_id);

-- Shipments
CREATE INDEX idx_shipments_status ON shipments (status);

-- Bookings
CREATE INDEX idx_bookings_user_id ON bookings (user_id);
CREATE INDEX idx_bookings_merchant_id ON bookings (merchant_id);
CREATE INDEX idx_bookings_checkout_id ON bookings (checkout_id);
CREATE INDEX idx_bookings_status ON bookings (status);
CREATE INDEX idx_bookings_user_id_status ON bookings (user_id, status);

-- Payments
CREATE INDEX idx_payments_checkout_id ON payments (checkout_id);
CREATE INDEX idx_payments_user_id ON payments (user_id);
CREATE INDEX idx_payments_status ON payments (status);
CREATE INDEX idx_payments_checkout_id_status ON payments (checkout_id, status);
CREATE INDEX idx_refunds_payment_id ON refunds (payment_id);

-- Finance
CREATE INDEX idx_merchant_ledger_entries_merchant_id ON merchant_ledger_entries (merchant_id);
CREATE INDEX idx_withdrawals_merchant_id ON withdrawals (merchant_id);
CREATE INDEX idx_settlements_merchant_id ON settlements (merchant_id);

-- Reviews
CREATE INDEX idx_reviews_merchant_id ON reviews (merchant_id);
CREATE INDEX idx_reviews_user_id ON reviews (user_id);

-- Chat
CREATE INDEX idx_conversations_merchant_id ON conversations (merchant_id);
CREATE INDEX idx_messages_conversation_id ON messages (conversation_id);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications (user_id);

-- Promotions
CREATE INDEX idx_voucher_usages_voucher_id ON voucher_usages (voucher_id);
CREATE INDEX idx_voucher_usages_user_id ON voucher_usages (user_id);

-- Disputes
CREATE INDEX idx_disputes_user_id ON disputes (user_id);
CREATE INDEX idx_disputes_merchant_id ON disputes (merchant_id);

-- System
CREATE INDEX idx_audit_logs_entity_type_entity_id ON audit_logs (entity_type, entity_id);
CREATE INDEX idx_shipping_rate_quotes_checkout_id ON shipping_rate_quotes (checkout_id);
