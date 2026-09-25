# Project Progress

Quick status overview. Agents should read this FIRST to avoid re-inspecting completed work.

---

## Phase Status

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| 0 | Foundation | ✅ Done | DB migrations, seed data, JPA, Flyway, project skeleton |
| 1 | Identity & RBAC | ✅ Done (core scope) | Register, login, logout, JWT, refresh, role-based frontend routing, tests. Remember Me + Delete Account pending (non-blocking). |
| 2 | Customer & Pets | ✅ Done (core scope) | Profile, addresses, pet CRUD, types/breeds, vaccinations, frontend wired. Pet Ownership Transfer pending (non-blocking). |
| 2.5 | Platform Foundation | ✅ Done | Storage, Image, Email, Notification, Payment, Shipping abstractions + Spring Cache + Spring Scheduling |
| 3 | Merchant | ✅ Done | Backend + Frontend complete. Application, verification, profile, branches, hours, staff, branch assignment, vet verification. |
| 4 | Catalog | ⏳ | |
| 5 | Inventory | ⏳ | |
| 6 | Services & Scheduling | ⏳ | |
| 7 | Cart | ⏳ | |
| 8 | Checkout | ⏳ | |
| 9 | Payment | ⏳ | |
| 10 | Fulfillment | ⏳ | |
| 11 | Pet Hotel | ⏳ | |
| 12 | Cancellation & Refund | ⏳ | |
| 13 | Finance | ⏳ | |
| 14 | Engagement | ⏳ | |
| 15 | Marketing | ⏳ | |
| 16 | Admin & Disputes | ⏳ | |
| 16.5 | Discovery & Recommendations | ⏳ | |
| 16.6 | Pet Care Reminders | ⏳ | |
| 16.7 | Merchant Acquisition | ⏳ | |
| 17 | Legal & Store Compliance | ⏳ | |
| 18 | Production Hardening | ⏳ | |

---

## Pending Items (from completed phases)

| Story | Phase | Status | Priority | Blocking? |
|-------|-------|--------|----------|-----------|
| US-AUTH-006 Remember Me | 1 | ❌ Not started | Low | No |
| US-AUTH-007 Delete Account | 1 | ❌ Not started | Low | No |
| US-PET-TRANSFER-* | 2 | ❌ Not started | Medium | No |

---

## Cross-Cutting Infrastructure

| Area | Status | Notes |
|------|--------|-------|
| Design System | ✅ Done | DESIGN_SYSTEM.md + UI_PATTERNS.md, Oyen orange palette |
| Internationalization (i18n) | ✅ Done | EN + ID, all Phase 1+2 pages use t() keys |
| UI Redesign (Phase 1+2) | ✅ Done | Oyen branding, consistent tokens |
| Test Infrastructure | ✅ Done | Vitest + Testing Library (28 tests) |
| Docs Reorganization | ✅ Done | Clean folder structure, merged API docs |
| Cloud Dev Prep | ✅ Done | GitHub Actions CI, env vars, deployment config |
| Kiro Multi-Agent Setup | ✅ Done | 6 agents: orchestrator, database, backend, frontend, tester, reviewer |
| Payment Architecture | ✅ Documented | Xendit, 4% commission, QRIS fee Rp0 |
| Shipping Architecture | ✅ Documented | Biteship instant delivery, pet transport separate |
| COD Commission Debt Recovery | 📝 Documented (planned) | Phase 9/13. COD accrues outstanding commission; recovered from future gateway settlements. Not implemented. |
| Business Configuration Foundation | ✅ Done | `BusinessConfigurationService` (typed, cached, audited) + admin management of commission rules, payment-method availability, and system business settings. Deterministic `CommissionRuleResolver`. MIDTRANS→XENDIT alignment + COD method (V4). Admin UI at `(admin)/admin/{commission-rules,payment-methods,settings}`. Consumption by future phases deferred. |
| Architecture Hardening Audit | ✅ Done | 15-area audit. FIX_NOW: path-traversal containment in `LocalStorageService` + 500 error info-disclosure in `GlobalExceptionHandler`. Canonical future-phase decisions recorded in `architecture/ARCHITECTURE_DECISIONS.md`. No future domains implemented. |
| Veterinary Medical Master | 📝 Designed; foundation implemented | 5 canonical documents in `Docs/domain/veterinary/`. VetSCT/WSAVA/AAHA/Merck researched. Three-layer model, procedure taxonomy, multilingual terminology, historical integrity, data sources/licensing. Master/reference schema implemented in V5/V6 (see row below). Concept authoring, clinical workflows, and patient medical-record workflow remain future. |
| Veterinary Medical Master Foundation | ✅ Done | Migration V5: 13 master/reference tables, seed provenance data (OYEN-VET-INITIAL version + 4 sources). 15 JPA entities, 10 repositories in `entity/veterinary` + `veterinary/persistence`. Species via existing `pet_types`. DOG+CAT first-class. Concept lifecycle + deprecation. External mapping optional. `vet_concept` and `vet_procedure` separate. No patient medical-record tables. No APIs. `VETERINARY_OPEN_DECISIONS.md` documents 9 open decisions (none block foundation). V6: fixes external-mapping partial unique index; `VetConceptKnowledge`+`VetVaccineConcept` use correct Oyen `@MapsId` shared-PK pattern; `VETERINARY_TERMINOLOGY.md §5` aligned to MEDICAL_MASTER concept_type list. |

---

## Phase 3 Completion (Merchant)

| Requirement | Status |
|-------------|--------|
| DB schema (merchants, branches, staff, hours) | ✅ |
| Roles seeded (PETSHOP_OWNER, ADMIN, STAFF, GROOMER, VET) | ✅ |
| Permissions seeded (merchants module) | ✅ |
| RBAC service loads authorities | ✅ |
| SecurityConfig enforces auth | ✅ |
| Platform abstractions ready | ✅ |
| Merchant authorization (ownership check) | ✅ Implemented |
| Merchant business logic (application, verification, profile, branches, hours, staff, branch assignment, vet verification) | ✅ Implemented |
| Merchant frontend | ✅ Implemented |

**Verdict: Phase 3 complete.** Merchant onboarding/verification, profile, branches, business hours, staff, branch assignment, and veterinarian verification are implemented end-to-end (backend + frontend).

Post-completion fixes applied since: merchant verification now accepts the `UNDER_REVIEW` decision, and the admin verification list refreshes instantly after approve/reject (query-cache invalidation fix).

---

## Technical Debt

| Item | Severity | Phase |
|------|----------|-------|
| Two error contracts coexist (ApiResponse + ErrorResponse) | Low | Consolidate to one canonical error contract (see ARCHITECTURE_DECISIONS.md) |
| `StaffServiceImpl.joinedAt` uses `LocalDate.now()` (JVM default zone) | Low | Align to `Asia/Jakarta` when staff area is next touched (timezone policy) |
| Some empty packages exist (dto/, repository/, service/) | Low | Clean up organically |
| Frontend lint has 3 pre-existing errors (chart/carousel/use-mobile) | Low | Fix when touching those files |
| .next cache occasionally creates stale type errors | Low | Delete .next when it happens |

---

## Last Updated

2026-09-25
