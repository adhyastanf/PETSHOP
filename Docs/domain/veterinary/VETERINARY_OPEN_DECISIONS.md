# Oyen — Veterinary Medical Master: Open Decisions Register

**Status:** Active decision register for the Veterinary Medical Master domain.
**Last updated:** 2026-09-09

This document records unresolved questions and decisions from the Veterinary
Medical Master design and database foundation implementation. It is a
**decision register, not an implementation blocker list**. Where the current
implementation is safe to proceed without a decision, that is noted explicitly.

Each decision follows this structure:
- **ID** — stable reference code
- **Question/Decision** — what must be decided
- **Current status** — open / in progress / decided
- **Why it matters** — impact on Oyen's architecture or operations
- **Current assumption** — what the implementation assumes today (if any)
- **Who should decide** — the appropriate decision-maker or expertise required
- **Blocks** — what future work cannot safely proceed without this decision
- **Can proceed without** — what is safe to implement now

---

## OD-001 — VetSCT / SNOMED CT Licensing in Indonesia

**Question:** Does commercial use of VetSCT/SNOMED CT terminology codes (SCTIDs)
in an Indonesian marketplace application require an IHTSDO Affiliate License, and
if so, what does it cost and how is it obtained?

**Current status:** Open — requires legal/commercial review.

**Why it matters:** Indonesia is not a current member territory of SNOMED
International. Commercial use of SNOMED CT and the VetSCT extension in
non-member territories requires an IHTSDO Affiliate License, which may carry
annual fees. Without a license, Oyen cannot legally store VetSCT SCTIDs
internally — even as non-displayed mapping fields — in a commercial product.

**Current assumption:** The `vet_concept_external_mapping` table has been
implemented with `system_code = 'SNOMEDCT_VET'` as a supported value, but
the current seed data contains **zero VetSCT SCTIDs**. The schema supports
adding SCTID mappings in future; no license is required merely for the empty
schema structure. Oyen's own UUID is the primary concept identifier at all
times — SNOMED codes are optional metadata.

**Who should decide:** Oyen legal/commercial team, with reference to:
- IHTSDO Affiliate License: https://www.snomed.org/get-snomed
- NLM licensing overview: https://www.nlm.nih.gov/healthit/snomedct/snomed_licensing.html

**Blocks:** Populating `vet_concept_external_mapping` rows with real VetSCT
SCTIDs. Until licensed, the `SNOMEDCT_VET` system_code must remain empty.

**Can proceed without:** The entire veterinary foundation (V5/V6 migrations, all
entities, repositories, and concept authoring workflow) can proceed without
this decision. The mapping schema is in place; the values are just absent
until licensed.

---

## OD-002 — Indonesian Veterinary Terminology Review

**Question:** Which Indonesian veterinary professional body or individual
expert should review the canonical Indonesian (`id`) concept names before
they are activated in the Oyen Veterinary Medical Master?

**Current status:** Open — requires identification and engagement of a
qualified reviewer.

**Why it matters:** Indonesian veterinary practice uses a mix of Dutch
loanwords, English terms, Latin/scientific names, and native Bahasa Indonesia
terms. Machine translation produces incorrect or non-standard clinical
terminology. All concepts require `id` canonical names reviewed by a licensed
Indonesian veterinarian before they may transition to `ACTIVE` status.

**Current assumption:** The schema enforces that both `en` and `id` names must
be present for a concept to be activated (enforced at the service layer per
`VETERINARY_TERMINOLOGY.md` §3.1). The seed data contains zero concept names —
this is intentional. No concept has been incorrectly translated.

**Who should decide/engage:** Oyen veterinary product lead + an Indonesian
licensed veterinarian (ideally a member of Persatuan Dokter Hewan Indonesia
/ PDHI or with relevant specialist accreditation).

**Blocks:** Transitioning any concept from `PENDING_REVIEW` to `ACTIVE`.
No clinical feature can use concepts until they are reviewed and activated.

**Can proceed without:** The database foundation, concept authoring admin
tools (future), and all structural work can proceed without this decision.

---

## OD-003 — Veterinary Medical Record Data Retention Period

**Question:** What is the minimum statutory data retention period for veterinary
medical records in Indonesia, under UU Praktik Kedokteran Hewan or equivalent
regulation?

**Current status:** Open — requires qualified legal review specific to
Indonesian veterinary law.

**Why it matters:** When the patient medical record layer (vet_encounter,
vet_encounter_diagnosis, etc.) is implemented, Oyen must comply with applicable
Indonesian regulations for medical record retention. The architecture documents
assume a conservative minimum of 5 years pending regulatory guidance.

**Current assumption:** Medical records are classified as `IMMUTABLE_HISTORY`
(append-only, no `deleted_at`, no hard delete) per `ARCHITECTURE_DECISIONS.md`.
This approach is conservative and safe regardless of the specific retention
period determined by law.

