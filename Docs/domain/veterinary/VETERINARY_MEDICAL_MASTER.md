# Oyen — Veterinary Medical Master

**Status:** Canonical conceptual model for the Oyen Veterinary Medical Master.
**Companion documents:**
- `VETERINARY_DATA_SOURCES.md` — authoritative sources, licensing, ingestion
- `VETERINARY_TERMINOLOGY.md` — naming, language, species, lifecycle
- `VETERINARY_PROCEDURES.md` — procedure sub-taxonomy
- `VETERINARY_MEDICAL_RECORD.md` — patient record model, historical integrity

**Classification tags:**
- `[SOURCE-DERIVED]` — fact from an authoritative external source
- `[OYEN-DECISION]` — Oyen architectural or product decision
- `[INFERRED]` — reasonable inference; not a direct source quote

**Implementation status: FOUNDATION IMPLEMENTED (V5/V6) — authoring workflow and patient medical-record workflow are FUTURE.**
The master/reference database schema (13 tables), JPA entities, and repositories are implemented
in migrations V5 and V6. The concept authoring admin tool, clinical workflow, and all
patient-specific medical-record tables (encounters, diagnoses, prescriptions, etc.) remain
future-phase work. This document defines the complete target design; implemented portions
are noted inline.

---

## 1. What the Veterinary Medical Master Is

The Veterinary Medical Master is a controlled, versioned, species-aware
reference vocabulary of clinical entities relevant to companion-animal
veterinary medicine. It is the authoritative lookup table that connects a
clinical word or code to a precise, stable, unambiguous concept.

It answers the question: *"What is this clinical entity?"*

It does **not** answer: *"What happened to this specific pet?"* (that is the
medical record — see `VETERINARY_MEDICAL_RECORD.md`).
It does **not** answer: *"What procedure can I book?"* (that is the
service catalogue — see `service_categories` in the Oyen schema).

### 1.1 The three-layer model

```
Layer 1 — TERMINOLOGY MASTER (this document)
    "What are the known clinical concepts?"
    vet_concept, vet_concept_name, vet_concept_synonym,
    vet_concept_species, vet_concept_external_mapping,
    vet_terminology_version

Layer 2 — CLINICAL KNOWLEDGE (§8 of this document)
    "What reference information is known about a concept?"
    vet_concept_knowledge: body system, prevalence, guideline refs,
    monitoring considerations, typical species, preventive category.
    Read-only clinical reference. Never auto-prescribes treatment.

Layer 3 — MEDICAL RECORD (VETERINARY_MEDICAL_RECORD.md)
    "What actually happened to this specific pet?"
    vet_encounter, vet_diagnosis, vet_encounter_procedure,
    vet_medication_order, vet_vital_signs, vet_lab_result, ...
    Patient-specific, authored by a veterinarian, immutable history.
```

These three layers are **strictly separated**. Data flows downward only:
master concepts are referenced from clinical knowledge; clinical knowledge is
referenced from (but never mutated by) medical records. A change in layer 1 or
layer 2 never rewrites layer 3. `[OYEN-DECISION]`

---

## 2. Core Concept Model

Every entity in the veterinary master is a **veterinary concept** — an
abstract, stable, species-aware clinical entity identified by a UUID.

### 2.1 Conceptual structure

