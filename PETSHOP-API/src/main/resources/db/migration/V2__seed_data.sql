-- V2: Seed Reference Data
-- ============================================================
-- This migration inserts essential reference/lookup data required
-- for the application to function at startup.
-- ============================================================

-- ============================================================
-- 11.1: ROLES
-- ============================================================

INSERT INTO roles (id, code, name, description, scope, is_system) VALUES
(gen_random_uuid(), 'SUPER_ADMIN', 'Super Admin', 'Full platform access with all privileges', 'PLATFORM', true),
(gen_random_uuid(), 'ADMIN', 'Admin', 'Platform administrator with management access', 'PLATFORM', true),
(gen_random_uuid(), 'CUSTOMER', 'Customer', 'Registered customer', 'PLATFORM', true),
(gen_random_uuid(), 'PETSHOP_OWNER', 'Petshop Owner', 'Merchant shop owner with full merchant access', 'MERCHANT', true),
(gen_random_uuid(), 'PETSHOP_ADMIN', 'Petshop Admin', 'Merchant administrator', 'MERCHANT', true),
(gen_random_uuid(), 'PETSHOP_STAFF', 'Petshop Staff', 'Merchant general staff', 'MERCHANT', true),
(gen_random_uuid(), 'GROOMER', 'Groomer', 'Pet grooming specialist', 'MERCHANT', true),
(gen_random_uuid(), 'VETERINARIAN', 'Veterinarian', 'Licensed veterinarian', 'MERCHANT', true);

-- ============================================================
-- 11.2: PERMISSIONS
-- ============================================================

INSERT INTO permissions (id, code, name, module) VALUES
-- Users module
(gen_random_uuid(), 'users.view', 'View Users', 'users'),
(gen_random_uuid(), 'users.create', 'Create Users', 'users'),
(gen_random_uuid(), 'users.update', 'Update Users', 'users'),
(gen_random_uuid(), 'users.delete', 'Delete Users', 'users'),
-- Merchants module
(gen_random_uuid(), 'merchants.view', 'View Merchants', 'merchants'),
(gen_random_uuid(), 'merchants.create', 'Create Merchants', 'merchants'),
(gen_random_uuid(), 'merchants.update', 'Update Merchants', 'merchants'),
(gen_random_uuid(), 'merchants.delete', 'Delete Merchants', 'merchants'),
(gen_random_uuid(), 'merchants.verify', 'Verify Merchants', 'merchants'),
-- Products module
(gen_random_uuid(), 'products.view', 'View Products', 'products'),
(gen_random_uuid(), 'products.create', 'Create Products', 'products'),
(gen_random_uuid(), 'products.update', 'Update Products', 'products'),
(gen_random_uuid(), 'products.delete', 'Delete Products', 'products'),
-- Services module
(gen_random_uuid(), 'services.view', 'View Services', 'services'),
(gen_random_uuid(), 'services.create', 'Create Services', 'services'),
(gen_random_uuid(), 'services.update', 'Update Services', 'services'),
(gen_random_uuid(), 'services.delete', 'Delete Services', 'services'),
-- Orders module
(gen_random_uuid(), 'orders.view', 'View Orders', 'orders'),
(gen_random_uuid(), 'orders.create', 'Create Orders', 'orders'),
(gen_random_uuid(), 'orders.update', 'Update Orders', 'orders'),
(gen_random_uuid(), 'orders.cancel', 'Cancel Orders', 'orders'),
-- Bookings module
(gen_random_uuid(), 'bookings.view', 'View Bookings', 'bookings'),
(gen_random_uuid(), 'bookings.create', 'Create Bookings', 'bookings'),
(gen_random_uuid(), 'bookings.update', 'Update Bookings', 'bookings'),
(gen_random_uuid(), 'bookings.cancel', 'Cancel Bookings', 'bookings'),
(gen_random_uuid(), 'bookings.confirm', 'Confirm Bookings', 'bookings'),
-- Payments module
(gen_random_uuid(), 'payments.view', 'View Payments', 'payments'),
(gen_random_uuid(), 'payments.process', 'Process Payments', 'payments'),
(gen_random_uuid(), 'payments.refund', 'Refund Payments', 'payments'),
-- Finance module
(gen_random_uuid(), 'finance.view', 'View Finance', 'finance'),
(gen_random_uuid(), 'finance.withdraw', 'Request Withdrawals', 'finance'),
(gen_random_uuid(), 'finance.settle', 'Settle Payments', 'finance'),
-- Reviews module
(gen_random_uuid(), 'reviews.view', 'View Reviews', 'reviews'),
(gen_random_uuid(), 'reviews.create', 'Create Reviews', 'reviews'),
(gen_random_uuid(), 'reviews.reply', 'Reply to Reviews', 'reviews'),
(gen_random_uuid(), 'reviews.moderate', 'Moderate Reviews', 'reviews'),
-- Disputes module
(gen_random_uuid(), 'disputes.view', 'View Disputes', 'disputes'),
(gen_random_uuid(), 'disputes.create', 'Create Disputes', 'disputes'),
(gen_random_uuid(), 'disputes.resolve', 'Resolve Disputes', 'disputes'),
-- Admin module
(gen_random_uuid(), 'admin.dashboard', 'Access Dashboard', 'admin'),
(gen_random_uuid(), 'admin.settings', 'Manage Settings', 'admin'),
(gen_random_uuid(), 'admin.audit', 'View Audit Logs', 'admin');

