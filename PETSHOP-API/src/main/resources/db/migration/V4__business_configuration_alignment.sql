-- ============================================================
-- V4: Business Configuration foundation alignment
--
-- 1. Align payment provider MIDTRANS -> XENDIT (canonical Oyen provider).
-- 2. Add COD as a merchant-collected payment method (availability config only).
-- 3. Align default_commission_percentage to canonical 4% baseline.
-- 4. Seed default GLOBAL commission rules (4% PRODUCT + 4% SERVICE).
--
-- Backward-safe: only updates/inserts data; no schema drops. V1/V2/V3 remain
-- immutable. Running this on an already-seeded dev database is idempotent for
-- the commission-rule seed via NOT EXISTS guards.
-- ============================================================

-- 1. Canonical payment provider is Xendit, not Midtrans.
UPDATE payment_methods
SET provider_code = 'XENDIT'
WHERE provider_code = 'MIDTRANS';

-- 2. COD (cash on delivery) as a merchant-collected payment method.
--    Availability is admin-configurable; processing/accrual belongs to later phases.
INSERT INTO payment_methods (id, provider_code, method_code, name, type, is_active, sort_order)
SELECT gen_random_uuid(), 'COD', 'COD', 'Cash on Delivery', 'COD', TRUE, 99
WHERE NOT EXISTS (
    SELECT 1 FROM payment_methods WHERE method_code = 'COD'
);

-- 3. Canonical baseline commission is 4% (docs: BR-PAY-007). The prior seed used 10.
--    This value is only a fallback; commission_rules are authoritative.
UPDATE system_configurations
SET config_value = '{"value": 4}'::jsonb,
    description = 'Default/fallback platform commission percentage (authoritative source is commission_rules)'
WHERE config_key = 'default_commission_percentage';

-- 4. Seed default GLOBAL commission rules: 4% PRODUCT and 4% SERVICE, open-ended.
INSERT INTO commission_rules (id, merchant_id, transaction_type, category_id, commission_type, commission_value, priority, valid_from, valid_until, is_active)
SELECT gen_random_uuid(), NULL, 'PRODUCT', NULL, 'PERCENTAGE', 4.0000, 0, NULL, NULL, TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM commission_rules
    WHERE transaction_type = 'PRODUCT' AND merchant_id IS NULL AND category_id IS NULL
);

INSERT INTO commission_rules (id, merchant_id, transaction_type, category_id, commission_type, commission_value, priority, valid_from, valid_until, is_active)
SELECT gen_random_uuid(), NULL, 'SERVICE', NULL, 'PERCENTAGE', 4.0000, 0, NULL, NULL, TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM commission_rules
    WHERE transaction_type = 'SERVICE' AND merchant_id IS NULL AND category_id IS NULL
);