```
vet_concept
├── id (UUID)                      ← Oyen's own stable primary key; never changes
├── canonical_code (VARCHAR)       ← human-readable stable code e.g. "DIAG-DRD-001"
├── concept_type (ENUM)            ← see §3 for allowed values
├── body_system (ENUM/FK)          ← primary body system (nullable; see §4)
├── status (ENUM)                  ← PENDING_REVIEW | ACTIVE | DEPRECATED | REJECTED
├── vet_terminology_version (FK)   ← version at which this concept was introduced
├── source_type (ENUM)             ← OYEN_CURATED | VETERINARY_IMPORT | CLINICIAN_PROPOSED
├── source_reference (TEXT)        ← e.g. "WSAVA VGG 2024", "Merck Vet Manual"
├── created_at (TIMESTAMPTZ)
├── created_by (UUID FK users)
├── reviewed_by (UUID FK users)
├── deprecated_at (TIMESTAMPTZ)
├── deprecated_reason (TEXT)
└── replaced_by_concept_id (UUID FK vet_concept)  ← nullable; set on deprecation

vet_concept_name                   ← one row per language per concept
├── concept_id (FK)
├── language_code (en | id | ...)
└── name (TEXT)                    ← canonical display name for this language

vet_concept_synonym                ← zero or more per concept per language
├── concept_id (FK)
├── language_code
├── synonym_text (TEXT)
├── synonym_type (ENUM)            ← see VETERINARY_TERMINOLOGY.md §5
└── pet_type_id (FK, nullable)     ← species-specific synonym if set

vet_concept_species                ← many-to-many with pet_types
├── concept_id (FK)
└── pet_type_id (FK → pet_types)

vet_concept_external_mapping       ← optional external code mappings
├── concept_id (FK)
├── system_code (VARCHAR)          ← e.g. "SNOMEDCT_VET", "ICD10_VET"
├── system_version (VARCHAR)
├── external_code (VARCHAR)
├── match_type (ENUM)              ← EXACT | BROADER | NARROWER | RELATED
└── is_current (BOOLEAN)
```

All fields above are **implemented** in migration V5 as the `vet_concept` table.
The column types shown match the actual PostgreSQL representation.

---

## 3. Concept Type Taxonomy

`[OYEN-DECISION]` The master contains distinct concept types. Diagnosis and
procedures are **never combined** into a single generic table.

### 3.1 Diagnosis and clinical condition types

| concept_type | Description | Example |
|---|---|---|
| `DISEASE` | A pathological process with a known or suspected aetiology, characteristic signs, and a defined course | Canine parvovirus infection |
| `SYNDROME` | A recognised cluster of clinical signs without a single known aetiology | Brachycephalic obstructive airway syndrome |
| `CLINICAL_FINDING` | An objective or subjective observation recorded by the clinician or owner; may or may not constitute a diagnosis | Polyuria, weight loss, pale mucous membranes |
| `SYMPTOM` | Subjective experience reported by the owner (as proxy for the patient) | Decreased appetite, lethargy |
| `SIGN` | Objective observation recorded by the clinician on physical examination | Pyrexia, heart murmur, abdominal pain on palpation |
| `INJURY` | Traumatic or physical injury | Fracture, laceration, burn |
| `INFECTIOUS_AGENT` | A causative pathogen that may be linked to a disease | Parvovirus CPV-2, Toxoplasma gondii |
| `NEOPLASM` | Benign or malignant abnormal tissue growth | Mast cell tumour, lymphoma |
| `CONGENITAL_CONDITION` | Present from birth, whether genetic or developmental | Patent ductus arteriosus, cleft palate |
| `HEREDITARY_CONDITION` | Inherited genetic disorder | Hip dysplasia (hereditary form), MDR1 mutation |
| `METABOLIC_ENDOCRINE` | Disorder of metabolism or endocrine function | Diabetes mellitus, hypothyroidism |
| `NUTRITIONAL_CONDITION` | Disorder related to nutritional deficiency, excess, or imbalance | Obesity, vitamin D toxicity |
| `BEHAVIORAL_CONDITION` | Behavioural abnormality with or without underlying medical cause | Separation anxiety, compulsive disorder |
| `PREVENTIVE_CARE_CONCEPT` | A concept in the preventive-care domain (vaccine-preventable diseases, parasite targets, wellness screening) | Rabies (vaccine-preventable), heartworm (prevention target) |
| `PARASITIC_CONDITION` | Infestation or infection by a parasite | Canine demodicosis, Toxocara infestation |

### 3.2 Procedure types (summary — full taxonomy in `VETERINARY_PROCEDURES.md`)

