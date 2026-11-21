# Oyen — Veterinary Terminology Strategy

**Status:** Canonical terminology design for the Oyen Veterinary Medical Master.
**Companion documents:**
- `VETERINARY_DATA_SOURCES.md` — source provenance, licensing, ingestion strategy
- `VETERINARY_MEDICAL_MASTER.md` — concept model and taxonomy
- `VETERINARY_PROCEDURES.md` — procedure-specific taxonomy
- `VETERINARY_MEDICAL_RECORD.md` — patient record model and historical integrity

**Classification tags used throughout:**
- `[SOURCE-DERIVED]` — fact from an authoritative external source
- `[OYEN-DECISION]` — Oyen architectural or product decision
- `[INFERRED]` — reasonable inference; not a direct source quote

---

## 1. Purpose of This Document

This document defines how Oyen represents, names, localises, versions, and
maintains veterinary terminology. It covers:

- The difference between a **canonical concept**, a **display name**, and a **synonym**
- The **multilingual strategy** (English + Bahasa Indonesia + extensible to more)
- How **external terminology codes** (SNOMED/VetSCT) relate to Oyen's own IDs
- How **deprecated and replaced concepts** work without corrupting history
- How the system **prevents duplicate concepts** from accumulating
- The **vocabulary for concept types** used throughout the master

This document covers terminology rules. It does not define the full concept
model (see `VETERINARY_MEDICAL_MASTER.md`) or procedure taxonomy (see
`VETERINARY_PROCEDURES.md`).

---

## 2. Core Distinction: Concept vs Display vs Synonym

### 2.1 The Concept

A **veterinary concept** is an abstract, stable, species-aware clinical entity
that exists independently of any language. It is the single source of truth for
what a clinical idea *means*.

A concept is identified by Oyen's own stable UUID (the **concept_id**), not by
its name. This is the critical invariant: names and synonyms may change; the
concept_id never does.

```
Concept (abstract)
├── concept_id          UUID  ← stable, never changes
├── concept_type        DISEASE | SYNDROME | CLINICAL_FINDING | PROCEDURE | VACCINE | ... (see §5)
├── canonical_code      VARCHAR  ← human-readable stable code, e.g. "DIAG-DRD-001"
├── species_applicability   [DOG, CAT, ...]
├── status              ACTIVE | DEPRECATED | PENDING_REVIEW
└── terminology_version  FK → vet_terminology_version
```

### 2.2 The Canonical Name

Each concept has exactly **one canonical name per language**. The canonical name
is the primary, authoritative display string for that language. It is the
name clinicians and software should prefer.

```
canonical name
├── concept_id          FK → concept
├── language_code       ISO 639-1 (en, id, ...)
└── name                TEXT  ← the authoritative display string
```

For English the canonical name follows the preferred term convention from
VetSCT/SNOMED CT where a mapping exists (`[OYEN-DECISION]`). Where no mapping
exists, Oyen uses plain veterinary English aligned with Merck Veterinary Manual
terminology.

For Bahasa Indonesia the canonical name is Oyen's own authored translation,
reviewed by a veterinary professional fluent in Indonesian. It does not need to
mirror the English term word-for-word; it must be the term a trained Indonesian
veterinarian would naturally use in clinical documentation.

### 2.3 Synonyms

A concept may have zero or more synonyms. A synonym is an alternative name that
resolves to the same concept. Synonyms are used for:

| Synonym type | Description | Example |
|--------------|-------------|---------|
| `VETERINARY_PROFESSIONAL` | Clinical term used by veterinarians | "Diabetes mellitus" |
| `COMMON_OWNER` | Plain-language term a pet owner might use | "Sugar disease", "Sweet urine" |
| `ABBREVIATION` | Standard abbreviation | "DM", "CKD", "HCM" |
| `ALTERNATE_SPELLING` | Regional or historical spelling variant | "Anaemia" / "Anemia" |
| `TRADE_NAME` | Registered trade/brand name where applicable | (medications only) |
| `EXTERNAL_PREFERRED` | Preferred term from an external system (e.g. SNOMED FSN) | "Diabetes mellitus (disorder)" |

Synonyms can exist in any supported language. A synonym does **not** have its
own concept_id; it resolves to its parent concept.

The system MUST prevent a synonym from being identical to the canonical name of
a *different* concept in the same species and concept_type, since that would
create an ambiguous search result.

### 2.4 Fully Specified Name

