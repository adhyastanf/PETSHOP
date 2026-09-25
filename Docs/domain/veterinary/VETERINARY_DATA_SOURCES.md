# Oyen — Veterinary Data Sources

**Status:** Canonical reference for all authoritative veterinary terminology,
guideline, and reference sources used in the Oyen Veterinary Medical Master
design.

**Classification key used throughout this document:**

| Tag | Meaning |
|-----|---------|
| `TERMINOLOGY` | Structured code system for clinical concepts |
| `GUIDELINE` | Clinical practice guidance and best-practice recommendations |
| `REFERENCE` | General veterinary reference and educational material |

**Usage policy key:**

| Tag | Meaning |
|-----|---------|
| `MAP` | Oyen stores an optional mapping to the source's codes; no content copied |
| `DESIGN` | Informed architecture/taxonomy design decisions only |
| `REFERENCE_ONLY` | Browsed for context; no content reproduced |

**Content classification key:**

| Tag | Meaning |
|-----|---------|
| `SOURCE-DERIVED` | Fact established from reading the source |
| `OYEN-DECISION` | Architectural or product decision made by Oyen |
| `INFERRED` | Reasonable inference from sources; not a direct quote |

---

## 1. Authoritative Source Hierarchy

When sources conflict, or when a clinical concept must be prioritized, apply
this order:

```
1. VetSCT / SNOMED CT  — canonical terminology codes and concept identity
2. WSAVA Global Guidelines — preventive care, vaccination, wellness standards
3. AAHA Guidelines         — clinical care standards, life-stage recommendations
4. Merck Veterinary Manual — body-system taxonomy and clinical reference
5. Oyen domain decisions   — product-specific adaptations and ID assignments
```

This hierarchy governs **design decisions** only. It does not authorize Oyen
to copy or redistribute the content of any source.

---

## 2. Tier 1 — Veterinary Terminology Sources

### 2.1 VetSCT — Veterinary Extension of SNOMED CT

| Property | Value |
|----------|-------|
| **Full name** | VetSCT — Veterinary Extension of SNOMED CT® |
| **Maintaining organisation** | Virginia Tech Veterinary Medical Informatics Lab (VTSL), Virginia-Maryland College of Veterinary Medicine |
| **Built on** | SNOMED CT® International Edition (IHTSDO / SNOMED International) |
| **Classification** | `TERMINOLOGY` |
| **Oyen usage** | `MAP` |
| **Primary URL** | https://vtsl.vetmed.vt.edu/extension/ |
| **Browser** | https://vtsl.vetmed.vt.edu/TerminologyMgt/browser/ |
| **NLM documentation** | https://www.nlm.nih.gov/research/umls/vocabulary-documentation/assets/content/SNOMEDCT_VET/index.html |

**Purpose and scope:** VetSCT is a formal authorized extension to SNOMED CT that
adds animal-specific clinical content not covered by the human-medicine SNOMED CT
International core. It provides veterinary disorders, clinical findings,
procedures, organisms, substances, and anatomical structures relevant to
companion and other animal species. Content is integrated into the SNOMED CT
International release and can be distinguished by the source designation "VTS"
in the browser. `[SOURCE-DERIVED]`

Virginia Tech's Veterinary Medical Informatics Lab is the sole organization
globally responsible for maintaining this extension. `[SOURCE-DERIVED]`

**Concept structure:** VetSCT follows SNOMED CT's RF2 format. Each concept has:
a numeric SCTID (the stable identifier), a Fully Specified Name (FSN),
a Preferred Term, zero or more synonyms (descriptions), and
IS_A / attribute relationships forming a polyhierarchy. Concepts are never
deleted; they are inactivated and may point to replacement concepts. `[SOURCE-DERIVED]`

**Licensing for Oyen:**
- VetSCT is distributed as tab-delimited RF2 files to licensed SNOMED CT
  (UMLS) users. `[SOURCE-DERIVED]`
- SNOMED CT is **free** in IHTSDO Member territories and for qualifying
  low-income countries; Indonesia is **not** a current SNOMED International
  member territory. `[SOURCE-DERIVED]`
- Commercial use of SNOMED CT/VetSCT in a non-member territory such as
  Indonesia requires an IHTSDO Affiliate License, which may carry fees.
  `[SOURCE-DERIVED]`