| concept_type | Description |
|---|---|
| `PROCEDURE` | Any clinical intervention performed on a patient; sub-typed by `procedure_category` |
| `OBSERVABLE_ENTITY` | A measurable physiological or laboratory parameter | Body temperature, serum creatinine |

### 3.3 Substance types

| concept_type | Description |
|---|---|
| `MEDICATION` | A therapeutic substance administered to a patient |
| `VACCINE` | A prophylactic biological agent for immunisation (specialisation of MEDICATION) |
| `BODY_STRUCTURE` | An anatomical location or structure used as a modifier on other concepts |

---

## 4. Body System Axis

`[OYEN-DECISION]` Every concept has an optional `body_system` attribute
that places it in a primary anatomical/physiological system. This taxonomy is
informed by the Merck Veterinary Manual's system-based organisation.
`[SOURCE-DERIVED]`

| body_system code | Display name (EN) | Display name (ID) |
|---|---|---|
| `CARDIOVASCULAR` | Cardiovascular system | Sistem kardiovaskular |
| `RESPIRATORY` | Respiratory system | Sistem pernapasan |
| `GASTROINTESTINAL` | Gastrointestinal system | Sistem gastrointestinal |
| `HEPATIC_PANCREATIC` | Hepatic and pancreatic | Hepatik dan pankreas |
| `URINARY` | Urinary system | Sistem urinari |
| `REPRODUCTIVE` | Reproductive system | Sistem reproduksi |
| `MUSCULOSKELETAL` | Musculoskeletal system | Sistem muskuloskeletal |
| `NERVOUS` | Nervous system | Sistem saraf |
| `OPHTHALMIC` | Ophthalmic | Oftalmik |
| `DERMATOLOGICAL` | Dermatological | Dermatologis |
| `ENDOCRINE` | Endocrine system | Sistem endokrin |
| `IMMUNE_HEMATOLOGIC` | Immune and haematologic system | Sistem imun dan hematologi |
| `INFECTIOUS` | Infectious disease (cross-system) | Penyakit infeksius |
| `PARASITIC` | Parasitic disease (cross-system) | Penyakit parasit |
| `BEHAVIORAL` | Behavioural | Perilaku |
| `NUTRITIONAL_METABOLIC` | Nutritional and metabolic | Nutrisi dan metabolisme |
| `TOXICOLOGICAL` | Toxicological | Toksikologi |
| `DENTAL_ORAL` | Dental and oral | Gigi dan mulut |
| `MULTISYSTEM` | Affects multiple systems or generalised | Multisistem / umum |

A concept may have a secondary body system recorded via `vet_concept_body_system`
(a join table) when the condition genuinely spans multiple systems. The primary
`body_system` is the one most clinically dominant.

---

## 5. Diagnosis Sub-model

### 5.1 Diagnosis certainty

When a veterinarian records a diagnosis in a medical encounter (layer 3), they
must express a certainty level. The master concept itself carries no certainty —
certainty is a property of the recorded encounter diagnosis, not of the concept.

| certainty | Description |
|---|---|
| `CONFIRMED` | Diagnosis confirmed by investigation or response to treatment |
| `SUSPECTED` | Working/provisional diagnosis; investigation in progress |
| `DIFFERENTIAL` | Listed as a possibility to be ruled in or out |
| `RULED_OUT` | Previously suspected; excluded by investigation |
| `HISTORICAL` | Diagnosed by another clinician; reported by owner |

### 5.2 Chronicity

The chronicity of a condition is recorded on the encounter diagnosis, not on
the master concept:

| chronicity | Description |
|---|---|
| `ACUTE` | Sudden onset, short duration |
| `SUBACUTE` | Intermediate onset and duration |
| `CHRONIC` | Long-standing, often managed rather than cured |
| `RECURRENT` | Episodes separated by periods of apparent resolution |

### 5.3 Severity

