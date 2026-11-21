# Oyen — Veterinary Medical Record Model

**Status:** Canonical design for the longitudinal pet medical record.
**Companion documents:**
- `VETERINARY_MEDICAL_MASTER.md` — terminology and concept model (layer 1)
- `VETERINARY_TERMINOLOGY.md` — naming, versioning, lifecycle
- `VETERINARY_PROCEDURES.md` — procedure taxonomy (layer 1)
- `VETERINARY_DATA_SOURCES.md` — sources, licensing, ingestion

**Classification tags:**
- `[SOURCE-DERIVED]` — fact from an authoritative external source
- `[OYEN-DECISION]` — Oyen architectural or product decision
- `[INFERRED]` — reasonable inference; not a direct source quote

**Implementation status: FUTURE — no code, entities, or migrations exist today.**
This document defines the target design for a future implementation phase.

---

## 1. What the Medical Record Is

The medical record is the patient-specific history of what actually happened to
a specific pet over its lifetime. It is distinct from both the terminology master
(what concepts exist) and the clinical knowledge layer (what is known about a
concept in general).

```
Terminology Master (layer 1) — "Diabetes mellitus (feline) exists as a concept"
Clinical Knowledge (layer 2) — "Diabetes mellitus in cats is typically managed with insulin"
Medical Record (layer 3)     — "Mochi the cat was diagnosed with diabetes mellitus on
                                  2026-03-14 by Dr. Sari, and started on insulin therapy"
```

The medical record never modifies the terminology master. The terminology master
never auto-populates the medical record. `[OYEN-DECISION]`

---

## 2. Longitudinal Timeline Model

Every pet has a **medical timeline** — an ordered sequence of clinical events
over its lifetime. The timeline is the primary lens through which a veterinarian
or pet owner views the pet's health history.

```
Pet
└── Medical Timeline
    ├── Encounter 1 (wellness visit, 2025-01-10)
    │   ├── Vital signs
    │   ├── Physical exam findings
    │   ├── Procedures: Wellness examination, CBC, Vaccination (Rabies)
    │   └── Plan: Follow-up in 12 months
    │
    ├── Encounter 2 (sick visit, 2025-06-03)
    │   ├── Reason for visit: vomiting, lethargy
    │   ├── Vital signs
    │   ├── Clinical findings: dehydration, abdominal pain
    │   ├── Differential diagnoses: GI obstruction, pancreatitis, haemorrhagic gastroenteritis
    │   ├── Procedures: Abdominal ultrasound, Serum biochemistry
    │   ├── Confirmed diagnosis: Pancreatitis (acute, moderate)
    │   ├── Medications: IV fluids, antiemetic
    │   └── Follow-up: Recheck in 5 days
    │
    ├── Encounter 3 (recheck, 2025-06-08)
    │   └── ...
    │
    ├── Documents (certificates, lab reports, imaging files)
    │
    └── Follow-up reminders
```

---

## 3. The Medical Encounter

The encounter is the atomic unit of the medical record. Every clinical
interaction between a veterinarian (or supervised clinical staff) and a pet
constitutes an encounter.

```
vet_encounter
├── id (UUID)
├── pet_id (FK → pets)
├── encounter_number (VARCHAR, unique)       ← human-readable reference, e.g. "ENC-2026-001234"
├── encounter_type (ENUM)                    ← see §3.1
├── encounter_status (ENUM)                  ← see §3.2
├── merchant_id (FK → merchants)             ← the clinic/merchant
├── branch_id (FK → merchant_branches)       ← the specific branch
├── attending_vet_staff_id (FK → merchant_staff)  ← the veterinarian of record
├── booking_id (FK → bookings, nullable)     ← originating booking if applicable
├── encounter_date (DATE)
├── encounter_start_at (TIMESTAMPTZ)
├── encounter_end_at (TIMESTAMPTZ, nullable)
├── chief_complaint (TEXT)                   ← owner's stated reason for visit
├── history_notes (TEXT)                     ← relevant history taken at visit
├── overall_assessment (TEXT)               ← attending vet's written assessment
├── plan_notes (TEXT)                        ← written treatment/follow-up plan
├── created_at (TIMESTAMPTZ)
├── created_by (UUID FK → users)
├── last_updated_by (UUID FK → users)
├── vet_terminology_version (FK)             ← master version at time of encounter
└── is_locked (BOOLEAN)                      ← see §9 (immutability after lock)
```

