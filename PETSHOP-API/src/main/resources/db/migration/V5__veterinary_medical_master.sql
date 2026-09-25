-- ============================================================
-- V5: Veterinary Medical Master — Reference/Master Data Foundation
-- ============================================================
-- Implements Layer 1 (Terminology Master) and the Procedure Master
-- from the Oyen Veterinary Medical Master design.
--
-- SCOPE: Master/reference tables only.
--        Patient-specific medical records (encounters, diagnoses,
--        lab results, imaging, prescriptions, follow-ups) are NOT
--        created here — those belong to a future implementation phase.
--
-- COMPATIBILITY:
--   - pet_types, vaccine_types, pet_vaccinations remain UNCHANGED.
--   - vet_concept_species references pet_types.id for species applicability.
--   - No existing migration is modified.
--
-- DESIGN REFERENCES:
--   - Docs/domain/veterinary/VETERINARY_MEDICAL_MASTER.md
--   - Docs/domain/veterinary/VETERINARY_TERMINOLOGY.md
--   - Docs/domain/veterinary/VETERINARY_PROCEDURES.md
--   - Docs/domain/veterinary/VETERINARY_DATA_SOURCES.md
-- ============================================================


-- ============================================================
-- SECTION 1: PROVENANCE / SOURCE TRACKING
-- ============================================================

-- 1.1 vet_source
--     Records authoritative external sources used as reference for concept
--     authoring. Does NOT store copyrighted content — metadata/provenance only.
CREATE TABLE vet_source (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code            VARCHAR(50)  NOT NULL UNIQUE,    -- e.g. "SNOMEDCT_VET", "WSAVA", "AAHA", "MERCK"
    name            VARCHAR(200) NOT NULL,
    organization    VARCHAR(200) NOT NULL,
    source_type     VARCHAR(30)  NOT NULL,            -- TERMINOLOGY | GUIDELINE | REFERENCE
    url             VARCHAR(500),
    description     TEXT,
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT chk_vet_source_type
        CHECK (source_type IN ('TERMINOLOGY','GUIDELINE','REFERENCE'))
);

-- 1.2 vet_terminology_version
--     Named, dated snapshots of the Oyen veterinary terminology.
--     Medical records will reference the active version at recording time,
--     so historical clinical meaning is preserved even after the master evolves.
CREATE TABLE vet_terminology_version (
    id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    version_code        VARCHAR(50)  NOT NULL UNIQUE, -- e.g. "OYEN-VET-INITIAL", "OYEN-VET-2026-Q4"
    published_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    description         TEXT,
    external_source_ref VARCHAR(200),                  -- optional: e.g. "VetSCT RF2 2026-09"
    is_current          BOOLEAN      NOT NULL DEFAULT FALSE
);


-- ============================================================
-- SECTION 2: VETERINARY CONCEPT MASTER
-- ============================================================

-- 2.1 vet_concept
--     The core concept table. Each row is one stable, species-aware clinical
--     entity. The UUID is Oyen's own stable primary key — external codes
--     (SCTIDs, ICD codes) are stored in vet_concept_external_mapping only.
CREATE TABLE vet_concept (
    id                      UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical_code          VARCHAR(30)  NOT NULL UNIQUE,   -- e.g. "DIAG-ENDO-001"
    concept_type            VARCHAR(30)  NOT NULL,           -- see concept_type values below
    body_system             VARCHAR(30),                     -- nullable; see body_system values below
    status                  VARCHAR(20)  NOT NULL DEFAULT 'PENDING_REVIEW',
    version_id              UUID         NOT NULL REFERENCES vet_terminology_version(id),
    source_id               UUID         REFERENCES vet_source(id),
    source_reference        TEXT,                            -- free-text provenance note
    created_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by              UUID,                            -- FK to users.id; nullable for seeded data
    reviewed_by             UUID,                            -- FK to users.id
    deprecated_at           TIMESTAMPTZ,
    deprecated_reason       TEXT,
    replaced_by_concept_id  UUID         REFERENCES vet_concept(id), -- points to successor on deprecation

    CONSTRAINT chk_vet_concept_type CHECK (concept_type IN (
        'DISEASE','SYNDROME','CLINICAL_FINDING','SYMPTOM','SIGN',
        'INJURY','INFECTIOUS_AGENT','NEOPLASM','CONGENITAL_CONDITION',
        'HEREDITARY_CONDITION','METABOLIC_ENDOCRINE','NUTRITIONAL_CONDITION',
        'BEHAVIORAL_CONDITION','PREVENTIVE_CARE_CONCEPT','PARASITIC_CONDITION',
        'PROCEDURE','OBSERVABLE_ENTITY','MEDICATION','VACCINE','BODY_STRUCTURE'
    )),

    CONSTRAINT chk_vet_concept_status CHECK (status IN (
        'PENDING_REVIEW','ACTIVE','DEPRECATED','REJECTED'
    )),

    CONSTRAINT chk_vet_concept_body_system CHECK (body_system IS NULL OR body_system IN (
        'CARDIOVASCULAR','RESPIRATORY','GASTROINTESTINAL','HEPATIC_PANCREATIC',
        'URINARY','REPRODUCTIVE','MUSCULOSKELETAL','NERVOUS','OPHTHALMIC',
        'DERMATOLOGICAL','ENDOCRINE','IMMUNE_HEMATOLOGIC','INFECTIOUS',
        'PARASITIC','BEHAVIORAL','NUTRITIONAL_METABOLIC','TOXICOLOGICAL',
        'DENTAL_ORAL','MULTISYSTEM'
    )),

    -- A deprecated concept should point to a replacement when possible
    CONSTRAINT chk_vet_concept_no_self_replace
        CHECK (replaced_by_concept_id <> id)
);