| severity | Description |
|---|---|
| `MILD` | Minimal impact on patient quality of life |
| `MODERATE` | Noticeable impact; may require treatment |
| `SEVERE` | Significant impact; requires urgent or intensive treatment |
| `LIFE_THREATENING` | Immediate risk to patient survival |

All three of certainty, chronicity, and severity are **encounter-level** fields
recorded in layer 3. They are not properties of the master concept. `[OYEN-DECISION]`

---

## 6. Vaccine Concept Sub-model

Vaccines are a specialisation of `MEDICATION` with `concept_type = VACCINE`.
In addition to the base concept fields, vaccine concepts carry:

```
vet_vaccine_concept (extends vet_concept where concept_type = VACCINE)
├── concept_id (FK → vet_concept)
├── disease_prevented_concept_id (FK → vet_concept of type PREVENTIVE_CARE_CONCEPT)
├── vaccine_category (ENUM)         ← CORE | NON_CORE | NOT_RECOMMENDED
├── typical_initial_series (TEXT)   ← e.g. "3 doses, 3-4 weeks apart"
├── typical_booster_interval (TEXT) ← e.g. "Every 1-3 years per titre testing"
├── route_of_administration (TEXT)  ← SC | IM | IN | ORAL
└── clinical_guideline_ref (TEXT)   ← e.g. "WSAVA VGG 2024"
```

The `vaccine_category` values (CORE / NON_CORE / NOT_RECOMMENDED) are directly
informed by the WSAVA Vaccination Guidelines Group classification. `[SOURCE-DERIVED]`

**Critical rule:** `typical_initial_series` and `typical_booster_interval` are
informational reference fields only. They describe the general guideline
recommendation. The **actual vaccination schedule for a specific pet** is
always determined by the attending veterinarian and recorded in the medical
record. The master never auto-schedules vaccinations. `[OYEN-DECISION]`

### 6.1 Relationship to existing vaccine_types table

The existing `vaccine_types` table in Oyen currently seeds: DOG_RABIES,
DOG_DISTEMPER, DOG_BORDETELLA, CAT_RABIES, CAT_PANLEUKOPENIA,
CAT_HERPESVIRUS (FHV-1), CAT_CALICIVIRUS. These seeds will become vaccine
concepts in the master when the veterinary domain is implemented. They are
referenced from existing `pet_vaccinations` records and must be migrated
carefully (see `VETERINARY_TERMINOLOGY.md` §6.4 for migration strategy).

---

## 7. Medication Concept Sub-model

Medications (other than vaccines) have `concept_type = MEDICATION` with
additional attributes:

```
vet_medication_concept (extends vet_concept where concept_type = MEDICATION)
├── concept_id (FK → vet_concept)
├── drug_class (TEXT)               ← e.g. "NSAID", "Antibiotic", "Corticosteroid"
├── active_ingredient (TEXT)        ← INN name
├── formulation_types (TEXT[])      ← e.g. ["TABLET", "INJECTABLE", "TOPICAL"]
├── species_caution (TEXT)          ← e.g. "Cats: avoid salicylates"
└── prescription_required (BOOLEAN) ← requires licensed veterinarian prescription
```

**No automatic prescribing rule:** The medication master describes what a drug
is. A medication order (dose, frequency, duration, route) is always authored by
a veterinarian as part of a medical encounter. The master never generates
prescriptions. `[OYEN-DECISION]`

The `species_caution` field is particularly important for multi-species
platforms: many medications safe for dogs are toxic to cats. This field is a
free-text safety note, not a system-enforced constraint. Enforcement belongs in
the clinical decision layer (future scope).

---

## 8. Clinical Knowledge Layer

The clinical knowledge layer is **reference information** associated with a
concept. It is distinct from the concept itself (layer 1) and from actual
patient records (layer 3).