### 3.1 Encounter types

| encounter_type | Description |
|---|---|
| `WELLNESS` | Routine preventive-care check-up; no acute illness |
| `SICK_VISIT` | Acute illness or injury presentation |
| `RECHECK` | Follow-up after a prior sick visit or surgery |
| `VACCINATION_ONLY` | Visit solely for vaccination administration |
| `PROCEDURE_ONLY` | Visit for a specific scheduled procedure (e.g. dental clean) |
| `EMERGENCY` | Emergency presentation |
| `TELEMEDICINE` | Remote consultation (future capability) |
| `SECOND_OPINION` | Visit for a second clinical opinion |
| `REFERRAL` | Specialist referral visit |
| `EUTHANASIA` | End-of-life encounter |

### 3.2 Encounter status

| encounter_status | Description |
|---|---|
| `SCHEDULED` | Encounter is booked/planned; clinical record not yet open |
| `IN_PROGRESS` | Encounter is active; clinician is recording |
| `COMPLETED` | Encounter is clinically complete; pending lock |
| `LOCKED` | Record is locked; no further edits except addendum |
| `CANCELLED` | Scheduled encounter that did not occur |

---

## 4. Vital Signs

Vital signs are recorded per encounter and form an important longitudinal
dataset for chronic disease management and wellness monitoring.

```
vet_vital_signs
├── id (UUID)
├── encounter_id (FK → vet_encounter)
├── measured_at (TIMESTAMPTZ)
├── measured_by (UUID FK → users)
├── body_weight_kg (NUMERIC 7,3)
├── body_temperature_celsius (NUMERIC 4,1)
├── heart_rate_bpm (INTEGER)
├── respiratory_rate_rpm (INTEGER)
├── systolic_bp_mmhg (INTEGER, nullable)
├── diastolic_bp_mmhg (INTEGER, nullable)
├── mucous_membrane_colour (TEXT)         ← e.g. "pink", "pale", "icteric"
├── capillary_refill_time_seconds (NUMERIC 3,1)
├── pain_score (SMALLINT, nullable)       ← using a validated scale (e.g. CMPS-SF)
├── body_condition_score (NUMERIC 3,1)    ← BCS 1-9 scale
├── muscle_condition_score (TEXT)         ← MCS: Normal / Mild / Moderate / Severe wasting
└── notes (TEXT)
```

`[OYEN-DECISION]` Vital signs are always recorded against an encounter, not
free-floating against a pet. This ensures the clinical context (who measured,
when, under what circumstances) is always preserved.

---

## 5. Clinical Findings

Clinical findings record what the veterinarian observes during examination.
They reference master concepts of type `CLINICAL_FINDING`, `SIGN`, or
`SYMPTOM`.

```
vet_encounter_finding
├── id (UUID)
├── encounter_id (FK → vet_encounter)
├── finding_concept_id (FK → vet_concept)  ← must be CLINICAL_FINDING | SIGN | SYMPTOM type
├── finding_name_snapshot (TEXT)            ← concept canonical name at time of recording
├── body_region_concept_id (FK → vet_concept of BODY_STRUCTURE type, nullable)
├── severity (ENUM)                         ← MILD | MODERATE | SEVERE
├── finding_status (ENUM)                   ← PRESENT | ABSENT | UNKNOWN
├── notes (TEXT)
├── recorded_at (TIMESTAMPTZ)
└── recorded_by (UUID FK → users)
```

The `finding_name_snapshot` captures the concept's canonical name at the time
of recording. If the concept is later renamed, the snapshot preserves the
original clinical meaning. `[OYEN-DECISION]`

---

## 6. Diagnoses

Diagnoses are the veterinarian's clinical assessment of the patient's condition.
They reference master concepts of type `DISEASE`, `SYNDROME`, `INJURY`,
`NEOPLASM`, `CONGENITAL_CONDITION`, or other diagnosis-type concepts.

