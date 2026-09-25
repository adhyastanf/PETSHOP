# Oyen — Veterinary Procedure Master

**Status:** Canonical procedure taxonomy for the Oyen Veterinary Medical Master.
**Companion documents:**
- `VETERINARY_MEDICAL_MASTER.md` — full concept model, architecture decision record
- `VETERINARY_TERMINOLOGY.md` — naming, language, species, versioning
- `VETERINARY_DATA_SOURCES.md` — sources, licensing, ingestion strategy
- `VETERINARY_MEDICAL_RECORD.md` — how procedures are recorded in patient encounters

**Classification tags:**
- `[SOURCE-DERIVED]` — fact from an authoritative external source
- `[OYEN-DECISION]` — Oyen architectural or product decision
- `[INFERRED]` — reasonable inference; not a direct source quote

**Implementation status: PROCEDURE MASTER IMPLEMENTED (V5/V6) — patient procedure-recording workflow is FUTURE.**
The `vet_procedure`, `vet_procedure_name`, and `vet_procedure_species` reference tables,
JPA entities, and repositories are implemented in migration V5. The tables that record
procedures performed on specific patients (`vet_encounter_procedure`, etc.) remain
future-phase work and are not created here.

---

## 1. Why Procedures Are a Separate Model

Procedures (clinical interventions) and diagnoses (clinical conditions) are
fundamentally different kinds of entities and must never be combined in a
single generic concept table. `[OYEN-DECISION]`

| Aspect | Diagnosis / condition | Procedure |
|---|---|---|
| Nature | A state of the patient | An action performed on the patient |
| Examples | Diabetes mellitus, fracture | Blood glucose test, fracture repair |
| Temporal nature | Has onset, duration, resolution | Has a discrete start/end time |
| Authorship | Clinician's assessment | Clinician's or staff's action |
| Outcome | Managed, resolved, recurrent | Completed, abandoned, in-progress |
| Relationship to diagnosis | Diagnosis may prompt procedures | Procedure may generate findings used to confirm/refute a diagnosis |

The SNOMED CT hierarchy makes the same fundamental distinction: "Clinical
finding" and "Procedure" are separate top-level concept hierarchies.
`[SOURCE-DERIVED]`

---

## 2. Procedure Concept Structure

Every procedure in Oyen's master has `concept_type = PROCEDURE` in
`vet_concept`, with an additional procedure-specific sub-type field:

```
vet_procedure_concept (view/extension of vet_concept where concept_type = PROCEDURE)
├── concept_id (FK → vet_concept)
├── procedure_category (ENUM)       ← see §3 for taxonomy
├── procedure_subcategory (VARCHAR) ← free-text or structured sub-classification
├── body_region_concept_id (FK → vet_concept of type BODY_STRUCTURE, nullable)
├── requires_anaesthesia (BOOLEAN)  ← informational; actual use recorded in encounter
├── requires_veterinarian (BOOLEAN) ← true if a licensed vet must perform/supervise
├── typical_duration_minutes (INT)  ← informational reference only; not enforced
├── specimen_type (TEXT)            ← for diagnostic procedures: e.g. "whole blood", "urine"
├── equipment_note (TEXT)           ← informational note on typical equipment/instrument
└── clinical_guideline_ref (TEXT)   ← e.g. "AAHA Anesthesia Guidelines 2020"
```

All fields above are implemented in migration V5 as the `vet_procedure` table.

---

## 3. Procedure Category Taxonomy

`[OYEN-DECISION]` The following top-level categories are informed by the WSAVA
global guideline domains, the AAHA guideline topics, and the Merck Veterinary
Manual special-topics organisation. `[SOURCE-DERIVED]`

### 3.1 EXAMINATION — Physical and clinical assessment

| Sub-type | Description |
|---|---|
| `PHYSICAL_EXAMINATION` | Full body or system-specific physical examination |
| `OPHTHALMIC_EXAMINATION` | Ophthalmic assessment including tonometry, fundoscopy |
| `DERMATOLOGICAL_EXAMINATION` | Skin, coat, ear examination |
| `NEUROLOGICAL_EXAMINATION` | Neurological assessment, reflexes, cranial nerves |
| `ORTHOPAEDIC_EXAMINATION` | Gait assessment, joint palpation, range of motion |
| `DENTAL_EXAMINATION` | Oral/dental inspection, periodontal probing |
| `CARDIAC_EXAMINATION` | Auscultation, murmur grading |
| `WELLNESS_EXAMINATION` | Routine preventive-care check-up |
| `TRIAGE_ASSESSMENT` | Emergency triage evaluation |