`[OYEN-DECISION]` Oyen maintains an optional **fully specified name** (FSN) per
concept, modelled after the SNOMED CT convention. The FSN is a unique,
unambiguous identifier string in the format:

```
{canonical name} ({concept_type_tag}) [{species_tag}]
```

Example: `Feline infectious peritonitis (disorder) [CAT]`

The FSN is machine-readable and human-readable. It is used in exports,
interoperability contexts, and admin tooling where the plain canonical name
might be ambiguous.

---

## 3. Language and Localisation Strategy

### 3.1 Supported languages at launch

| Code | Language | Role |
|------|----------|------|
| `en` | English | Primary/source language; all concepts must have an English canonical name |
| `id` | Bahasa Indonesia | First localisation; all concepts must have an Indonesian canonical name at launch |

Additional languages (Javanese, Sundanese, or future markets) may be added
without schema change — they are additional rows in the canonical-name and
synonym tables.

### 3.2 Authoring and translation rules

`[OYEN-DECISION]`

1. **English is authored first.** A concept is created in English; the
   Indonesian name is provided as part of the same authoring/review workflow.
   A concept must not be activated until both `en` and `id` canonical names
   are present.

2. **Indonesian names are not mechanical translations.** The Indonesian
   veterinary community uses a mix of loanwords (from Dutch, English, Latin)
   and indigenous Bahasa Indonesia terms. The canonical Indonesian name should
   match what Indonesian veterinarians actually write in clinical notes, not a
   word-for-word Google Translate output.

3. **Owner-facing synonyms in Indonesian** are equally important. Pet owners
   in Indonesia often use colloquial terms; these should be captured as
   `COMMON_OWNER` synonyms in `id` so that search and reminder features can
   match what owners type.

4. **Latin/scientific names** are stored as `VETERINARY_PROFESSIONAL` synonyms
   with language_code `la` (Latin). They are not localised.

5. **Names must not be recycled.** The combination of
   `(canonical_name, language_code, species, concept_type)` must be unique
   across active concepts to prevent ambiguous search results.

### 3.3 Display name resolution at runtime

When the application displays a concept to a user:

```
1. Resolve user's locale (en | id | ...).
2. Look up canonical name for concept_id + language_code.
3. If not found, fall back to English canonical name.
4. Append species qualifier if the context is ambiguous (e.g. same condition
   exists for both DOG and CAT with different names).
```

**The frontend never stores, caches, or hardcodes veterinary concept names.**
They are always resolved from the backend at runtime. `[OYEN-DECISION]`

---

## 4. Species Applicability

### 4.1 Species are first-class

`[OYEN-DECISION]` Species membership is declared on every concept, not
inferred from the name. A concept may apply to one species, multiple species,
or (for generic anatomical/physiological concepts) to no specific species.

The species list is the same `pet_types` table already in the Oyen database
(DOG, CAT, and future entries). Veterinary concepts hold a many-to-many
relationship with `pet_types` through a `vet_concept_species` join table:

```
vet_concept_species
├── concept_id   FK → vet_concept
└── pet_type_id  FK → pet_types
```

### 4.2 Why separate species applicability matters

- The same disease name sometimes describes clinically distinct entities in
  dogs vs cats (e.g. hypertrophic cardiomyopathy has different aetiologies and
  prevalences). `[INFERRED]`
- A concept not in `vet_concept_species` for a given species should not appear
  in that species' clinical dropdown.
- Synonyms may differ by species even if the concept is shared.

### 4.3 Species-specific synonyms

A synonym may have an optional `pet_type_id` constraint. When set, the synonym
is only used for that species. This allows:

```
Concept: "Rabies" (applies to DOG and CAT)
  Synonym [DOG]: "Canine rabies"
  Synonym [CAT]: "Feline rabies"
  Synonym [universal]: "Hydrophobia" (COMMON_OWNER, no species constraint)
```

---

## 5. Concept Type Vocabulary

`[OYEN-DECISION]` The following are the permitted values for `concept_type`.
This list is authoritative and exhaustive for the initial implementation;
new types require an explicit architecture decision.

> **Note:** This section was updated to align exactly with the granular taxonomy
> defined in `VETERINARY_MEDICAL_MASTER.md §3`, which is the authoritative
> source. The earlier draft of this section used a collapsed `DIAGNOSIS` type;
> the MEDICAL_MASTER separates that into distinct types for clinical precision.
> The database CHECK constraint in V5 uses the granular list below.