```
vet_encounter_diagnosis
├── id (UUID)
├── encounter_id (FK → vet_encounter)
├── diagnosis_concept_id (FK → vet_concept)  ← diagnosis-type concepts only
├── diagnosis_name_snapshot (TEXT)            ← name at time of recording
├── terminology_version_snapshot (TEXT)       ← version_code at time of recording
├── certainty (ENUM)                          ← CONFIRMED | SUSPECTED | DIFFERENTIAL | RULED_OUT | HISTORICAL
├── chronicity (ENUM)                         ← ACUTE | SUBACUTE | CHRONIC | RECURRENT
├── severity (ENUM)                           ← MILD | MODERATE | SEVERE | LIFE_THREATENING
├── onset_date (DATE, nullable)               ← estimated or known onset
├── resolution_date (DATE, nullable)          ← date resolved, if applicable
├── is_primary (BOOLEAN)                      ← primary diagnosis for this encounter
├── causative_agent_concept_id (FK → vet_concept of INFECTIOUS_AGENT type, nullable)
├── notes (TEXT)
├── recorded_at (TIMESTAMPTZ)
└── recorded_by (UUID FK → users)             ← must be a verified veterinarian
```

### 6.1 Critical rules for diagnosis records

`[OYEN-DECISION]`

1. Only a **verified veterinarian** (`VeterinarianProfile.verification_status =
   VERIFIED`) may record a confirmed diagnosis.
2. `SUSPECTED` and `DIFFERENTIAL` diagnoses may be entered during an encounter
   by the attending vet; they do not require confirmation until the final
   assessment.
3. `RULED_OUT` diagnoses are retained in the record — they are part of the
   clinical reasoning trail and must not be deleted.
4. The `diagnosis_name_snapshot` and `terminology_version_snapshot` fields are
   immutable once set. They record the clinical meaning at the time of the
   diagnosis.
5. A diagnosis is never deleted. If entered in error, it is voided with an
   `ERROR_VOIDED` status and an addendum explaining the error — it remains
   visible in the audit trail.

---

## 7. Procedures Performed

Each clinical intervention performed during an encounter is recorded as an
encounter procedure record.

```
vet_encounter_procedure
├── id (UUID)
├── encounter_id (FK → vet_encounter)
├── procedure_concept_id (FK → vet_concept of PROCEDURE type)
├── procedure_name_snapshot (TEXT)            ← name at time of recording
├── performed_at (TIMESTAMPTZ)
├── performed_by (UUID FK → users)
├── status (ENUM)                             ← PERFORMED | DECLINED | NOT_COMPLETED | PLANNED
├── body_region_concept_id (FK → vet_concept of BODY_STRUCTURE type, nullable)
├── laterality (ENUM)                         ← LEFT | RIGHT | BILATERAL | NOT_APPLICABLE
├── notes (TEXT)
│
│  ── Vaccination-specific fields (when procedure_category = VACCINATION)
├── vaccine_concept_id (FK → vet_concept of VACCINE type, nullable)
├── vaccine_name_snapshot (TEXT)
├── vaccine_batch_number (VARCHAR)
├── vaccine_manufacturer (VARCHAR)
├── vaccine_expiry_date (DATE)
├── dose_number (INTEGER)                     ← 1st, 2nd, 3rd dose in series
├── next_due_date (DATE, nullable)            ← set by attending vet; not auto-calculated
│
│  ── Medication administration-specific (when applicable)
├── medication_concept_id (FK → vet_concept of MEDICATION type, nullable)
├── medication_name_snapshot (TEXT)
├── dose_amount (NUMERIC 10,3)
├── dose_unit (VARCHAR)                       ← e.g. "mg", "ml", "IU"
├── route (VARCHAR)                           ← IV | IM | SC | PO | TOPICAL | IN
│
└── created_at (TIMESTAMPTZ)
```

`[OYEN-DECISION]` Vaccination records via the encounter procedure model will
eventually supersede the current `pet_vaccinations` table. Until the full
medical record domain is implemented, `pet_vaccinations` remains the canonical
vaccination history table (Phase 2, implemented).

---

## 8. Laboratory Results

Laboratory results are numeric or coded outcomes from diagnostic tests.