-- ============================================================
-- 11.3: ROLE_PERMISSIONS
-- ============================================================

-- SUPER_ADMIN: all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'SUPER_ADMIN';

-- ADMIN: all except finance.withdraw and finance.settle
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'ADMIN'
  AND p.code NOT IN ('finance.withdraw', 'finance.settle');

-- CUSTOMER: limited access
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'CUSTOMER'
  AND p.code IN (
    'users.view', 'users.update',
    'products.view', 'services.view',
    'orders.view', 'orders.create',
    'bookings.view', 'bookings.create',
    'reviews.view', 'reviews.create',
    'disputes.view', 'disputes.create'
  );

-- PETSHOP_OWNER: merchant management access
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'PETSHOP_OWNER'
  AND p.code IN (
    'merchants.view', 'merchants.update',
    'products.view', 'products.create', 'products.update', 'products.delete',
    'services.view', 'services.create', 'services.update', 'services.delete',
    'orders.view', 'orders.update',
    'bookings.view', 'bookings.update', 'bookings.confirm',
    'finance.view', 'finance.withdraw',
    'reviews.view', 'reviews.reply'
  );

-- PETSHOP_ADMIN: same as owner minus finance.withdraw
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'PETSHOP_ADMIN'
  AND p.code IN (
    'merchants.view', 'merchants.update',
    'products.view', 'products.create', 'products.update', 'products.delete',
    'services.view', 'services.create', 'services.update', 'services.delete',
    'orders.view', 'orders.update',
    'bookings.view', 'bookings.update', 'bookings.confirm',
    'finance.view',
    'reviews.view', 'reviews.reply'
  );

-- PETSHOP_STAFF: limited operational access
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'PETSHOP_STAFF'
  AND p.code IN (
    'products.view', 'services.view',
    'orders.view', 'orders.update',
    'bookings.view', 'bookings.update'
  );

-- GROOMER: service and booking access
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'GROOMER'
  AND p.code IN (
    'services.view',
    'bookings.view', 'bookings.update'
  );

-- VETERINARIAN: service, booking, and confirm access
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'VETERINARIAN'
  AND p.code IN (
    'services.view',
    'bookings.view', 'bookings.update', 'bookings.confirm'
  );

-- ============================================================
-- 11.4: PET TYPES
-- ============================================================

INSERT INTO pet_types (id, code, name, is_active, sort_order) VALUES
(gen_random_uuid(), 'DOG', 'Dog', true, 1),
(gen_random_uuid(), 'CAT', 'Cat', true, 2),
(gen_random_uuid(), 'BIRD', 'Bird', true, 3),
(gen_random_uuid(), 'FISH', 'Fish', true, 4),
(gen_random_uuid(), 'REPTILE', 'Reptile', true, 5),
(gen_random_uuid(), 'SMALL_ANIMAL', 'Small Animal', true, 6);

-- ============================================================
-- 11.5: PET BREEDS
-- ============================================================

-- Dog breeds
INSERT INTO pet_breeds (id, pet_type_id, name, is_active) VALUES
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'DOG'), 'Golden Retriever', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'DOG'), 'Labrador Retriever', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'DOG'), 'German Shepherd', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'DOG'), 'Poodle', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'DOG'), 'Bulldog', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'DOG'), 'Beagle', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'DOG'), 'Chihuahua', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'DOG'), 'Shih Tzu', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'DOG'), 'Pomeranian', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'DOG'), 'Siberian Husky', true);

