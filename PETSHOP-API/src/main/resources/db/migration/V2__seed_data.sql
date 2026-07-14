-- ============================================================
-- V2: Seed data for development
-- Same data for all developers so everyone has consistent test data
-- ============================================================

-- ============================================================
-- ACCOUNTS
-- ============================================================

-- Password for all seed users: "password123" (bcrypt hash)
-- $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- Admin
INSERT INTO users (email, phone, password_hash, full_name, role_id) VALUES
('admin@petmarket.id', '081200000001', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin Petmarket', 3);

-- Customers
INSERT INTO users (email, phone, password_hash, full_name, role_id, email_verified) VALUES
('budi@gmail.com', '081200000010', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Budi Santoso', 1, TRUE),
('sari@gmail.com', '081200000011', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Sari Dewi', 1, TRUE),
('andi@gmail.com', '081200000012', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Andi Pratama', 1, TRUE);

-- Mitra (petshop owners)
INSERT INTO users (email, phone, password_hash, full_name, role_id, email_verified) VALUES
('happypets@gmail.com', '081200000020', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Happy Pets Owner', 2, TRUE),
('pawcare@gmail.com', '081200000021', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Paw Care Owner', 2, TRUE);

-- ============================================================
-- PETSHOPS
-- ============================================================

INSERT INTO petshops (user_id, shop_name, description, address, city, province, postal_code, is_verified, verified_at) VALUES
(5, 'Happy Pets Store', 'Toko hewan peliharaan terlengkap di Jakarta Selatan', 'Jl. Kemang Raya No. 10', 'Jakarta Selatan', 'DKI Jakarta', '12730', TRUE, NOW()),
(6, 'Paw Care Center', 'Grooming dan produk premium untuk anjing dan kucing', 'Jl. Sudirman No. 55', 'Jakarta Pusat', 'DKI Jakarta', '10220', TRUE, NOW());

-- ============================================================
-- PETS (belonging to customers)
-- ============================================================

INSERT INTO pets (user_id, name, species, breed, gender, birth_date, weight_kg) VALUES
(2, 'Milo', 'Kucing', 'British Shorthair', 'Male', '2023-03-15', 4.5),
(2, 'Luna', 'Kucing', 'Persian', 'Female', '2022-08-20', 3.8),
(3, 'Buddy', 'Anjing', 'Golden Retriever', 'Male', '2021-11-01', 28.0),
(4, 'Coco', 'Anjing', 'Pomeranian', 'Female', '2024-01-10', 2.5);

-- ============================================================
-- CATEGORIES
-- ============================================================

INSERT INTO categories (name, slug, parent_id, sort_order) VALUES
('Makanan', 'makanan', NULL, 1),
('Aksesoris', 'aksesoris', NULL, 2),
('Kesehatan', 'kesehatan', NULL, 3),
('Grooming', 'grooming', NULL, 4),
('Layanan', 'layanan', NULL, 5);

-- Sub-categories
INSERT INTO categories (name, slug, parent_id, sort_order) VALUES
('Makanan Kucing', 'makanan-kucing', 1, 1),
('Makanan Anjing', 'makanan-anjing', 1, 2),
('Kalung & Tali', 'kalung-tali', 2, 1),
('Mainan', 'mainan', 2, 2),
('Vitamin', 'vitamin', 3, 1),
('Obat', 'obat', 3, 2),
('Shampoo', 'shampoo', 4, 1),
('Grooming Service', 'grooming-service', 5, 1),
('Vaksin', 'vaksin-service', 5, 2);

-- ============================================================
-- PRODUCTS
-- ============================================================

INSERT INTO products (petshop_id, category_id, name, slug, description, price, stock, weight_gram, is_active) VALUES
-- Happy Pets Store products
(1, 6, 'Royal Canin Indoor Cat 2kg', 'royal-canin-indoor-cat-2kg', 'Makanan kering untuk kucing indoor', 185000, 50, 2000, TRUE),
(1, 6, 'Whiskas Tuna 1.2kg', 'whiskas-tuna-1-2kg', 'Makanan kucing rasa tuna', 75000, 100, 1200, TRUE),
(1, 7, 'Pedigree Adult Beef 3kg', 'pedigree-adult-beef-3kg', 'Makanan anjing dewasa rasa sapi', 125000, 30, 3000, TRUE),
(1, 9, 'Mainan Bola Kucing', 'mainan-bola-kucing', 'Bola mainan interaktif untuk kucing', 25000, 200, 50, TRUE),
(1, 12, 'Bio Shampoo Kucing 250ml', 'bio-shampoo-kucing-250ml', 'Shampoo anti kutu untuk kucing', 45000, 80, 300, TRUE),

-- Paw Care Center products
(2, 7, 'Dog Chow Puppy 1.5kg', 'dog-chow-puppy-1-5kg', 'Makanan anak anjing', 95000, 40, 1500, TRUE),
(2, 8, 'Kalung Anjing Premium M', 'kalung-anjing-premium-m', 'Kalung kulit asli ukuran medium', 150000, 25, 100, TRUE),
(2, 10, 'Vitamin Bulu Kucing', 'vitamin-bulu-kucing', 'Suplemen untuk bulu kucing sehat', 65000, 60, 100, TRUE),
(2, 12, 'Shampoo Anjing Oatmeal 500ml', 'shampoo-anjing-oatmeal-500ml', 'Shampoo lembut untuk kulit sensitif', 85000, 45, 550, TRUE);

-- ============================================================
-- SERVICES
-- ============================================================

INSERT INTO services (petshop_id, category_id, name, description, price, duration_min, is_active) VALUES
(1, 13, 'Grooming Kucing Basic', 'Mandi, keringkan, potong kuku, bersihkan telinga', 75000, 60, TRUE),
(1, 13, 'Grooming Kucing Full', 'Basic + potong bulu, sikat gigi', 150000, 90, TRUE),
(2, 13, 'Grooming Anjing Small', 'Mandi, keringkan, potong kuku (anjing kecil)', 85000, 60, TRUE),
(2, 13, 'Grooming Anjing Medium', 'Mandi, keringkan, potong kuku (anjing sedang)', 120000, 90, TRUE),
(2, 14, 'Vaksin Rabies', 'Vaksinasi rabies untuk anjing dan kucing', 100000, 30, TRUE);
