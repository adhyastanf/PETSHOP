-- ============================================================
-- V6: Fix vet_concept_external_mapping uniqueness constraint
-- ============================================================
-- Background (see schema review Finding 5):
--
-- V5 created the following table-level constraint on
-- vet_concept_external_mapping:
--
--   CONSTRAINT uq_vet_concept_external_exact
--       UNIQUE NULLS NOT DISTINCT (concept_id, system_code, external_code)
--
-- This prevents the same (concept, system, external_code) triple from
-- appearing more than once, regardless of is_current.
--
-- The problem: when a mapping is corrected (e.g. EXACT → BROADER), the
-- intended workflow is:
--   1. Set is_current = FALSE on the old row (preserving history).
--   2. INSERT a new row with the corrected mapping and is_current = TRUE.
--
-- The V5 constraint blocks step 2 because the triple is already present.
--
-- The correct rule is:
--   At most ONE active (is_current = TRUE) mapping per
--   (concept_id, system_code, external_code).
--   Historical rows (is_current = FALSE) are unlimited.
--
-- This migration:
--   1. Drops the over-constraining V5 UNIQUE constraint.
--   2. Creates a partial unique index enforcing the correct rule.
--
-- No data changes. No new tables. No existing tables removed.
-- V5 migration is NOT modified.
-- ============================================================

-- Step 1: Drop the V5 table-level constraint.
ALTER TABLE vet_concept_external_mapping
    DROP CONSTRAINT IF EXISTS uq_vet_concept_external_exact;

-- Step 2: Replace with a partial unique index.
--   Allows multiple historical rows (is_current = FALSE) for the same triple,
--   but enforces at most one active (is_current = TRUE) row per triple.
CREATE UNIQUE INDEX uq_vet_concept_ext_mapping_active
    ON vet_concept_external_mapping (concept_id, system_code, external_code)
    WHERE is_current = TRUE;

-- ============================================================
-- End of V6
-- ============================================================