```
vet_lab_result
├── id (UUID)
├── encounter_id (FK → vet_encounter)
├── test_concept_id (FK → vet_concept of PROCEDURE/DIAGNOSTIC_TEST type)
├── observable_concept_id (FK → vet_concept of OBSERVABLE_ENTITY type)
├── result_numeric (NUMERIC 12,4, nullable)
├── result_text (TEXT, nullable)             ← for coded/qualitative results
├── result_unit (VARCHAR)                    ← e.g. "mmol/L", "g/dL", "cells/μL"
├── reference_range_low (NUMERIC, nullable)
├── reference_range_high (NUMERIC, nullable)
├── interpretation (ENUM)                    ← NORMAL | LOW | HIGH | CRITICAL_LOW | CRITICAL_HIGH | ABNORMAL | PENDING
├── specimen_type (VARCHAR)                  ← e.g. "EDTA whole blood", "serum", "urine"
├── sample_collected_at (TIMESTAMPTZ)
├── result_reported_at (TIMESTAMPTZ)
├── reported_by (UUID FK → users)
├── lab_name (VARCHAR)                       ← external lab or in-house
├── lab_reference_id (VARCHAR)               ← lab's own accession/reference number
├── notes (TEXT)
└── file_id (UUID FK → files, nullable)      ← scanned lab report if available
```

---

## 9. Imaging Records

```
vet_imaging_record
├── id (UUID)
├── encounter_id (FK → vet_encounter)
├── imaging_procedure_concept_id (FK → vet_concept of IMAGING procedure type)
├── body_region_concept_id (FK → vet_concept of BODY_STRUCTURE type, nullable)
├── performed_at (TIMESTAMPTZ)
├── performed_by (UUID FK → users)
├── imaging_findings_text (TEXT)              ← radiologist/vet description
├── interpretation_text (TEXT)               ← clinical interpretation
├── file_ids (UUID[], or separate join table) ← DICOM or image files in object storage
├── external_report_file_id (UUID FK → files, nullable)
└── notes (TEXT)
```

Imaging files are stored in object storage (S3/compatible), not in PostgreSQL.
Only the metadata and object key are stored in the database. `[OYEN-DECISION]`

---

## 10. Medication Orders

Medication orders are treatment instructions issued by the veterinarian.

```
vet_medication_order
├── id (UUID)
├── encounter_id (FK → vet_encounter)
├── medication_concept_id (FK → vet_concept of MEDICATION | VACCINE type)
├── medication_name_snapshot (TEXT)
├── dose_amount (NUMERIC 10,3)
├── dose_unit (VARCHAR)
├── frequency (VARCHAR)                       ← e.g. "BID", "SID", "q8h"
├── route (VARCHAR)                           ← IV | IM | SC | PO | TOPICAL | IN
├── duration_days (INTEGER, nullable)
├── start_date (DATE)
├── end_date (DATE, nullable)
├── prescribed_by (UUID FK → users)          ← must be verified veterinarian
├── dispensed (BOOLEAN)
├── dispensed_at (TIMESTAMPTZ, nullable)
├── dispensed_by (UUID FK → users, nullable)
├── instructions_for_owner (TEXT)            ← plain-language dosing instructions
└── notes (TEXT)
```

**No auto-prescribing rule (absolute):** `[OYEN-DECISION]` A medication order
is NEVER automatically generated from a diagnosis concept, a clinical finding,
or any master data. Every medication order must be explicitly authored by a
verified veterinarian in the context of a specific encounter for a specific pet.

The clinical knowledge layer (layer 2) may note that a class of medication is
typically used for a condition; this is reference information for the
veterinarian's consideration only. It does not create, suggest, or pre-fill
a medication order.

---

## 11. Follow-ups and Reminders

Follow-up reminders are attached to encounters or diagnoses, driving the pet
care reminder feature (Phase 16.6).

```
vet_follow_up
├── id (UUID)
├── encounter_id (FK → vet_encounter)
├── diagnosis_id (FK → vet_encounter_diagnosis, nullable)
├── procedure_concept_id (FK → vet_concept, nullable)  ← the procedure to follow up on
├── follow_up_type (ENUM)                               ← RECHECK | VACCINATION | LAB_RETEST | MEDICATION_REVIEW | WEIGHT_CHECK | OTHER
├── due_date (DATE)                                     ← set by attending vet
├── reminder_days_before (INTEGER)                      ← how many days before due_date to send reminder
├── notes (TEXT)
├── status (ENUM)                                       ← PENDING | COMPLETED | OVERDUE | CANCELLED
└── created_by (UUID FK → users)
```

Follow-up dates are always set by the attending veterinarian. The system
delivers reminders based on `due_date` minus `reminder_days_before`, but the
dates themselves are clinical decisions. `[OYEN-DECISION]`

---

## 12. Documents and Attachments