-- Cat breeds
INSERT INTO pet_breeds (id, pet_type_id, name, is_active) VALUES
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'CAT'), 'Persian', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'CAT'), 'Siamese', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'CAT'), 'Maine Coon', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'CAT'), 'British Shorthair', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'CAT'), 'Ragdoll', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'CAT'), 'Bengal', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'CAT'), 'Scottish Fold', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'CAT'), 'Abyssinian', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'CAT'), 'Sphynx', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'CAT'), 'Russian Blue', true);

-- ============================================================
-- 11.6: PRODUCT CATEGORIES
-- ============================================================

-- Parent categories
INSERT INTO product_categories (id, parent_id, name, slug, is_active, sort_order) VALUES
(gen_random_uuid(), NULL, 'Food', 'food', true, 1),
(gen_random_uuid(), NULL, 'Treats', 'treats', true, 2),
(gen_random_uuid(), NULL, 'Toys', 'toys', true, 3),
(gen_random_uuid(), NULL, 'Accessories', 'accessories', true, 4),
(gen_random_uuid(), NULL, 'Health & Hygiene', 'health-hygiene', true, 5),
(gen_random_uuid(), NULL, 'Beds & Furniture', 'beds-furniture', true, 6);

-- Child categories: Food
INSERT INTO product_categories (id, parent_id, name, slug, is_active, sort_order) VALUES
(gen_random_uuid(), (SELECT id FROM product_categories WHERE slug = 'food'), 'Dry Food', 'dry-food', true, 1),
(gen_random_uuid(), (SELECT id FROM product_categories WHERE slug = 'food'), 'Wet Food', 'wet-food', true, 2),
(gen_random_uuid(), (SELECT id FROM product_categories WHERE slug = 'food'), 'Raw Food', 'raw-food', true, 3);

-- Child categories: Treats
INSERT INTO product_categories (id, parent_id, name, slug, is_active, sort_order) VALUES
(gen_random_uuid(), (SELECT id FROM product_categories WHERE slug = 'treats'), 'Training Treats', 'training-treats', true, 1),
(gen_random_uuid(), (SELECT id FROM product_categories WHERE slug = 'treats'), 'Dental Treats', 'dental-treats', true, 2);

-- Child categories: Toys
INSERT INTO product_categories (id, parent_id, name, slug, is_active, sort_order) VALUES
(gen_random_uuid(), (SELECT id FROM product_categories WHERE slug = 'toys'), 'Chew Toys', 'chew-toys', true, 1),
(gen_random_uuid(), (SELECT id FROM product_categories WHERE slug = 'toys'), 'Interactive Toys', 'interactive-toys', true, 2),
(gen_random_uuid(), (SELECT id FROM product_categories WHERE slug = 'toys'), 'Plush Toys', 'plush-toys', true, 3);

-- Child categories: Accessories
INSERT INTO product_categories (id, parent_id, name, slug, is_active, sort_order) VALUES
(gen_random_uuid(), (SELECT id FROM product_categories WHERE slug = 'accessories'), 'Collars & Leashes', 'collars-leashes', true, 1),
(gen_random_uuid(), (SELECT id FROM product_categories WHERE slug = 'accessories'), 'Bowls & Feeders', 'bowls-feeders', true, 2),
(gen_random_uuid(), (SELECT id FROM product_categories WHERE slug = 'accessories'), 'Carriers & Crates', 'carriers-crates', true, 3);

-- Child categories: Health & Hygiene
INSERT INTO product_categories (id, parent_id, name, slug, is_active, sort_order) VALUES
(gen_random_uuid(), (SELECT id FROM product_categories WHERE slug = 'health-hygiene'), 'Shampoo & Conditioner', 'shampoo-conditioner', true, 1),
(gen_random_uuid(), (SELECT id FROM product_categories WHERE slug = 'health-hygiene'), 'Flea & Tick', 'flea-tick', true, 2),
(gen_random_uuid(), (SELECT id FROM product_categories WHERE slug = 'health-hygiene'), 'Supplements', 'supplements', true, 3);

-- Child categories: Beds & Furniture
INSERT INTO product_categories (id, parent_id, name, slug, is_active, sort_order) VALUES
(gen_random_uuid(), (SELECT id FROM product_categories WHERE slug = 'beds-furniture'), 'Beds', 'beds', true, 1),
(gen_random_uuid(), (SELECT id FROM product_categories WHERE slug = 'beds-furniture'), 'Scratching Posts', 'scratching-posts', true, 2),
(gen_random_uuid(), (SELECT id FROM product_categories WHERE slug = 'beds-furniture'), 'Cages & Habitats', 'cages-habitats', true, 3);

-- ============================================================
-- 11.7: SERVICE CATEGORIES
-- ============================================================