- Oyen's strategy (`OYEN-DECISION`): Oyen does **not** redistribute or embed
  SNOMED CT/VetSCT content. Oyen assigns its own stable internal UUIDs to
  veterinary concepts. External VetSCT/SNOMED codes are stored as optional
  terminology mappings on those concepts (see `VETERINARY_TERMINOLOGY.md` §6).
  This approach enables future interoperability without requiring an immediate
  SNOMED license and avoids redistribution concerns.
- Before Oyen stores VetSCT SCTIDs internally (even as a non-displayed mapping
  field), legal counsel should confirm the applicable license requirements.
  The architecture supports adding/removing the mapping field without redesign.

---

### 2.2 SNOMED CT International Edition

| Property | Value |
|----------|-------|
| **Full name** | SNOMED CT® International Edition |
| **Maintaining organisation** | SNOMED International (formerly IHTSDO) |
| **Classification** | `TERMINOLOGY` |
| **Oyen usage** | `DESIGN` (concept structure informed Oyen's own model) |
| **URL** | https://www.snomed.org/ |
| **License** | https://www.snomed.org/snomed-ct/get-snomed |

**What Oyen used it for:** The SNOMED CT concept-model pattern (stable ID +
FSN + Preferred Term + synonyms + IS_A hierarchy + attribute relationships +
inactivation-with-replacement rather than deletion) directly informed Oyen's
own veterinary concept model design. `[OYEN-DECISION]`

---

## 3. Tier 2 — Clinical Guideline Sources

### 3.1 WSAVA Global Guidelines

| Property | Value |
|----------|-------|
| **Full name** | World Small Animal Veterinary Association Global Guidelines |
| **Organisation** | WSAVA — World Small Animal Veterinary Association |
| **Classification** | `GUIDELINE` |
| **Oyen usage** | `DESIGN` |
| **URL** | https://wsava.org/global-guidelines/ |
| **Vaccination guidelines (2024)** | https://onlinelibrary.wiley.com/doi/10.1111/jsap.13718 |

**Scope:** WSAVA guidelines cover companion animal veterinary best practices
of global relevance. Key guideline domains include: vaccination, nutrition,
pain recognition and management, dental care, antimicrobial stewardship,
animal welfare, senior care, diagnostic imaging, and preventive healthcare.
`[SOURCE-DERIVED]`

**What Oyen used it for:**
- The WSAVA Vaccination Guidelines Group (VGG) categorisation of vaccines into
  **core** (all dogs/cats regardless of circumstances), **non-core**
  (lifestyle-dependent), and **not recommended** informed the `vaccination_category`
  field in Oyen's vaccine concept design. `[OYEN-DECISION]` `[SOURCE-DERIVED]`
- The WSAVA guideline domain list (vaccination, nutrition, pain, dental,
  antimicrobial stewardship, wellness) validated and shaped the categories used
  in Oyen's procedure and encounter type models.
- WSAVA's emphasis that guidelines from a developed country may not directly
  apply to developing countries confirmed the need for Oyen to flag which
  guidelines were used as a reference when recording clinical decisions.

**Licensing / copyright:** WSAVA guidelines are freely accessible for
download and reference. They are copyright of WSAVA and the respective
guideline group authors. Oyen does not copy guideline text. Oyen references
the guideline source (and version year) as metadata on concepts and encounters
where relevant. `[OYEN-DECISION]`

---

### 3.2 AAHA Guidelines

| Property | Value |
|----------|-------|
| **Full name** | American Animal Hospital Association Guidelines |
| **Organisation** | AAHA — American Animal Hospital Association |
| **Classification** | `GUIDELINE` |
| **Oyen usage** | `DESIGN` |
| **URL** | https://www.aaha.org/for-veterinary-professionals/aaha-guidelines/ |

**Scope:** AAHA produces clinical practice guidelines for companion animal
medicine, primarily targeting North American practice. Relevant guidelines
include the AAHA-AVMA Preventive Healthcare Guidelines, Life Stage Guidelines
(canine and feline), Senior Care Guidelines (2023), Pain Management, Anesthesia,
Diabetes Management, and Dental Care. `[SOURCE-DERIVED]`

**What Oyen used it for:**
- The AAHA life-stage model (puppy/kitten, adult, senior, geriatric) informed
  the `life_stage_applicability` design consideration in Oyen's clinical
  knowledge layer.
- AAHA's concept of annual (or more frequent) wellness examinations with
  systematic assessment (diagnostics, pain, nutrition, dentistry, behavior)
  confirmed the multi-domain encounter model in `VETERINARY_MEDICAL_RECORD.md`.
- AAHA procedure taxonomy (diagnostics, therapeutics, preventive care,
  anesthesia, dental) cross-validated Oyen's procedure category design.

**Licensing / copyright:** AAHA guidelines are copyright AAHA. Oyen references
them for design decisions only; no content is reproduced. `[OYEN-DECISION]`

---

## 4. Tier 3 — Veterinary Reference

### 4.1 Merck Veterinary Manual (MVM)

| Property | Value |
|----------|-------|
| **Full name** | Merck Veterinary Manual / MSD Veterinary Manual |
| **Organisation** | Merck & Co., Inc. / MSD Animal Health |
| **Classification** | `REFERENCE` |
| **Oyen usage** | `DESIGN` |
| **URL** | https://www.merckvetmanual.com/ |

**Scope:** The MVM is one of the most comprehensive authoritative veterinary
references, covering disorders by body system and special topics. Roughly half
is organised by anatomic system; the other half covers special disciplines such
as behaviour, toxicology, management, and nutrition. Over 60 years of
publication history. `[SOURCE-DERIVED]`

**Body-system taxonomy (as referenced for design):** The MVM's system-based
organisation (cardiovascular, digestive, endocrine, reproductive, respiratory,
urinary, musculoskeletal, nervous system, ophthalmic, dermatological, immune /
hematologic, infectious, parasitic, behavioral, nutritional, toxicological,
generalized/multisystem) directly informed the **body system** axis of Oyen's
veterinary concept model. `[OYEN-DECISION]` `[SOURCE-DERIVED]`

**Licensing / copyright:** The MVM is copyright Merck & Co., Inc. It is freely
browsable online for reference purposes. Oyen does not copy MVM content; it
uses the taxonomic structure as a design input. `[OYEN-DECISION]`

---

## 5. Ingestion and Import Strategy

### 5.1 Oyen's own concept ID is primary

`[OYEN-DECISION]` Every veterinary concept in Oyen (diagnosis, clinical
finding, procedure, medication, vaccine type, etc.) is assigned a stable UUID
generated by Oyen's own system. This UUID is the primary key used in all
internal records, medical encounters, and foreign-key references.

External terminology codes (SNOMED SCTIDs, ICD-10-vet codes, etc.) are stored
as **optional, non-primary mappings** on the concept. The absence of a mapping
does not prevent the concept from being used.

This design means:
- Oyen does not depend on holding a SNOMED license to operate the veterinary
  master.
- Mappings can be added, corrected, or removed at any time without changing
  the primary concept records.
- Future interoperability with external systems (veterinary EMRs, government
  disease-surveillance APIs, international health certificates) can be achieved
  by querying the mapping layer.

### 5.2 Concept import/authoring workflow

When the veterinary master is implemented, concepts will be introduced through
one of these paths:

| Path | Description |
|------|-------------|
| **Curated seed** | A controlled set of high-priority concepts created by Oyen with veterinary expertise, seeded at launch |
| **Veterinary reviewer import** | A batch import from an authoritative source, reviewed by a veterinarian, then approved and versioned before activation |
| **Clinician-proposed** | A veterinarian using the platform proposes a new concept; it enters a `PENDING_REVIEW` state until approved by an Oyen veterinary reviewer |
| **Admin management** | Internal Oyen admins with `veterinary.admin` permission manage the master, including activation/deprecation |

No concept becomes active without an explicit approval step. No concept is
ever hard-deleted once it has been referenced in a medical record (see §5.4).

### 5.3 Deduplication strategy

Before a concept is approved, the reviewer must verify that no equivalent or
near-equivalent concept already exists. Tools to support this:
- Full-text search against existing canonical names and synonyms
- Species filter (a dog concept and a cat concept for the same clinical entity
  are distinct)
- External code cross-reference (if an incoming concept maps to the same SCTID
  as an existing concept, flag as potential duplicate)

After deduplication review, if two existing concepts are found to represent the
same clinical entity, they are merged by:
1. Designating one as the canonical concept (the survivor).
2. Marking the other as `DEPRECATED` with `replaced_by_concept_id` pointing to
   the survivor.
3. All future lookups redirect to the survivor.
4. Historical medical records that referenced the deprecated concept are NOT
   rewritten; they retain their original concept_id but the display layer can
   resolve the replacement relationship for informational purposes.

### 5.4 Terminology versioning

`[OYEN-DECISION]` Oyen maintains an explicit `vet_terminology_version` record.
Each time the Oyen veterinary terminology is published (e.g. after a batch
import or a set of concept approvals), a new version snapshot is created:

```
vet_terminology_version
├── version_code        (e.g. "OYEN-VET-2026-Q4")
├── published_at        (TIMESTAMPTZ)
├── description
├── external_source_ref (optional: e.g. "VetSCT RF2 2026-09")
└── is_current          (only one version is current at a time)
```

Medical encounters and diagnosis records store the `vet_terminology_version`
code active at the time of recording. This ensures that even if a concept is
later renamed or deprecated, the historical record preserves the version under
which it was created.

### 5.5 Deprecation and replacement

A concept is never hard-deleted once referenced in a medical record.
Deprecation workflow:

1. Set concept `status = DEPRECATED`.
2. Set `deprecated_at`, `deprecated_reason`.
3. Optionally set `replaced_by_concept_id` (must reference an active concept
   of the same `concept_type`).
4. The concept no longer appears in search results for new clinical entries.
5. Historical records retaining the deprecated `concept_id` remain valid and
   readable; the display layer shows the concept's `name_snapshot` (recorded
   at the time of the encounter) alongside a note that the concept has since
   been superseded.

