-- ============================================================
-- V1: Initial schema for Pet Marketplace
-- Separated into: account tables and product tables
-- ============================================================

-- ============================================================
-- ACCOUNT TABLES
-- ============================================================

CREATE TABLE roles (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO roles (name) VALUES ('CUSTOMER'), ('MITRA'), ('ADMIN');

CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    phone           VARCHAR(20),
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(150) NOT NULL,
    avatar_url      VARCHAR(500),
    role_id         BIGINT NOT NULL REFERENCES roles(id),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);

CREATE TABLE petshops (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL UNIQUE REFERENCES users(id),
    shop_name       VARCHAR(200) NOT NULL,
    description     TEXT,
    address         TEXT,
    city            VARCHAR(100),
    province        VARCHAR(100),
    postal_code     VARCHAR(10),
    latitude        DECIMAL(10, 7),
    longitude       DECIMAL(10, 7),
    phone           VARCHAR(20),
    logo_url        VARCHAR(500),
    banner_url      VARCHAR(500),
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at     TIMESTAMP,
    rating_avg      DECIMAL(2, 1) NOT NULL DEFAULT 0.0,
    rating_count    INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_petshops_city ON petshops(city);
CREATE INDEX idx_petshops_verified ON petshops(is_verified);

CREATE TABLE pets (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id),
    name            VARCHAR(100) NOT NULL,
    species         VARCHAR(50) NOT NULL,
    breed           VARCHAR(100),
    gender          VARCHAR(10),
    birth_date      DATE,
    weight_kg       DECIMAL(5, 2),
    photo_url       VARCHAR(500),
    notes           TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pets_user ON pets(user_id);

-- ============================================================
-- PRODUCT TABLES
-- ============================================================

CREATE TABLE categories (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) NOT NULL UNIQUE,
    parent_id   BIGINT REFERENCES categories(id),
    icon_url    VARCHAR(500),
    sort_order  INT NOT NULL DEFAULT 0,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);

CREATE TABLE products (
    id              BIGSERIAL PRIMARY KEY,
    petshop_id      BIGINT NOT NULL REFERENCES petshops(id),
    category_id     BIGINT NOT NULL REFERENCES categories(id),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL,
    description     TEXT,
    price           DECIMAL(12, 2) NOT NULL,
    discount_price  DECIMAL(12, 2),
    stock           INT NOT NULL DEFAULT 0,
    weight_gram     INT,
    sku             VARCHAR(100),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    rating_avg      DECIMAL(2, 1) NOT NULL DEFAULT 0.0,
    rating_count    INT NOT NULL DEFAULT 0,
    sold_count      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_petshop ON products(petshop_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active);

CREATE TABLE product_images (
    id          BIGSERIAL PRIMARY KEY,
    product_id  BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url   VARCHAR(500) NOT NULL,
    sort_order  INT NOT NULL DEFAULT 0,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- ============================================================
-- SERVICE / BOOKING TABLES
-- ============================================================

CREATE TABLE services (
    id              BIGSERIAL PRIMARY KEY,
    petshop_id      BIGINT NOT NULL REFERENCES petshops(id),
    category_id     BIGINT NOT NULL REFERENCES categories(id),
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    price           DECIMAL(12, 2) NOT NULL,
    duration_min    INT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_petshop ON services(petshop_id);

CREATE TABLE bookings (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id),
    service_id      BIGINT NOT NULL REFERENCES services(id),
    pet_id          BIGINT REFERENCES pets(id),
    booking_date    DATE NOT NULL,
    start_time      TIME NOT NULL,
    end_time        TIME,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    notes           TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_service ON bookings(service_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);

-- ============================================================
-- ORDER TABLES
-- ============================================================

CREATE TABLE orders (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id),
    petshop_id      BIGINT NOT NULL REFERENCES petshops(id),
    order_number    VARCHAR(50) NOT NULL UNIQUE,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    subtotal        DECIMAL(12, 2) NOT NULL,
    shipping_fee    DECIMAL(12, 2) NOT NULL DEFAULT 0,
    discount        DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total           DECIMAL(12, 2) NOT NULL,
    shipping_address TEXT,
    notes           TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_petshop ON orders(petshop_id);
CREATE INDEX idx_orders_number ON orders(order_number);

CREATE TABLE order_items (
    id          BIGSERIAL PRIMARY KEY,
    order_id    BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id  BIGINT NOT NULL REFERENCES products(id),
    quantity    INT NOT NULL,
    price       DECIMAL(12, 2) NOT NULL,
    subtotal    DECIMAL(12, 2) NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================================
-- REVIEW TABLE
-- ============================================================

CREATE TABLE reviews (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id),
    product_id      BIGINT REFERENCES products(id),
    service_id      BIGINT REFERENCES services(id),
    petshop_id      BIGINT NOT NULL REFERENCES petshops(id),
    rating          INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment         TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_petshop ON reviews(petshop_id);