**Who should decide:** Oyen legal counsel with expertise in Indonesian
veterinary/healthcare regulation.

**Blocks:** Publishing the data-retention policy in the platform Terms of
Service (Phase 17) and in the privacy policy. Also blocks the deletion/archiving
component of any data export feature for veterinary records.

**Can proceed without:** The entire Veterinary Medical Master database
foundation (current task) and the future patient medical record implementation
can proceed without this decision. Retention enforcement is an operational
policy applied after records exist.

---

## OD-004 — Cross-Merchant Medical Record Sharing and Consent

**Question:** What explicit consent model is required under Indonesian
data-protection law (UU PDP 2022) for sharing a pet's medical records across
different veterinary merchants on the Oyen platform?

**Current status:** Open — requires legal and product review.

**Why it matters:** By default, a pet's encounter records are visible only to
the merchant who created each encounter. If a pet owner wants to share their
pet's history with a new clinic, an explicit consent flow is required. The
architecture notes this as a "future privacy/consent feature" in
`VETERINARY_MEDICAL_RECORD.md` §14.

**Current assumption:** No cross-merchant sharing is implemented today — the
master/reference tables are platform-wide reference data (not patient-specific),
so this concern does not apply to the current veterinary foundation (V5/V6). When
patient medical records are implemented, the default is clinic-scoped visibility only.

**Who should decide:** Oyen legal counsel (UU PDP 2022 compliance) + product
team for UX consent flow design.

**Blocks:** The cross-merchant record sharing feature in the future patient
medical record implementation.

**Can proceed without:** Everything in the current veterinary foundation (V5/V6) and all
future single-merchant medical record functionality.

---

## OD-005 — Roadmap Phase for Veterinary Medical Master Implementation

**Question:** In which specific roadmap phase will the full Veterinary Medical
Master (concept authoring workflow, admin UI, patient medical record, encounter
recording) be implemented?

**Current status:** Open — unscheduled. The ADR in `VETERINARY_MEDICAL_MASTER.md`
states "after Phase 16.6" but no phase number has been formally assigned.

**Why it matters:** Several future phases (Phase 6 Services, Phase 10 Fulfillment,
Phase 14 Engagement, Phase 16.6 Pet Care Reminders) have integration points
with the veterinary master. Without a confirmed phase placement, those integrations
cannot be fully planned.

**Current assumption:** The veterinary foundation (V5/V6) is implemented now as a
cross-cutting prerequisite. The patient medical record workflow is explicitly
deferred. Phase 4 (Catalog) remains the current product implementation phase.

**Who should decide:** Oyen product owner + engineering lead, as part of roadmap
planning following Phase 16.6.

**Blocks:** Scheduling the concept authoring workflow, admin UI, and patient
medical record implementation. Does not block the current veterinary foundation (V5/V6) or any
existing phase.

**Can proceed without:** All currently planned phases (4 through 16.6).

---

## OD-006 — Clinical Knowledge Layer: Structured vs Free-text

**Question:** Should the clinical knowledge layer (`vet_concept_knowledge`) remain
as free-text reference notes in the initial implementation, or should it be
structured into typed fields (e.g. enumerated body systems, structured
prevalence data, ICD linkage)?

**Current status:** Open — deferred to the phase that implements concept authoring.

**Why it matters:** Free-text is flexible and low-risk for the foundation.
Structured data enables better search, filtering, and future decision-support
features but requires more upfront clinical data modelling and validation.

**Current assumption:** All `vet_concept_knowledge` fields are TEXT (free-text)
in V5. This is intentional. The schema can be extended with additional structured
columns in a future migration without breaking existing rows.

**Who should decide:** Oyen veterinary product lead + veterinary adviser, at the
time the concept authoring admin tools are implemented.

**Blocks:** Nothing in the current implementation. Structured fields would be
additive (new columns/tables), backward-compatible.

**Can proceed without:** The entire veterinary foundation (V5/V6) and Phase 1 concept authoring
work.

---

## OD-007 — Vaccine Types Migration Strategy

**Question:** At exactly which future migration version will the existing
`vaccine_types` rows be migrated to `vet_concept` rows with `concept_type =
'VACCINE'`? And what is the dual-write transition strategy for `pet_vaccinations`?

**Current status:** Open — deferred to the phase implementing the full
veterinary master workflow.

**Why it matters:** The `pet_vaccinations` table currently holds a hard FK to
`vaccine_types`. When vaccines become `vet_concept` rows, historical
`pet_vaccinations` records must remain valid and the transition must be
backward-compatible.