### 5.6 Update cycle

| Event | Action |
|-------|--------|
| New WSAVA or AAHA guideline published | Oyen veterinary reviewer assesses impact; updates relevant concept `clinical_guideline_ref` fields; creates new `vet_terminology_version` if concepts were modified |
| New VetSCT/SNOMED CT release | Oyen reviewer checks for new/inactivated SCTIDs in mapping layer; updates mappings; creates new version |
| New disease emerges (e.g. novel pathogen) | Clinician-proposed or admin-created concept; reviewed and approved before activation |
| Concept renamed by authoritative source | Old name added as synonym; canonical name updated; version bumped |

---

## 6. Provenance and Attribution Requirements

Every concept in the Oyen veterinary master must record:

| Field | Purpose |
|-------|---------|
| `source_type` | Who introduced this concept: `OYEN_CURATED`, `VETERINARY_IMPORT`, `CLINICIAN_PROPOSED` |
| `source_reference` | Free-text reference to the authoritative source (e.g. "WSAVA VGG 2024", "VetSCT RF2 2026-09", "Merck Veterinary Manual") |
| `source_external_code` | Optional external code from the source (e.g. SCTID) |
| `created_by` | UUID of the Oyen staff member who created/approved the concept |
| `reviewed_by` | UUID of the veterinary reviewer who approved it |
| `vet_terminology_version` | Version string at time of approval |

These provenance fields are immutable after approval. Corrections create a
new concept version entry rather than mutating the original.

---

## 7. Licensing and Copyright Summary

| Source | Copyright holder | Oyen usage | Redistribution |
|--------|-----------------|------------|---------------|
| VetSCT / SNOMED CT | SNOMED International + Virginia Tech | Mapping only (optional) | **Not permitted** without IHTSDO Affiliate License |
| WSAVA Guidelines | WSAVA and contributing authors | Design reference only | **Not permitted** |
| AAHA Guidelines | AAHA | Design reference only | **Not permitted** |
| Merck Veterinary Manual | Merck & Co., Inc. | Taxonomy reference only | **Not permitted** |

**Action required before production launch:** Oyen legal/commercial team should
confirm the IHTSDO Affiliate License position for Indonesia before storing any
SNOMED SCTIDs in the system, even as non-displayed internal mappings. If
licensing is not feasible at launch, the mapping fields can remain empty and be
populated later without any schema change.

---

*Document classification: Source-derived facts are tagged `[SOURCE-DERIVED]`.
Oyen architectural decisions are tagged `[OYEN-DECISION]`.
Reasonable inferences are tagged `[INFERRED]`.*

*This document does not reproduce copyrighted content from any source listed above.*