### 3.2 DIAGNOSTIC_TEST — Laboratory and diagnostic testing

| Sub-type | Description |
|---|---|
| `COMPLETE_BLOOD_COUNT` | CBC / haematology |
| `SERUM_BIOCHEMISTRY` | Blood chemistry panel |
| `ELECTROLYTES` | Serum electrolyte measurement |
| `URINALYSIS` | Urine analysis (dipstick, sediment, culture) |
| `FAECAL_EXAMINATION` | Faecal flotation, smear, PCR |
| `THYROID_FUNCTION` | T4, free T4, TSH measurement |
| `BLOOD_GAS_ANALYSIS` | Arterial or venous blood gas |
| `COAGULATION_PROFILE` | PT, APTT, fibrinogen |
| `TITRE_TEST` | Serum antibody titre measurement |
| `SEROLOGY` | Pathogen-specific serology (e.g. FIV/FeLV, parvovirus) |
| `PCR_TEST` | Pathogen PCR |
| `CULTURE_SENSITIVITY` | Microbial culture and antibiogram |
| `CYTOLOGY` | Fine needle aspirate or impression smear cytology |
| `HISTOPATHOLOGY` | Tissue biopsy histology |
| `ALLERGY_TESTING` | Intradermal or serum allergy testing |
| `POINT_OF_CARE_TEST` | Rapid in-clinic test (e.g. snap test for heartworm, parvovirus) |
| `GLUCOSE_MONITORING` | Blood glucose curve, continuous glucose monitoring |
| `BLOOD_PRESSURE` | Systolic/diastolic blood pressure measurement |
| `TONOMETRY` | Intraocular pressure measurement |

### 3.3 IMAGING — Diagnostic imaging

| Sub-type | Description |
|---|---|
| `RADIOGRAPHY` | Plain radiograph (X-ray) |
| `ULTRASOUND` | Abdominal, cardiac (echocardiography), or targeted ultrasound |
| `ECHOCARDIOGRAPHY` | Cardiac ultrasound with Doppler |
| `CT_SCAN` | Computed tomography |
| `MRI` | Magnetic resonance imaging |
| `FLUOROSCOPY` | Dynamic radiographic imaging |
| `ENDOSCOPY_IMAGING` | Imaging as part of endoscopy procedure |
| `DENTAL_RADIOGRAPHY` | Intraoral dental X-ray |

### 3.4 PREVENTIVE_PROCEDURE — Preventive care interventions

| Sub-type | Description |
|---|---|
| `VACCINATION` | Administration of a vaccine (links to a VACCINE concept) |
| `PARASITE_PREVENTION` | Topical, oral, or injectable preventive treatment |
| `DENTAL_PROPHYLAXIS` | Professional dental cleaning under anaesthesia |
| `NUTRITIONAL_COUNSELLING` | Dietary assessment and recommendation |
| `WEIGHT_MANAGEMENT` | Weight monitoring and management plan |
| `MICROCHIPPING` | Implantation of identification microchip |
| `DESEXING` | Spay or castration |
| `WELLNESS_BLOOD_PANEL` | Routine preventive haematology/biochemistry |

### 3.5 THERAPEUTIC_PROCEDURE — Medical management and treatment

| Sub-type | Description |
|---|---|
| `MEDICATION_ADMINISTRATION` | Administration of a medication (IV, IM, SC, oral, topical) |
| `FLUID_THERAPY` | IV or SC fluid administration |
| `BLOOD_TRANSFUSION` | Whole blood or component transfusion |
| `WOUND_MANAGEMENT` | Wound cleaning, debridement, dressing |
| `BANDAGING_CASTING` | Bandage, splint, or cast application |
| `NEBULISATION` | Inhalation therapy |
| `OXYGEN_THERAPY` | Supplemental oxygen delivery |
| `PAIN_MANAGEMENT` | Multimodal analgesia protocol |
| `PHYSIOTHERAPY` | Rehabilitation exercise and physical therapy |
| `ACUPUNCTURE` | Veterinary acupuncture |
| `LASER_THERAPY` | Low-level laser / photobiomodulation therapy |
| `DIALYSIS` | Peritoneal or haemodialysis |

### 3.6 SURGICAL_PROCEDURE — Surgery and invasive interventions