-- Indexes: frequent query patterns
CREATE INDEX idx_vet_concept_type    ON vet_concept (concept_type);
CREATE INDEX idx_vet_concept_status  ON vet_concept (status);
CREATE INDEX idx_vet_concept_body    ON vet_concept (body_system) WHERE body_system IS NOT NULL;
CREATE INDEX idx_vet_concept_version ON vet_concept (version_id);


-- 2.2 vet_concept_name
--     One canonical display name per concept per language.
--     English (en) and Indonesian (id) are required before activation.
CREATE TABLE vet_concept_name (
    concept_id      UUID         NOT NULL REFERENCES vet_concept(id),
    language_code   VARCHAR(10)  NOT NULL,  -- ISO 639-1: "en", "id", etc.
    name            TEXT         NOT NULL,
    PRIMARY KEY (concept_id, language_code)
);

-- Uniqueness: within a concept_type × language, the same canonical name must
-- not appear on two different active concepts. Enforced at service layer;
-- partial index below assists duplicate detection.
CREATE INDEX idx_vet_concept_name_lang ON vet_concept_name (language_code, name);


-- 2.3 vet_concept_synonym
--     Zero or more alternative names per concept. Synonym types follow
--     VETERINARY_TERMINOLOGY.md §5.
CREATE TABLE vet_concept_synonym (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    concept_id      UUID         NOT NULL REFERENCES vet_concept(id),
    language_code   VARCHAR(10)  NOT NULL,
    synonym_text    TEXT         NOT NULL,
    synonym_type    VARCHAR(30)  NOT NULL,    -- VETERINARY_PROFESSIONAL | COMMON_OWNER | ABBREVIATION |
                                              -- ALTERNATE_SPELLING | TRADE_NAME | EXTERNAL_PREFERRED
    pet_type_id     UUID         REFERENCES pet_types(id),  -- nullable; species-specific synonym if set

    CONSTRAINT chk_vet_synonym_type CHECK (synonym_type IN (
        'VETERINARY_PROFESSIONAL','COMMON_OWNER','ABBREVIATION',
        'ALTERNATE_SPELLING','TRADE_NAME','EXTERNAL_PREFERRED'
    ))
);

CREATE INDEX idx_vet_concept_synonym_concept ON vet_concept_synonym (concept_id);
CREATE INDEX idx_vet_concept_synonym_lang    ON vet_concept_synonym (language_code, synonym_text);


-- 2.4 vet_concept_species
--     Many-to-many: which species (pet_types) does this concept apply to?
--     Uses the existing pet_types table — no duplicate species table created.
CREATE TABLE vet_concept_species (
    concept_id   UUID NOT NULL REFERENCES vet_concept(id),
    pet_type_id  UUID NOT NULL REFERENCES pet_types(id),
    PRIMARY KEY (concept_id, pet_type_id)
);

CREATE INDEX idx_vet_concept_species_pet_type ON vet_concept_species (pet_type_id);