```
vet_concept_knowledge
├── concept_id (FK → vet_concept)
├── species_prevalence_note (TEXT)   ← e.g. "Common in senior cats; rare in dogs"
├── typical_age_of_onset (TEXT)      ← general reference note only
├── primary_body_systems_note (TEXT) ← supplementary text
├── common_clinical_signs_note (TEXT)← informational; not a diagnostic algorithm
├── monitoring_considerations (TEXT) ← e.g. "Regular bloodwork for DM management"
├── preventive_care_note (TEXT)      ← e.g. "Annual titre testing recommended"
├── clinical_guideline_ref (TEXT)    ← reference to guideline source
├── guideline_version (TEXT)         ← e.g. "WSAVA VGG 2024"
├── source_reference (TEXT)          ← e.g. "Merck Vet Manual, Endocrine §"
└── last_reviewed_at (TIMESTAMPTZ)
```

### 8.1 Strict constraints on the knowledge layer

`[OYEN-DECISION]`

1. The knowledge layer provides **informational context** to veterinarians.
   It does NOT generate diagnoses, treatment plans, prescriptions, or referrals.
2. Content is editable only by authorised Oyen veterinary reviewers; it is not
   editable by clinical users through the patient-record interface.
3. All fields are free-text notes, not structured decision trees. This is
   intentional: structured clinical decision support is a much more complex
   future capability requiring separate clinical validation.
4. The knowledge layer must be clearly labelled in the UI as reference
   information, not clinical advice for the specific patient being treated.
5. `common_clinical_signs_note` is particularly sensitive — it must NEVER be
   surfaced to end users as "your pet has these signs so it has this disease."
   Its purpose is to help veterinarians recall associated findings, not to
   auto-diagnose.

---

## 9. Diagnosis Taxonomy (Top-level Categories)

The following taxonomy is Oyen's own design, informed by the Merck Veterinary
Manual body-system organisation and SNOMED CT concept hierarchy. `[SOURCE-DERIVED]`
`[OYEN-DECISION]`

```
Diagnosis (concept_type = DISEASE | SYNDROME | CLINICAL_FINDING | etc.)
│
├── By aetiology
│   ├── Infectious
│   │   ├── Viral
│   │   ├── Bacterial
│   │   ├── Fungal
│   │   └── Protozoal
│   ├── Parasitic
│   ├── Neoplastic (NEOPLASM)
│   ├── Immune-mediated
│   ├── Metabolic / Endocrine (METABOLIC_ENDOCRINE)
│   ├── Nutritional (NUTRITIONAL_CONDITION)
│   ├── Toxic (recorded via body_system = TOXICOLOGICAL)
│   ├── Traumatic (INJURY)
│   ├── Congenital (CONGENITAL_CONDITION)
│   ├── Hereditary / Genetic (HEREDITARY_CONDITION)
│   ├── Degenerative
│   ├── Behavioural (BEHAVIORAL_CONDITION)
│   └── Idiopathic / Unknown
│
├── By body system (§4 body_system axis)
│
└── By preventive-care status (PREVENTIVE_CARE_CONCEPT)
    ├── Vaccine-preventable
    ├── Parasite-preventable
    └── Lifestyle-preventable
```

This taxonomy is expressed through the combination of `concept_type` and
`body_system` on each concept. It is **not a separate table**; it is the
natural result of querying concept records by those two attributes.

---

## 10. Species Support Design

### 10.1 Dogs (Canis lupus familiaris) — code: DOG

The `DOG` species is already seeded in the `pet_types` table. Veterinary
concepts applicable to dogs are linked via `vet_concept_species.pet_type_id`.

Design notes for dogs:
- Many hereditary conditions in dogs are breed-specific (hip dysplasia,
  brachycephalic conditions, MDR1 mutation in collies). The `vet_concept`
  model records the condition at species level; **breed-specific prevalence
  notes** belong in `vet_concept_knowledge.species_prevalence_note` or a
  future breed-specific knowledge extension — they do not create separate
  concepts per breed. `[OYEN-DECISION]`