**Current assumption:** `vaccine_types` is completely untouched by V5. The
migration strategy is documented in `VETERINARY_TERMINOLOGY.md` §6.4 (create
corresponding `vet_concept` rows, add `OYEN_LEGACY` external mappings pointing
to old `vaccine_types.code`, maintain `vaccine_types` FK compatibility during
transition). **This migration has not been implemented.**

**Who should decide:** Oyen backend lead at the time of full veterinary master
implementation.

**Blocks:** Retiring `vaccine_types` and switching `pet_vaccinations` to
reference `vet_concept`. Does not block anything in V5/V6 or the current
foundation.

**Can proceed without:** V5/V6, all repositories, all current phases.

---

## OD-008 — Canonical Code Sequencing Authority

**Question:** Who is responsible for generating unique `canonical_code` values
(e.g. "DIAG-ENDO-001") and what is the exact sequencing mechanism?

**Current status:** Open — deferred to the concept authoring admin tool
implementation.

**Why it matters:** `canonical_code` must be globally unique and never reused.
The current schema enforces uniqueness with a UNIQUE constraint. The authoring
mechanism (auto-generated sequence vs manually assigned by reviewer) needs to
be decided before the admin UI is built.

**Current assumption:** The V5 schema enforces uniqueness but does not implement
auto-generation. The test suite uses hard-coded codes like "DIAG-INF-T01" for
isolation.

**Who should decide:** Oyen backend lead at the time of concept authoring tool
implementation.

**Blocks:** Building the admin concept authoring UI. Does not block V5 or V6.

**Can proceed without:** The entire veterinary foundation (V5/V6).

---

## OD-009 — IS_A Hierarchy Cycle Detection Requirement

**Question:** When the concept authoring workflow is implemented, what mechanism
must prevent circular IS_A relationships from being persisted in
`vet_concept_relationship`?

**Current status:** Open engineering requirement — must be addressed when the
concept authoring service is built. Not a blocker for the current veterinary foundation (V5/V6).

**Why it matters:** The `vet_concept_relationship` table supports IS_A and other
semantic relationships between concepts. Circular relationships (e.g. A IS_A B,
B IS_A A) are semantically invalid in a clinical concept hierarchy and would
corrupt search-expansion queries (which traverse parent–child chains) and any
future roll-up or reporting features.

**Current state in V5:** The database constraints prevent:
- Self-referential relationships (`chk_vet_rel_no_self_ref`: `child_concept_id <> parent_concept_id`).
- Two primary parents for the same child (partial unique index `idx_vet_concept_rel_one_primary`).

The database does **not** prevent multi-hop cycles (A → B → C → A). No
application service layer for concept authoring exists today, so no rows can
be inserted accidentally. The risk is latent until the authoring workflow
is built.

**Current assumption:** No cycle detection is implemented. The design document
(`VETERINARY_MEDICAL_MASTER.md §11`) explicitly states: *"Application enforces:
no circular relationships."* This is an acknowledged future implementation
requirement, not a schema gap.

**Who should decide / implement:** Oyen backend lead at the time the concept
authoring service (`VetConceptService` or equivalent) is implemented.

**Required implementation:** Before any `vet_concept_relationship` rows are
persisted via the application:
- The service must traverse the existing IS_A path upward from the
  `parent_concept_id` and confirm that `child_concept_id` does not appear
  anywhere in that path.
- Alternatively, a recursive CTE query can detect cycles before the INSERT.
- The check must be transactional (no concurrent INSERT can create a cycle
  between the check and the commit).
- Unit-testable: the cycle-detection logic should be a pure function on a
  list of `(child, parent)` pairs.

**Blocks:** Building the concept authoring service / admin workflow.

**Can proceed without:** The entire veterinary foundation (V5/V6 migrations), all existing
repositories, and all current roadmap phases (1–16.6).

---

## Summary Table

| ID | Question | Status | Blocks |
|---|---|---|---|
| OD-001 | SNOMED/VetSCT licensing in Indonesia | Open (legal) | Storing SCTIDs |
| OD-002 | Indonesian terminology reviewer | Open (operational) | Activating any concept |
| OD-003 | Medical record retention period | Open (legal) | Data export / deletion policy |
| OD-004 | Cross-merchant record sharing consent | Open (legal/product) | Cross-merchant sharing feature |
| OD-005 | Roadmap phase for full EMR | Open (product) | Scheduling the EMR phase |
| OD-006 | Knowledge layer structured vs free-text | Open (product/clinical) | Nothing in V5 |
| OD-007 | Vaccine types migration timing | Open (engineering) | Retiring vaccine_types |
| OD-008 | Canonical code sequencing authority | Open (engineering) | Admin concept authoring UI |
| OD-009 | IS_A hierarchy cycle detection requirement | Open (engineering) | Concept authoring service |

**None of OD-001 through OD-009 block the veterinary foundation (V5/V6).**
The current implementation is safe and complete as a standalone foundation.