### 5.1 Diagnosis and clinical condition types

| concept_type | Description |
|---|---|
| `DISEASE` | A pathological process with a known or suspected aetiology, characteristic signs, and a defined course (e.g. Canine parvovirus infection) |
| `SYNDROME` | A recognised cluster of clinical signs without a single known aetiology (e.g. Brachycephalic obstructive airway syndrome) |
| `CLINICAL_FINDING` | An objective or subjective observation recorded by the clinician or owner; may or may not constitute a diagnosis (e.g. Polyuria, weight loss) |
| `SYMPTOM` | A subjective observation reported by the owner or inferred from behaviour (e.g. Decreased appetite, lethargy) |
| `SIGN` | An objective clinical observation recorded by the clinician on physical examination (e.g. Pyrexia, heart murmur) |
| `INJURY` | Traumatic or physical injury (e.g. Fracture, laceration, burn) |
| `INFECTIOUS_AGENT` | A causative pathogen that may be linked to a disease (e.g. Parvovirus CPV-2, Toxoplasma gondii) |
| `NEOPLASM` | Benign or malignant abnormal tissue growth (e.g. Mast cell tumour, lymphoma) |
| `CONGENITAL_CONDITION` | Present from birth, whether genetic or developmental (e.g. Patent ductus arteriosus, cleft palate) |
| `HEREDITARY_CONDITION` | Inherited genetic disorder (e.g. Hip dysplasia (hereditary form), MDR1 mutation) |
| `METABOLIC_ENDOCRINE` | Disorder of metabolism or endocrine function (e.g. Diabetes mellitus, hypothyroidism) |
| `NUTRITIONAL_CONDITION` | Disorder related to nutritional deficiency, excess, or imbalance (e.g. Obesity, vitamin D toxicity) |
| `BEHAVIORAL_CONDITION` | Behavioural abnormality with or without underlying medical cause (e.g. Separation anxiety, compulsive disorder) |
| `PREVENTIVE_CARE_CONCEPT` | A concept in the preventive-care domain: vaccine-preventable disease, parasite prevention target, or wellness screening type (e.g. Rabies (vaccine-preventable), heartworm (prevention target)) |
| `PARASITIC_CONDITION` | Infestation or infection by a parasite (e.g. Canine demodicosis, Toxocara infestation) |

### 5.2 Procedure type

| concept_type | Description |
|---|---|
| `PROCEDURE` | A clinical intervention performed on a patient; sub-typed by `procedure_category` in `vet_procedure`. See `VETERINARY_PROCEDURES.md` for the full sub-taxonomy. |
| `OBSERVABLE_ENTITY` | A measurable physiological or laboratory parameter (e.g. Body temperature, serum creatinine, haematocrit) |

### 5.3 Substance and anatomical types

| concept_type | Description |
|---|---|
| `MEDICATION` | A therapeutic substance administered to a patient |
| `VACCINE` | A prophylactic biological agent for immunisation (specialisation of MEDICATION; see `vet_vaccine_concept` extension table) |
| `BODY_STRUCTURE` | An anatomical location or structure used as a modifier/location on other concepts |

The `PROCEDURE` type is further sub-typed in `VETERINARY_PROCEDURES.md`.
The `VACCINE` type is a specialisation of `MEDICATION` (all vaccines are
medications, but not all medications are vaccines).