- Dog vaccine core set (informed by WSAVA VGG 2024): distemper, parvovirus,
  infectious canine hepatitis (adenovirus), rabies. `[SOURCE-DERIVED]`

### 10.2 Cats (Felis catus) — code: CAT

The `CAT` species is already seeded in the `pet_types` table.

Design notes for cats:
- Several conditions common in cats are rare or absent in dogs and vice versa
  (e.g. hypertrophic cardiomyopathy is the most common heart disease in cats;
  feline lower urinary tract disease has no direct canine equivalent).
  `[INFERRED]`
- Drug safety notes are especially important for cats: paracetamol/acetaminophen
  is toxic to cats, many NSAIDs are contraindicated, and permethrin-based
  products are dangerous. These are captured in `vet_medication_concept.species_caution`.
  `[SOURCE-DERIVED]`
- Cat vaccine core set (informed by WSAVA VGG 2024): feline panleukopenia
  (FPV), feline herpesvirus-1 (FHV-1), feline calicivirus (FCV), rabies.
  `[SOURCE-DERIVED]`

### 10.3 Future species

The schema supports any number of additional species by adding rows to
`pet_types` and linking concepts via `vet_concept_species`. No schema change
is required. Future candidates include rabbit, guinea pig, and bird species
as Oyen's market expands.

---

## 11. Concept Hierarchy (IS_A Relationships)

`[OYEN-DECISION]` Oyen implements a lightweight IS_A hierarchy sufficient for
search and filtering, without the full polyhierarchy complexity of SNOMED CT.

```
vet_concept_relationship
├── child_concept_id  (FK → vet_concept)
├── parent_concept_id (FK → vet_concept)
├── relationship_type (IS_A | HAS_COMPONENT | CAUSED_BY | ASSOCIATED_WITH)
└── is_primary_parent (BOOLEAN)
```

Rules:
- A concept may have zero or one primary parent and zero or more secondary
  parents (for concepts that genuinely belong in multiple branches).