| Sub-type | Description |
|---|---|
| `SOFT_TISSUE_SURGERY` | General soft tissue surgical intervention |
| `ORTHOPAEDIC_SURGERY` | Bone/joint surgical repair (fracture repair, TPLO, etc.) |
| `NEUROSURGERY` | Spinal decompression, cranial surgery |
| `OPHTHALMIC_SURGERY` | Eye surgery (cataract extraction, enucleation, etc.) |
| `DENTAL_SURGERY` | Tooth extraction, oral surgery under anaesthesia |
| `ONCOLOGICAL_SURGERY` | Tumour excision or debulking |
| `ABDOMINAL_SURGERY` | Laparotomy, GI surgery, splenectomy, etc. |
| `THORACIC_SURGERY` | Chest surgery, pericardectomy, lobectomy |
| `REPRODUCTIVE_SURGERY` | Caesarean section, ovariohysterectomy, castration |
| `MINIMALLY_INVASIVE_SURGERY` | Laparoscopy, thoracoscopy |
| `BIOPSY_EXCISION` | Tissue removal for histopathology |
| `ABSCESS_DRAINAGE` | Incision and drainage |
| `MASS_REMOVAL` | Excision of skin mass or superficial growth |

### 3.7 ANAESTHESIA — Anaesthesia and sedation

| Sub-type | Description |
|---|---|
| `GENERAL_ANAESTHESIA` | Full inhalant or injectable general anaesthesia |
| `SEDATION` | Chemical restraint below full anaesthesia |
| `LOCAL_ANAESTHESIA` | Local or regional nerve block |
| `ANAESTHETIC_MONITORING` | Monitoring protocol during anaesthesia |

### 3.8 HOSPITALISATION — In-patient and critical care

| Sub-type | Description |
|---|---|
| `HOSPITALISATION` | Planned or emergency in-patient stay |
| `INTENSIVE_CARE` | Critical care monitoring and intensive support |
| `ISOLATION_CARE` | Infectious disease isolation protocol |
| `CAGE_REST` | Enforced rest/restricted activity |

### 3.9 DENTAL_PROCEDURE — Detailed dental procedures

| Sub-type | Description |
|---|---|
| `DENTAL_SCALING` | Ultrasonic or hand scaling of calculus |
| `DENTAL_POLISHING` | Post-scaling polishing |
| `TOOTH_EXTRACTION` | Simple or surgical extraction |
| `ROOT_CANAL` | Endodontic treatment |
| `DENTAL_RESTORATION` | Crown repair or composite restoration |
| `ORAL_MASS_EXCISION` | Removal of oral tumour or growth |

### 3.10 EUTHANASIA — End-of-life procedure

| Sub-type | Description |
|---|---|
| `EUTHANASIA` | Humane euthanasia |

This sub-type is included for completeness of the medical record timeline.
It carries heightened sensitivity requirements in the UI layer (see
`VETERINARY_MEDICAL_RECORD.md` §10).

---

## 4. Procedure Concept and Service Category Relationship

`[OYEN-DECISION]` There are two separate concepts that must not be confused:

| Concept | Table | Purpose |
|---|---|---|
| **Service category** | `service_categories` (existing) | What service a merchant offers for booking (Vaccination, Grooming, Dental Care, Veterinary Consultation) |
| **Procedure concept** | `vet_procedure_concept` (future) | What clinical action was performed in a medical encounter |