INSERT INTO service_categories (id, parent_id, name, slug, is_veterinary, is_active) VALUES
(gen_random_uuid(), NULL, 'Grooming', 'grooming', false, true),
(gen_random_uuid(), NULL, 'Vaccination', 'vaccination', true, true),
(gen_random_uuid(), NULL, 'Veterinary Consultation', 'veterinary-consultation', true, true),
(gen_random_uuid(), NULL, 'Dental Care', 'dental-care', true, true),
(gen_random_uuid(), NULL, 'Boarding', 'boarding', false, true);

-- ============================================================
-- 11.8: VACCINE TYPES
-- ============================================================

-- Dog vaccines
INSERT INTO vaccine_types (id, pet_type_id, code, name, is_active) VALUES
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'DOG'), 'DOG_RABIES', 'Rabies', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'DOG'), 'DOG_DISTEMPER', 'Distemper', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'DOG'), 'DOG_PARVOVIRUS', 'Parvovirus', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'DOG'), 'DOG_HEPATITIS', 'Hepatitis (Adenovirus)', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'DOG'), 'DOG_LEPTOSPIROSIS', 'Leptospirosis', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'DOG'), 'DOG_BORDETELLA', 'Bordetella', true);

-- Cat vaccines
INSERT INTO vaccine_types (id, pet_type_id, code, name, is_active) VALUES
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'CAT'), 'CAT_RABIES', 'Rabies', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'CAT'), 'CAT_PANLEUKOPENIA', 'Feline Panleukopenia (FVRCP)', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'CAT'), 'CAT_CALICIVIRUS', 'Feline Calicivirus', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'CAT'), 'CAT_HERPESVIRUS', 'Feline Herpesvirus', true),
(gen_random_uuid(), (SELECT id FROM pet_types WHERE code = 'CAT'), 'CAT_FELV', 'Feline Leukemia (FeLV)', true);

-- ============================================================
-- 11.9: SYSTEM CONFIGURATIONS
-- ============================================================

INSERT INTO system_configurations (id, config_key, config_value, description, is_public) VALUES
(gen_random_uuid(), 'checkout_expiration_minutes', '{"value": 30}'::jsonb, 'Number of minutes before an unpaid checkout expires', false),
(gen_random_uuid(), 'slot_hold_duration_minutes', '{"value": 15}'::jsonb, 'Number of minutes a service slot hold remains active', false),
(gen_random_uuid(), 'minimum_withdrawal_amount', '{"value": 50000}'::jsonb, 'Minimum withdrawal amount in IDR', false),
(gen_random_uuid(), 'default_commission_percentage', '{"value": 10}'::jsonb, 'Default platform commission percentage', false),
(gen_random_uuid(), 'review_window_days', '{"value": 14}'::jsonb, 'Number of days after completion a review can be submitted', false);

-- ============================================================
-- 11.10: SHIPPING PROVIDERS
-- ============================================================

INSERT INTO shipping_providers (id, code, name, provider_type, is_active) VALUES
(gen_random_uuid(), 'BITESHIP', 'Biteship', 'AGGREGATOR', true);

-- ============================================================
-- 11.11: PAYMENT METHODS
-- ============================================================

INSERT INTO payment_methods (id, provider_code, method_code, name, type, is_active, sort_order) VALUES
(gen_random_uuid(), 'MIDTRANS', 'QRIS', 'QRIS', 'EWALLET', true, 1),
(gen_random_uuid(), 'MIDTRANS', 'BANK_TRANSFER_BCA', 'Bank Transfer BCA', 'VIRTUAL_ACCOUNT', true, 2),
(gen_random_uuid(), 'MIDTRANS', 'BANK_TRANSFER_BNI', 'Bank Transfer BNI', 'VIRTUAL_ACCOUNT', true, 3),
(gen_random_uuid(), 'MIDTRANS', 'BANK_TRANSFER_BRI', 'Bank Transfer BRI', 'VIRTUAL_ACCOUNT', true, 4),
(gen_random_uuid(), 'MIDTRANS', 'BANK_TRANSFER_MANDIRI', 'Bank Transfer Mandiri', 'VIRTUAL_ACCOUNT', true, 5),
(gen_random_uuid(), 'MIDTRANS', 'GOPAY', 'GoPay', 'EWALLET', true, 6),
(gen_random_uuid(), 'MIDTRANS', 'SHOPEEPAY', 'ShopeePay', 'EWALLET', true, 7),
(gen_random_uuid(), 'MIDTRANS', 'DANA', 'DANA', 'EWALLET', true, 8);