```
vet_encounter_document
├── id (UUID)
├── encounter_id (FK → vet_encounter)
├── document_type (ENUM)              ← VACCINATION_CERTIFICATE | LAB_REPORT | IMAGING_REPORT | REFERRAL_LETTER | PRESCRIPTION | OTHER
├── file_id (FK → files)              ← object storage reference
├── description (TEXT)
├── issued_at (DATE, nullable)
└── uploaded_by (UUID FK → users)
```

---

## 13. Historical Data Integrity

This is the most critical design requirement of the medical record model.
`[OYEN-DECISION]`

### 13.1 Snapshot fields

Every record that references a master concept must also store a snapshot of
the concept's name at the time of recording:

| Record type | Snapshot field |
|---|---|
| `vet_encounter_finding` | `finding_name_snapshot` |
| `vet_encounter_diagnosis` | `diagnosis_name_snapshot`, `terminology_version_snapshot` |
| `vet_encounter_procedure` | `procedure_name_snapshot` |
| `vet_encounter_procedure` (vaccination) | `vaccine_name_snapshot` |
| `vet_medication_order` | `medication_name_snapshot` |
| `vet_lab_result` | resolved via `observable_concept_id` + `test_concept_id` + their snapshots |

If a master concept is later renamed, deprecated, or superseded, the snapshot
field preserves the clinically meaningful name at the time of the encounter.
The snapshot is set at record creation time and is **immutable**. It is never
updated to reflect later master changes.

### 13.2 Terminology version snapshot

Every encounter records the `vet_terminology_version.version_code` active at
the time of the encounter. This ensures that even when the terminology evolves,
a reader can look up the exact version in use at the time of any historical
encounter.

### 13.3 No retroactive concept migration

When a concept is deprecated and replaced:
- Future encounters reference the replacement concept.
- Historical encounter records that referenced the deprecated concept are NOT
  updated. Their `*_concept_id` fields continue to reference the deprecated
  concept.
- The deprecated concept's record remains in the system with
  `status = DEPRECATED` and `replaced_by_concept_id` pointing to the successor.
- Display: the UI may optionally show a note that the concept has been
  superseded, but the original snapshot name is always shown as the primary
  clinical text.

### 13.4 Encounter locking

Once a veterinarian marks an encounter as `COMPLETED`, it enters a
**locked** state after a configurable grace period (e.g. 24 hours).
A locked encounter (`is_locked = true`) is immutable except for:
- Addendum records (new rows in `vet_encounter_addendum`; original locked
  records are not edited)
- Administrative corrections by authorised Oyen staff with an audit trail

```
vet_encounter_addendum
├── id (UUID)
├── encounter_id (FK → vet_encounter)
├── addendum_text (TEXT)
├── reason (TEXT)
├── created_at (TIMESTAMPTZ)
└── created_by (UUID FK → users)
```

Addenda are always appended; they never overwrite the original encounter
content. The original locked encounter content must be fully preserved.

### 13.5 Voiding (not deletion)

A record entered in error (wrong pet, wrong diagnosis, etc.) is **voided**,
not deleted:

```
vet_record_void
├── id (UUID)
├── voided_record_type (VARCHAR)     ← e.g. "vet_encounter_diagnosis"
├── voided_record_id (UUID)
├── reason (TEXT)
├── voided_by (UUID FK → users)
├── voided_at (TIMESTAMPTZ)
└── supervisor_approved_by (UUID FK, nullable)
```

The voided record is flagged and excluded from clinical views but remains
in the system for audit purposes. It is **never deleted from the database**.

---

## 14. Authorship and Authorisation

`[OYEN-DECISION]`

| Record type | Who can create | Who can modify after lock |
|---|---|---|
| Encounter | Verified veterinarian or authorised clinic staff | Addendum only |
| Confirmed diagnosis | Verified veterinarian only | Addendum / void |
| Suspected / differential diagnosis | Verified vet or supervised clinician | Until encounter locked |
| Medication order | Verified veterinarian only | Addendum / void |
| Vital signs | Any authorised clinic staff | None after lock |
| Clinical finding | Any authorised clinic staff (supervised) | None after lock |
| Lab result | Lab staff or vet | None after lock |
| Imaging record | Vet or radiographer | None after lock |
| Follow-up | Verified veterinarian | Status update only |
| Document upload | Any authorised clinic staff | Not modified; new version uploaded |

**The pet owner** can view their own pet's medical record (read-only) where
the attending merchant grants access. They cannot edit any clinical record.