-- 2.5 vet_concept_external_mapping
--     Optional mappings to external terminology codes (e.g. VetSCT SCTIDs).
--     External codes are NEVER the primary key; Oyen's UUID is primary.
--     Storing these requires licensing review (see VETERINARY_OPEN_DECISIONS.md #1).
--     Rows may be added/removed without affecting concept identity.
CREATE TABLE vet_concept_external_mapping (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    concept_id      UUID         NOT NULL REFERENCES vet_concept(id),
    system_code     VARCHAR(50)  NOT NULL,   -- e.g. "SNOMEDCT_VET", "ICD10_VET", "OYEN_LEGACY"
    system_version  VARCHAR(50),             -- e.g. "2026-09" for SNOMED release
    external_code   VARCHAR(255) NOT NULL,   -- the external identifier (e.g. SCTID)
    match_type      VARCHAR(20)  NOT NULL DEFAULT 'EXACT',
    is_current      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by      UUID,                    -- FK to users.id

    CONSTRAINT chk_vet_mapping_match_type CHECK (match_type IN (
        'EXACT','BROADER','NARROWER','RELATED'
    )),

    -- Within a system, at most one EXACT mapping per concept; prevents duplicates
    CONSTRAINT uq_vet_concept_external_exact
        UNIQUE NULLS NOT DISTINCT (concept_id, system_code, external_code)
);

CREATE INDEX idx_vet_concept_mapping_concept ON vet_concept_external_mapping (concept_id);
CREATE INDEX idx_vet_concept_mapping_system  ON vet_concept_external_mapping (system_code, external_code);


-- 2.6 vet_concept_relationship
--     Lightweight IS_A and other semantic relationships between concepts.
--     Supports search expansion, reporting roll-up, and future decision support.
--     Application enforces: no circular relationships; one primary parent max.
CREATE TABLE vet_concept_relationship (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    child_concept_id    UUID        NOT NULL REFERENCES vet_concept(id),
    parent_concept_id   UUID        NOT NULL REFERENCES vet_concept(id),
    relationship_type   VARCHAR(30) NOT NULL,   -- IS_A | HAS_COMPONENT | CAUSED_BY | ASSOCIATED_WITH
    is_primary_parent   BOOLEAN     NOT NULL DEFAULT FALSE,

    CONSTRAINT chk_vet_rel_type CHECK (relationship_type IN (
        'IS_A','HAS_COMPONENT','CAUSED_BY','ASSOCIATED_WITH'
    )),
    CONSTRAINT chk_vet_rel_no_self_ref
        CHECK (child_concept_id <> parent_concept_id)
);

-- Only one primary parent allowed per child concept.
-- A standard UNIQUE constraint on (child_concept_id, is_primary_parent) would
-- wrongly block a child having both a primary AND non-primary parent.
-- A partial unique index is the correct PostgreSQL approach.
CREATE UNIQUE INDEX idx_vet_concept_rel_one_primary
    ON vet_concept_relationship (child_concept_id)
    WHERE is_primary_parent = TRUE;

CREATE INDEX idx_vet_concept_rel_child  ON vet_concept_relationship (child_concept_id);
CREATE INDEX idx_vet_concept_rel_parent ON vet_concept_relationship (parent_concept_id);


-- ============================================================
-- SECTION 3: CLINICAL KNOWLEDGE LAYER (LAYER 2)
-- ============================================================

-- 3.1 vet_concept_knowledge
--     Informational reference notes about a concept. One row per concept.
--     All fields are free-text — NOT a diagnostic algorithm or decision tree.
--     Edited only by authorised Oyen veterinary reviewers; never by
--     clinical users via the patient-record interface.
CREATE TABLE vet_concept_knowledge (
    concept_id                  UUID PRIMARY KEY REFERENCES vet_concept(id),
    species_prevalence_note     TEXT,   -- "Common in senior cats; rare in dogs"
    typical_age_of_onset        TEXT,   -- informational reference note only
    common_clinical_signs_note  TEXT,   -- INFORMATIONAL ONLY — must never auto-diagnose
    monitoring_considerations   TEXT,   -- "Regular bloodwork for DM management"
    preventive_care_note        TEXT,   -- "Annual titre testing recommended"
    clinical_guideline_ref      TEXT,   -- "WSAVA VGG 2024"
    guideline_version           VARCHAR(50),
    source_reference            TEXT,   -- "Merck Vet Manual, Endocrine §"
    last_reviewed_at            TIMESTAMPTZ
);


-- ============================================================
-- SECTION 4: VACCINE CONCEPT EXTENSION
-- ============================================================

-- 4.1 vet_vaccine_concept
--     Extra attributes for concepts with concept_type = 'VACCINE'.
--     vaccine_category values follow the WSAVA Vaccination Guidelines Group
--     (VGG) classification: CORE / NON_CORE / NOT_RECOMMENDED.
--     INFORMATIONAL ONLY — the master never auto-schedules vaccinations.
--     Actual vaccination schedules are set by the attending veterinarian.
CREATE TABLE vet_vaccine_concept (
    concept_id                  UUID PRIMARY KEY REFERENCES vet_concept(id),
    disease_prevented_concept_id UUID REFERENCES vet_concept(id),  -- nullable
    vaccine_category            VARCHAR(20) NOT NULL,    -- CORE | NON_CORE | NOT_RECOMMENDED
    typical_initial_series      TEXT,   -- "3 doses, 3-4 weeks apart" — reference only
    typical_booster_interval    TEXT,   -- "Every 1-3 years per titre testing" — reference only
    route_of_administration     VARCHAR(20),  -- SC | IM | IN | ORAL
    clinical_guideline_ref      TEXT,   -- "WSAVA VGG 2024"

    CONSTRAINT chk_vet_vaccine_category CHECK (vaccine_category IN (
        'CORE','NON_CORE','NOT_RECOMMENDED'
    )),
    CONSTRAINT chk_vet_vaccine_no_self_disease
        CHECK (disease_prevented_concept_id <> concept_id)
);


-- ============================================================
-- SECTION 5: PROCEDURE MASTER (SEPARATE FROM CONCEPT MASTER)
-- ============================================================
-- Procedures (clinical interventions) are categorically distinct from
-- diagnoses/conditions and are NOT merged into vet_concept.
-- This table answers: "What procedures exist?"
-- It does NOT record: "What procedure was performed on this specific pet?"
-- (that belongs to the future vet_encounter_procedure patient-record table).

-- 5.1 vet_procedure
CREATE TABLE vet_procedure (
    id                          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical_code              VARCHAR(30) NOT NULL UNIQUE,  -- e.g. "PROC-EXM-001"
    procedure_category          VARCHAR(30) NOT NULL,         -- see VETERINARY_PROCEDURES.md §3
    procedure_subcategory       VARCHAR(50),                  -- fine-grained sub-type
    body_region_concept_id      UUID        REFERENCES vet_concept(id),  -- nullable; BODY_STRUCTURE type
    requires_anaesthesia        BOOLEAN     NOT NULL DEFAULT FALSE,
    requires_veterinarian       BOOLEAN     NOT NULL DEFAULT FALSE,
    typical_duration_minutes    INTEGER,
    specimen_type               TEXT,        -- for diagnostic procedures, e.g. "whole blood"
    equipment_note              TEXT,
    clinical_guideline_ref      TEXT,
    status                      VARCHAR(20) NOT NULL DEFAULT 'PENDING_REVIEW',
    version_id                  UUID        NOT NULL REFERENCES vet_terminology_version(id),
    source_id                   UUID        REFERENCES vet_source(id),
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_by                 UUID,        -- FK to users.id
    deprecated_at               TIMESTAMPTZ,
    replaced_by_procedure_id    UUID        REFERENCES vet_procedure(id),

    CONSTRAINT chk_vet_procedure_category CHECK (procedure_category IN (
        'EXAMINATION','DIAGNOSTIC_TEST','IMAGING','PREVENTIVE_PROCEDURE',
        'THERAPEUTIC_PROCEDURE','SURGICAL_PROCEDURE','ANAESTHESIA',
        'HOSPITALISATION','DENTAL_PROCEDURE','EUTHANASIA'
    )),

    CONSTRAINT chk_vet_procedure_status CHECK (status IN (
        'PENDING_REVIEW','ACTIVE','DEPRECATED','REJECTED'
    )),

    CONSTRAINT chk_vet_procedure_no_self_replace
        CHECK (replaced_by_procedure_id <> id)
);

CREATE INDEX idx_vet_procedure_category ON vet_procedure (procedure_category);
CREATE INDEX idx_vet_procedure_status   ON vet_procedure (status);
CREATE INDEX idx_vet_procedure_version  ON vet_procedure (version_id);


-- 5.2 vet_procedure_name
--     Canonical display names per procedure per language.
CREATE TABLE vet_procedure_name (
    procedure_id    UUID        NOT NULL REFERENCES vet_procedure(id),
    language_code   VARCHAR(10) NOT NULL,
    name            TEXT        NOT NULL,
    PRIMARY KEY (procedure_id, language_code)
);

CREATE INDEX idx_vet_procedure_name_lang ON vet_procedure_name (language_code, name);


-- 5.3 vet_procedure_species
--     Many-to-many: which species (pet_types) does this procedure apply to?
CREATE TABLE vet_procedure_species (
    procedure_id    UUID NOT NULL REFERENCES vet_procedure(id),
    pet_type_id     UUID NOT NULL REFERENCES pet_types(id),
    PRIMARY KEY (procedure_id, pet_type_id)
);

CREATE INDEX idx_vet_procedure_species_pet ON vet_procedure_species (pet_type_id);


-- ============================================================
-- SECTION 6: SEED DATA — PROVENANCE / REFERENCE ONLY
-- ============================================================
-- IMPORTANT: Only structural/provenance reference data is seeded here.
-- No fabricated diagnoses, no invented SCTIDs, no clinical conditions.
-- The controlled vocabulary of concepts will be authored separately by
-- a veterinary reviewer through the admin workflow.

-- 6.1 vet_terminology_version — initial version record
INSERT INTO vet_terminology_version (id, version_code, published_at, description, is_current)
VALUES (
    gen_random_uuid(),
    'OYEN-VET-INITIAL',
    NOW(),
    'Initial Oyen Veterinary Medical Master terminology version. Establishes the structural foundation; concept content will be authored and approved separately.',
    TRUE
);

-- 6.2 vet_source — authoritative external sources
--     These records document provenance metadata only.
--     No copyrighted content from any source is stored here.
INSERT INTO vet_source (id, code, name, organization, source_type, url, description, is_active)
VALUES
(
    gen_random_uuid(),
    'SNOMEDCT_VET',
    'VetSCT — Veterinary Extension of SNOMED CT',
    'Virginia Tech Veterinary Medical Informatics Lab (VTSL) / SNOMED International',
    'TERMINOLOGY',
    'https://vtsl.vetmed.vt.edu/extension/',
    'Formal authorized extension to SNOMED CT providing veterinary clinical terminology. Use requires IHTSDO Affiliate License for commercial use in non-member territories including Indonesia. See VETERINARY_OPEN_DECISIONS.md decision OD-001.',
    TRUE
),
(
    gen_random_uuid(),
    'WSAVA',
    'WSAVA Global Guidelines',
    'World Small Animal Veterinary Association',
    'GUIDELINE',
    'https://wsava.org/global-guidelines/',
    'Global companion animal veterinary guidelines including vaccination (VGG 2024), nutrition, pain management, dental care, and preventive healthcare. Referenced for design decisions; content not reproduced.',
    TRUE
),
(
    gen_random_uuid(),
    'AAHA',
    'AAHA Guidelines',
    'American Animal Hospital Association',
    'GUIDELINE',
    'https://www.aaha.org/for-veterinary-professionals/aaha-guidelines/',
    'Clinical practice guidelines for companion animal medicine including preventive healthcare, life stage care, pain management, and anesthesia. Referenced for taxonomy validation; content not reproduced.',
    TRUE
),
(
    gen_random_uuid(),
    'MERCK_VET',
    'Merck Veterinary Manual',
    'Merck & Co., Inc.',
    'REFERENCE',
    'https://www.merckvetmanual.com/',
    'Comprehensive veterinary reference organized by body system and special topics. Informed the body_system taxonomy and disorder categories used in vet_concept. Content not reproduced.',
    TRUE
);

-- ============================================================
-- END OF V5 MIGRATION
-- ============================================================
-- Tables created (master/reference only):
--   vet_source, vet_terminology_version
--   vet_concept, vet_concept_name, vet_concept_synonym
--   vet_concept_species, vet_concept_external_mapping
--   vet_concept_relationship, vet_concept_knowledge
--   vet_vaccine_concept
--   vet_procedure, vet_procedure_name, vet_procedure_species
--
-- Tables NOT created (future patient medical-record workflow):
--   vet_encounter, vet_encounter_diagnosis, vet_encounter_procedure
--   vet_vital_signs, vet_lab_result, vet_imaging_record
--   vet_medication_order, vet_follow_up, vet_encounter_document
--   vet_encounter_addendum, vet_record_void
--
-- Existing tables UNCHANGED:
--   pet_types, vaccine_types, pet_vaccinations (and all others)
-- ============================================================