A booking for "Vaccination" (service category) generates a medical encounter
that records one or more `VACCINATION` procedure concepts (e.g. "Rabies
vaccination — intramuscular") against a specific VACCINE concept.

A booking for "Veterinary Consultation" may generate an encounter with multiple
procedure concepts: `PHYSICAL_EXAMINATION`, `BLOOD_PRESSURE`, and
`SERUM_BIOCHEMISTRY`.

The mapping is **one service booking → one encounter → N procedure records**.
The service category is the commerce layer; the procedure concept is the
clinical layer. They are linked through the encounter, not through a foreign
key between the two master tables.

---

## 5. Procedure Complexity and Staffing Rules

`[OYEN-DECISION]` The `requires_veterinarian` field on a procedure concept
indicates whether a licensed veterinarian must perform or directly supervise the
procedure. This is an informational reference field derived from regulatory and
clinical standards; it mirrors and extends the existing `services.requires_verified_veterinarian`
flag on the Oyen service entity.

Examples:
- `VACCINATION` — requires_veterinarian: true (in most Indonesian regulatory contexts)
- `DENTAL_SCALING` — requires_veterinarian: true (performed under anaesthesia)
- `WOUND_MANAGEMENT` (simple) — requires_veterinarian: false (may be performed
  by trained nurse/technician under supervision)

The `requires_veterinarian` field on the procedure concept is a platform-level
reference. The authoritative enforcement remains in the booking/service layer
(Services & Scheduling, Phase 6), where `services.requires_verified_veterinarian`
controls whether a booking can be confirmed without a verified veterinarian.

---

## 6. Procedure Observable Entities (Measurements and Results)

`[OYEN-DECISION]` Some procedures produce numeric or coded results that are
recorded as **observable entities** in the medical record. Observable entities
are a related but distinct concept type (`OBSERVABLE_ENTITY`).

Examples:

| Procedure concept | Observable entity recorded |
|---|---|
| Blood pressure measurement | Systolic blood pressure (mmHg) |
| Complete blood count | RBC count, haematocrit, WBC differential |
| Serum biochemistry | Creatinine, BUN, ALT, glucose, albumin |
| Urinalysis | Urine specific gravity, protein, glucose, sediment |
| Echocardiography | Left ventricular wall thickness, LA:Ao ratio |
| Blood glucose monitoring | Blood glucose (mmol/L or mg/dL) |
| Body weight measurement | Weight (kg) |

The `OBSERVABLE_ENTITY` concept type stores the definition of the measurement
parameter (what it is, what unit, normal reference range if species-specific).
The actual measured value is stored in the patient's medical encounter record
(`vet_lab_result` or `vet_vital_sign` — see `VETERINARY_MEDICAL_RECORD.md`).

---

## 7. Procedure Hierarchy Examples

Procedures support the same lightweight IS_A hierarchy as other concepts
(`vet_concept_relationship`). Example structure (not an exhaustive list):

```
Diagnostic test
├── Laboratory test
│   ├── Haematology
│   │   └── Complete blood count
│   ├── Clinical chemistry
│   │   └── Serum biochemistry panel
│   └── Microbiology
│       └── Culture and sensitivity
└── Imaging
    ├── Radiography
    │   └── Thoracic radiography
    └── Ultrasound
        └── Abdominal ultrasound

Preventive procedure
├── Vaccination
│   ├── Rabies vaccination
│   └── Core feline vaccine (FPV/FHV-1/FCV)
└── Parasite prevention

Surgery
├── Soft tissue surgery
│   └── Intestinal resection and anastomosis
└── Orthopaedic surgery
    └── Tibial plateau levelling osteotomy (TPLO)
```

The hierarchy enables search expansion (searching "Surgery" returns all surgical
sub-procedures) and reporting roll-ups (aggregate encounters by procedure
category).

---

## 8. Vaccination Sub-procedures and the WSAVA Core/Non-core Classification

When vaccination procedures are recorded, they link to both a procedure concept
(`VACCINATION` sub-type) and a vaccine concept (`VACCINE` type in
`vet_vaccine_concept`). The vaccine concept carries the WSAVA
core/non-core classification. `[SOURCE-DERIVED]` `[OYEN-DECISION]`

Example link chain:
```
Encounter procedure record
├── procedure_concept_id → PROC-VAC-001 ("Vaccination, intramuscular")
├── vaccine_concept_id   → VAX-INF-001 ("Canine rabies vaccine")
│                          └── vaccine_category: CORE
│                          └── disease_prevented → DIAG-INF-001 ("Rabies")
├── dose_number         : 1
├── batch_number        : (recorded at encounter time)
└── next_due_date       : (recorded by attending veterinarian)
```

The `next_due_date` is always authored by the attending veterinarian based on
their clinical assessment. It is not auto-calculated from the vaccine concept's
`typical_booster_interval`. The typical interval is reference information only.
`[OYEN-DECISION]`

---

## 9. Procedure Data Integrity Rules

| Rule | Description |
|---|---|
| Procedures are never hard-deleted once referenced | Same rule as all vet_concept entries |
| `procedure_category` is immutable after activation | Changing category would invalidate historical encounter records that depend on it for filtering |
| `requires_veterinarian` changes trigger a version bump | A change to this flag may affect booking eligibility; it must be versioned |
| Procedure concepts with `concept_type = PROCEDURE` are excluded from diagnosis dropdowns | UI filtering prevents misuse in clinical forms |
| `EUTHANASIA` sub-type requires explicit authorisation to display | Sensitive procedure; UI must handle with appropriate care |

---

## 10. Future Extensibility

The procedure taxonomy is designed to be extended without schema redesign:

- New sub-types are added as new concept rows with appropriate `procedure_category`
  and `procedure_subcategory` values.
- New `procedure_category` values require an update to the ENUM type (a schema
  migration) and a review of the taxonomy. This is expected to be infrequent.
- Specialist disciplines not currently covered (oncology-specific procedures,
  exotic-animal procedures, rehabilitation specialties) can be added as new
  sub-types or categories in future updates to the master.