**Cross-merchant visibility:** By default, a pet's medical record is visible
only to the merchant who created each encounter. The pet owner may share a
record summary with a different merchant (e.g. when changing clinics). Full
cross-merchant access to another clinic's detailed notes requires explicit
owner consent — this is a future privacy/consent feature.

---

## 15. Relationship to Existing Oyen Entities

### 15.1 pet_vaccinations (existing)

The existing `pet_vaccinations` table (Phase 2, implemented and in production)
records basic vaccination history. When the veterinary medical record is
implemented:
- Existing `pet_vaccinations` records are migrated to `vet_encounter_procedure`
  rows within synthetic encounter records.
- The `vaccine_name_snapshot` preserves the original `vaccine_name_snapshot`
  from `pet_vaccinations`.
- The `pet_vaccinations` table is retained for backward compatibility during
  the transition period.
- No migration file is created today; this is a future implementation task.

### 15.2 bookings (existing)

A service booking (for a veterinary consultation, vaccination, or dental clean)
is the commercial transaction. A medical encounter is the clinical record.
The relationship is:

```
booking (1) ──► vet_encounter (0..1)
```

Not every booking generates an encounter (e.g. a grooming booking does not
require a medical encounter). A veterinary service booking (`service_categories.is_veterinary = true`)
generates exactly one encounter. The `vet_encounter.booking_id` FK records this
link.

### 15.3 VeterinarianProfile (existing)

The existing `veterinarian_profiles` table in Oyen records a staff member's
veterinary licence and verification status. The medical record model requires
that confirmed diagnoses and medication orders be authored by staff whose
`VeterinarianProfile.verification_status = VERIFIED`. This is the same
verification logic already enforced by `services.requires_verified_veterinarian`.
No new verification infrastructure is needed.

---

## 16. Pet Health Timeline — Consumer View

The pet health timeline is the owner-facing presentation of the longitudinal
medical record. It is a simplified, read-only aggregation of encounter data
presented in chronological order.

```
Pet Health Timeline (owner view)
├── Vaccination history       ← from vet_encounter_procedure where vaccination
├── Diagnosis history         ← from vet_encounter_diagnosis (CONFIRMED only for owner view)
├── Procedure history         ← from vet_encounter_procedure (non-sensitive)
├── Weight trend              ← from vet_vital_signs.body_weight_kg over time
├── Upcoming follow-ups       ← from vet_follow_up where status = PENDING
└── Documents                 ← from vet_encounter_document
```

Owner-facing rules:
- Only `CONFIRMED` diagnoses are shown to owners (not `DIFFERENTIAL` or
  `SUSPECTED` in progress).
- Medication orders are shown at the merchant's discretion (configurable).
- Sensitive encounter types (e.g. `EUTHANASIA`) are handled with appropriate
  privacy.
- Lab results and imaging are summarised; raw data is available on request.

---

## 17. Integration with Future Oyen Phases

| Phase | Integration |
|---|---|
| **Phase 6 — Services & Scheduling** | Veterinary service booking triggers encounter creation; `booking_id` links the two |
| **Phase 10 — Fulfillment** | Completed booking → encounter transitions to `COMPLETED` state; vaccination completion populates `vet_encounter_procedure` (and `pet_vaccinations` during transition) |
| **Phase 14 — Engagement** | Encounter summary surfaced in pet care history; vaccination history displayed on pet profile |
| **Phase 16.6 — Pet Care Reminders** | `vet_follow_up` records drive care reminder scheduling; `next_due_date` from vaccination procedures drives vaccination reminders |
| **Phase 16.5 — Recommendations** | Diagnosis history and preventive-care gaps inform personalized home recommendations |
| **Future EMR phase** | Full three-layer model implemented end-to-end |

---

## 18. Data Retention Policy for Medical Records

`[OYEN-DECISION]` Following the architecture decisions in
`ARCHITECTURE_DECISIONS.md`, medical records are classified as
**IMMUTABLE_HISTORY**:

- No `deleted_at` column on encounter or encounter-child records.
- No hard deletion permitted once an encounter is in `COMPLETED` or `LOCKED` status.
- Corrections via addendum and void only.
- Retention period follows applicable Indonesian veterinary/healthcare regulation
  (to be determined by Oyen legal; assume minimum 5 years as a conservative
  default pending regulatory guidance).
- After retention period, records may be archived but not deleted if any active
  follow-up or active chronic diagnosis references them.