> **Downstream implications:** Where this document previously referenced
> `DIAGNOSIS types` in generic examples (e.g. "only DIAGNOSIS types appear in
> the add-diagnosis dropdown"), the intended meaning was the set of all
> diagnosis-and-condition concept types: `DISEASE`, `SYNDROME`,
> `CLINICAL_FINDING`, `SYMPTOM`, `SIGN`, `INJURY`, `NEOPLASM`,
> `CONGENITAL_CONDITION`, `HEREDITARY_CONDITION`, `METABOLIC_ENDOCRINE`,
> `NUTRITIONAL_CONDITION`, `BEHAVIORAL_CONDITION`, `PREVENTIVE_CARE_CONCEPT`,
> and `PARASITIC_CONDITION`. Service-layer filtering must use this set rather
> than a single `DIAGNOSIS` value.

---

## 6. External Terminology Mapping

### 6.1 Mapping structure

`[OYEN-DECISION]` Oyen maintains an optional many-to-one mapping between its
own concept UUIDs and external terminology codes. One Oyen concept may have
zero or more external mappings, each to a different external terminology:

```
vet_concept_external_mapping
├── id              UUID PK
├── concept_id      FK → vet_concept
├── system_code     VARCHAR  ← identifies the terminology (e.g. "SNOMEDCT_VET", "ICD10_VET")
├── system_version  VARCHAR  ← e.g. "2026-09" for the SNOMED release
├── external_code   VARCHAR  ← e.g. the SCTID
├── match_type      EXACT | BROADER | NARROWER | RELATED
├── is_current      BOOLEAN
├── notes           TEXT
├── created_at      TIMESTAMPTZ
└── created_by      UUID FK → users
```

### 6.2 Mapping types

| match_type | Meaning |
|------------|---------|
| `EXACT` | The Oyen concept and the external concept represent exactly the same clinical entity |
| `BROADER` | The external concept is broader than Oyen's; Oyen's is more specific |
| `NARROWER` | The external concept is narrower; Oyen's concept is more general |
| `RELATED` | The concepts are clinically related but not equivalent |

### 6.3 Permitted external terminology codes at launch

| `system_code` | Source | Notes |
|---------------|--------|-------|
| `SNOMEDCT_VET` | VetSCT / SNOMED CT | Requires licensing review; see `VETERINARY_DATA_SOURCES.md` §7 |
| `SNOMEDCT_CORE` | SNOMED CT International core | Same licensing note |
| `ICD10_VET` | ICD-10 adapted for veterinary use | Low licensing risk; used in some national veterinary disease-reporting systems |
| `OYEN_LEGACY` | Oyen internal migration (for upgrading the existing vaccine_types table) | Oyen-internal only |

Additional systems may be added by inserting new rows with a new `system_code`
value; no schema change is needed.

### 6.4 Relationship to existing vaccine_types

The existing `vaccine_types` table in Oyen is a simpler, earlier model covering
only vaccines. When the Veterinary Medical Master is implemented, vaccine types
will be migrated to Oyen veterinary concepts with `concept_type = VACCINE`.
The migration will:

1. Create a corresponding `vet_concept` row for each existing `vaccine_type`.
2. Create an `OYEN_LEGACY` external mapping pointing to the old
   `vaccine_types.code` so historical records that reference the old code
   can be resolved.
3. The `vaccine_types` table and its existing `pet_vaccinations` FK remain
   unchanged at migration time; dual-write or a compatibility view bridges
   old and new during the transition period.
4. This migration is a **future implementation task** (see
   `VETERINARY_MEDICAL_MASTER.md` §9); no migration file exists today.

---

## 7. Preventing Duplicate Concepts

Duplicate concepts are the most common quality problem in clinical terminology
systems. `[INFERRED]` Oyen enforces the following deduplication rules:

### 7.1 Pre-creation checks (enforced by the service layer)

Before a concept is created or approved:

1. **Exact canonical name match check:** Search for any active concept with the
   same canonical name (case-insensitive, any language) in the same
   `concept_type` and species scope. Raise a duplicate warning if found.

2. **Synonym collision check:** Verify that none of the proposed synonyms match
   the canonical name of any other active concept in the same scope.

3. **External code uniqueness check:** If an external mapping is provided,
   verify no other active Oyen concept already has an `EXACT` mapping to the
   same `(system_code, external_code)` pair.

### 7.2 Merge procedure

When two live concepts are found to be duplicates:

```
1. Designate one as the SURVIVOR (canonical, active).
2. Mark the other as DEPRECATED with replaced_by_concept_id = survivor.
3. All synonyms of the deprecated concept become synonyms of the survivor
   (if not already present).
4. All external mappings of the deprecated concept are copied to the survivor
   with is_current = FALSE unless superseded by a more accurate mapping.
5. Historical medical records are NOT updated — they retain the deprecated
   concept_id and the system resolves the replacement at display time.
```

### 7.3 Cross-language deduplication risk

The same clinical entity may be entered by different authors using different
languages. A pre-creation check must also verify that if an English term maps
to a known external code, no existing Oyen concept already has that same
external code in an EXACT mapping.

---

## 8. Concept Lifecycle

```
PENDING_REVIEW ──► ACTIVE ──► DEPRECATED
       │                            │
       │ (rejected)                 └──► replaced_by_concept_id → another ACTIVE concept
       ▼
   REJECTED (soft, can be resubmitted)
```

| Status | Meaning |
|--------|---------|
| `PENDING_REVIEW` | Created by an author; awaiting veterinary reviewer approval |
| `ACTIVE` | Approved; available for use in clinical records and search |
| `DEPRECATED` | No longer in use; not available in search for new entries; historical records unaffected |
| `REJECTED` | Reviewed and rejected; can be revised and resubmitted |

Concepts transition from `ACTIVE` to `DEPRECATED` only — they are never
hard-deleted. `[OYEN-DECISION]`

---

## 9. Terminology Versioning

`[OYEN-DECISION]` All concept records carry a reference to a terminology
version. The version represents a named, dated snapshot of the Oyen veterinary
terminology at the time a concept was introduced or last modified.

```
vet_terminology_version
├── version_code        VARCHAR  (e.g. "OYEN-VET-2026-Q4")
├── published_at        TIMESTAMPTZ
├── description         TEXT
├── external_source_ref VARCHAR  (e.g. "VetSCT RF2 2026-09", optional)
└── is_current          BOOLEAN
```

Rules:
- Only one version may be `is_current = true` at any time.
- When a new version is published, the previous version's `is_current` is set
  to false.
- Medical encounter records (in the future medical record domain) must record
  the `version_code` active at the time of the encounter, not the current
  version. This ensures that renaming a concept later does not change the
  clinical meaning of a historical record.

The first version to be created is `OYEN-VET-INITIAL` and contains the curated
seed concepts shipped with the veterinary master at launch.

---

## 10. Search and Lookup Rules

When a veterinarian or the system searches for a concept by text:

1. Match against canonical names (all languages) of ACTIVE concepts.
2. Match against all ACTIVE synonyms.
3. Exclude DEPRECATED and PENDING_REVIEW concepts from clinical-entry search
   results (they may appear in admin/review views).
4. Rank results: exact canonical name match > synonym match > partial match.
5. Apply species filter based on the current pet being treated.
6. Apply concept_type filter based on the clinical context (e.g. only
   diagnosis-and-condition concept types appear in the "add diagnosis" dropdown;
   see §5 for the full set of applicable types).

Synonym search must NOT be allowed to return ambiguous results where one
synonym resolves to more than one concept. The deduplication rules in §7
prevent this at authoring time; the search layer enforces it at query time.

---

## 11. Terminology Quality Rules Summary

| Rule | Enforcement |
|------|-------------|
| Every concept has exactly one English canonical name | Service-layer validation |
| Every concept has exactly one Indonesian canonical name before activation | Service-layer validation |
| Canonical names are unique within (concept_type, species, language) | Database unique constraint + service check |
| No synonym duplicates a canonical name of a different concept in the same scope | Pre-creation synonym check |
| Concepts are never hard-deleted once active | No DELETE permission in application code for vet_concept |
| Deprecated concepts record a replacement concept where applicable | Deprecation workflow enforces this |
| External code EXACT mappings are unique per (system_code, concept, external_code) where is_current = TRUE | Partial unique index on vet_concept_external_mapping |
| All concepts reference a terminology version | NOT NULL FK on vet_terminology_version |
| Frontend never hardcodes concept names | Enforced by design (names are API-resolved) |

---

## 12. Relationship to Existing Oyen Concepts

### vaccine_types (existing table)

The existing `vaccine_types` table is the predecessor of the `VACCINE`
concept type in the veterinary master. It is a simpler model adequate for
Phase 2's basic vaccination history. The veterinary master does not remove or
break it. Migration is deferred to the phase that implements the full medical
master.

### service_categories (existing table)

The `service_categories` table (with `is_veterinary` flag) categorises merchant
services (Vaccination, Veterinary Consultation, Dental Care, etc.). This is a
**service catalogue** concern, not a veterinary concept. The two models are
distinct:

- `service_categories` answers: "What service can I book at a merchant?"
- `vet_concept` (the veterinary master) answers: "What clinical entity does this
  diagnosis/procedure/finding refer to?"

A service booking for "Dental Cleaning" maps to a service category but may
generate a medical encounter that references a `vet_concept` of type PROCEDURE
with canonical name "Dental prophylaxis". The relationship is recorded in the
medical encounter, not in `service_categories`.

### pet.allergies (existing field)

The `pets.allergies` field is a free-text field today. In the future, it may
be linked to `vet_concept` rows of type `CLINICAL_FINDING` or `MEDICATION`
(allergen). The current field must not be removed; structured allergy concepts
are an additive enhancement.