- Circular relationships are prohibited (enforced at the service layer).
- The hierarchy is used for: search expansion (searching "gastrointestinal
  disease" returns all children), reporting roll-up, and future
  decision-support features.
- The hierarchy does NOT automatically transfer clinical knowledge from parent
  to child; each concept's knowledge entry is independently authored.

---

## 12. Canonical Code Convention

`[OYEN-DECISION]` In addition to the UUID primary key, each concept has a
human-readable `canonical_code` in the format:

```
{TYPE_PREFIX}-{BODY_SYSTEM_PREFIX}-{SEQUENCE}
```

| concept_type | prefix |
|---|---|
| DISEASE | DIAG |
| SYNDROME | SYN |
| CLINICAL_FINDING | CF |
| PROCEDURE | PROC |
| VACCINE | VAX |
| MEDICATION | MED |
| OBSERVABLE_ENTITY | OBS |
| BODY_STRUCTURE | ANAT |
| INFECTIOUS_AGENT | PATH |

Examples:
- `DIAG-ENDO-001` — first endocrine diagnosis concept
- `VAX-INF-001` — first vaccine concept in infectious domain
- `PROC-DEN-001` — first dental procedure concept

The canonical code is stable and unique. It is suitable for use in exports,
printed medical records, and API references where a short human-readable
identifier is needed alongside the UUID.

---

## 13. Integration Points with the Oyen Roadmap

The Veterinary Medical Master is a **future-phase foundation**. It does not
belong to any currently active phase. Integration points when future phases
are implemented:

| Integration point | Future phase | How the master is used |
|---|---|---|
| Pet domain (Phase 2 — done) | Existing `vaccine_types` migrated to `vet_concept` (VACCINE type) | Backward-compatible migration; existing `pet_vaccinations` records unaffected |
| Services & Scheduling (Phase 6) | Service booking linked to encounter creation; `service_categories.is_veterinary` determines if a booking generates a medical encounter | `vet_concept` concept_id recorded in encounter for diagnosis/procedure |
| Fulfillment / Bookings (Phase 10) | Completed veterinary booking triggers creation of an encounter skeleton | Encounter links to `vet_concept` for procedures performed |
| Pet Care Reminders (Phase 16.6) | Reminder type linked to `vet_concept` (e.g. `VAX-INF-001` for rabies vaccination reminder) | Concept drives the reminder label and care-history categorisation |
| Engagement / Reviews (Phase 14) | Pet care history surfaced on pet profile | Encounter diagnoses and procedures displayed using concept canonical names |
| Discovery / Recommendations (Phase 16.5) | Personalised home recommendations for preventive care based on pet species and recorded diagnoses | `PREVENTIVE_CARE_CONCEPT` type drives reminder and recommendation logic |
| Future veterinary EMR (unscheduled) | Full longitudinal medical record | All layers of the three-layer model in active use |

---

## 14. Architecture Decision Record — Veterinary Medical Master

**Decision:** Establish the Veterinary Medical Master as a first-class Oyen
domain.

**Status:** APPROVED AND PARTIALLY IMPLEMENTED.
The master/reference database foundation (schema, entities, repositories) is
implemented in migrations V5 and V6. The concept authoring workflow, admin UI,
and patient medical-record workflow remain deferred to a future phase.

**Context:** Oyen intends to support comprehensive longitudinal pet health
records. This requires a controlled, versioned, species-aware vocabulary of
clinical concepts that can be referenced from medical records, reminders, and
future decision-support features.

**Decisions made:**

| # | Decision | Rationale |
|---|---|---|
| 1 | Veterinary terminology is a first-class domain with its own concept model | Prevents ad-hoc string-based disease naming that cannot be queried, deduplicated, or localised |
| 2 | Diagnosis and procedures are **separate concept types** | Clinical entities and clinical actions are fundamentally different; combining them creates taxonomic confusion and blocks specialised queries |
| 3 | Terminology (layer 1), clinical knowledge (layer 2), and patient records (layer 3) are strictly separated | Changing the master never corrupts historical records; reference information never auto-prescribes |
| 4 | Dogs and cats are first-class species; species applicability is declared explicitly on every concept | Prevents misapplication of species-specific concepts; supports multi-species expansion without redesign |
| 5 | Terminology is versioned; historical records preserve the version at recording time | Historical clinical meaning is preserved even when concepts are updated or deprecated |
| 6 | Oyen assigns its own stable UUID concept_ids; external codes are optional mappings | Operates without a mandatory SNOMED license; preserves historical identity across external terminology changes |
| 7 | Concepts are never hard-deleted once referenced in a medical record | Historical integrity of patient records cannot be compromised by concept lifecycle events |
| 8 | The master NEVER auto-prescribes treatment from concept data | Clinical decisions belong to the veterinarian; the master is reference data, not a clinical decision engine |
| 9 | Authoritative external sources are referenced/mapped rather than copied | Avoids copyright violation and licensing fees; maintains Oyen's own clean terminology identity |
| 10 | English and Indonesian canonical names are both required before a concept is activated | Oyen is Indonesia-first; all clinical content must be usable in Bahasa Indonesia from day one |

**Consequences:**
- The master/reference database schema (migrations V5 and V6), JPA entities
  (`entity/veterinary`), and repositories (`veterinary/persistence`) have been
  implemented as a cross-cutting foundation.
- The concept authoring admin tool, the full clinical workflow (encounters,
  diagnoses, medication orders, etc.), and the Veterinary Medical Record
  workflow remain deferred to a future phase (currently unscheduled, after
  Phase 16.6).
- All future phases that reference clinical concepts (diagnoses, procedures,
  medications, vaccines) MUST use `vet_concept.id` as the FK reference rather
  than free-text strings.
- The existing `vaccine_types` table is superseded by this model; the
  migration that bridges `pet_vaccinations` to `vet_concept` is included in
  the implementation plan for that future phase.
