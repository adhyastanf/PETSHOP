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
| 4 | Catalog | ⏳ | Current phase (not started) |
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
| Design System | ✅ Done | `PETSHOP-UI/docs/DESIGN_SYSTEM.md` + `PETSHOP-UI/docs/UI_PATTERNS.md`, Oyen orange palette |
| Internationalization (i18n) | ✅ Done | next-intl with `[locale]` routing (`id`/`en`, prefix always), JSON bundles in `src/locales/{locale}/{namespace}.json`, all user-facing pages use `useTranslations()` keys. Replaced the earlier custom `I18nProvider`/`useI18n`. |
| Frontend Refactor Integration | ✅ Done | `feature-login` refactor merged into `dev`: `[locale]` routing, httpOnly-cookie auth via Next.js API proxy (`BACKEND_URL`), axios `api` client, `useMe()`, Zustand stores, RHF + Zod schemas, `containers/` pattern, `alertDialog`. `/mitra` role rule added to `proxy.ts`. Phase 3 admin/mitra/merchant screens were then aligned: `containers/{Admin,Mitra,Merchant}`, React Hook Form + Zod schemas, `alertDialog` (legacy `ConfirmDialog` removed), shared `FormField` components; also fixed broken `/mitra/home` links and locale-unaware pathname checks (see `PETSHOP-UI/docs/FRONTEND_ARCHITECTURE.md`). |
| UI Redesign (Phase 1+2) | ✅ Done | Oyen branding, consistent tokens |
| Test Infrastructure | ✅ Done | Vitest + Testing Library (25 tests) |
| Docs Reorganization | ✅ Done | All documentation now lives with its deployable so the repos can be separated: `PETSHOP-API/docs/` (backend, API, domain, data, integration, implementation tracking, system architecture) and `PETSHOP-UI/docs/` (frontend architecture, design system, UI patterns, UI coding standards, UI development guide). The root `Docs/` folder was removed. |
| Cloud Dev Prep | ✅ Done | GitHub Actions CI, env vars, deployment config |
| Kiro Multi-Agent Setup | ✅ Done | 6 agents: orchestrator, database, backend, frontend, tester, reviewer |
| Payment Architecture | ✅ Documented | Xendit, 4% commission, QRIS fee Rp0 |
| Shipping Architecture | ✅ Documented | Biteship instant delivery, pet transport separate |
| COD Commission Debt Recovery | 📝 Documented (planned) | Phase 9/13. COD accrues outstanding commission; recovered from future gateway settlements. Not implemented. |
| Business Configuration Foundation | ✅ Done | `BusinessConfigurationService` (typed, cached, audited) + admin management of commission rules, payment-method availability, and system business settings. Deterministic `CommissionRuleResolver`. MIDTRANS→XENDIT alignment + COD method (V4). Admin UI at `app/[locale]/(admin)/admin/{commission-rules,payment-methods,settings}`. Consumption by future phases deferred. |
| Architecture Hardening Audit | ✅ Done | 15-area audit. FIX_NOW: path-traversal containment in `LocalStorageService` + 500 error info-disclosure in `GlobalExceptionHandler`. Canonical future-phase decisions recorded in `architecture/ARCHITECTURE_DECISIONS.md`. No future domains implemented. |
| Veterinary Medical Master | 📝 Designed; foundation implemented | 5 canonical documents in `domain/veterinary/`. VetSCT/WSAVA/AAHA/Merck researched. Three-layer model, procedure taxonomy, multilingual terminology, historical integrity, data sources/licensing. Master/reference schema implemented in V5/V6 (see row below). Concept authoring, clinical workflows, and patient medical-record workflow remain future. |
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
| Frontend lint has 2 pre-existing errors (vendored `carousel.tsx`, `use-mobile.ts`) | Low | Fix when touching those files |
| .next cache occasionally creates stale type errors | Low | Delete .next when it happens |
| Backend integration tests (Testcontainers) need Docker | Low | Run in CI or on a machine with Docker; locally only the 15 non-Docker tests run |

---

## E2E Verification (Phases 1–3) — 2026-11-21

End-to-end run against a throw-away local PostgreSQL database (`petshop_e2e`, Flyway V1–V6 from empty), backend on :8080, production Next.js build on :3000. Covered customer, merchant (owner/staff/vet), admin, cross-tenant security, and the Next.js auth proxy/middleware. Browser-only behavior (client forms, dialogs, visuals) was not exercised; it is covered only by the frontend unit tests.

**Result:** API 123/123 pass. UI layer (route handlers, cookies, middleware, server-rendered pages) 54/58 pass; the 4 failures are dead links listed below.

### Fixed during the run

| Issue | Fix |
|-------|-----|
| Domain errors (duplicate application/staff, unknown staff email, invalid decision, invalid state) returned 500 because `GlobalExceptionHandler`'s catch-all won over module advices | `@Order` on `GlobalExceptionHandler` (lowest) and `MerchantExceptionHandler` / `BusinessConfigExceptionHandler` (highest) |
| Saving branch operating hours a second time failed (unique constraint) | Flush deletes before inserts in `MerchantServiceImpl.setBranchHours` |
| Admin UI sent `APPROVED` for vet verification; backend accepts `VERIFIED` / `REJECTED` only, so vets could never be verified | `VetDecisionPanel` sends `VERIFIED`; contract documented in `API_CONTRACT.md` |
| `/api/auth/{login,register,refresh}` returned tokens in the JSON body, readable by client JS despite httpOnly cookies | Tokens stripped from bodies (`lib/auth-response.ts`) |
| `/user/**` and `/customer/**` rendered for anonymous visitors | Added to `protectedRoutes` in `proxy.ts` |
| Removed staff kept the merchant role and were routed into `/mitra` | `StaffServiceImpl.deleteStaff` revokes the role unless another active staff record uses it |

### Open flow findings

| Area | Finding | Priority |
|------|---------|----------|
| Merchant | A newly approved owner is redirected from `/mitra` to `/unauthorized` for up to 15 min: middleware reads the old access-token cookie, which lacks `ROLE_PETSHOP_OWNER`, and the proxy refreshes only on 401. A refreshed token already carries the role. | High |
| Admin → Merchant | Rejected applicants cannot see why: the admin UI sends only `notes` (not `rejectionReason`) and the status page shows no reason. | High |
| Admin | Veterinarian list shows staff status (ACTIVE), not verification status; the Verify button shows even for verified vets. | Medium |
| Customer | User dropdown links `/user/settings/orders`, `/customer/wishlist`, `/customer/settings` and settings sidebar links `orders` / `wishlist` have no pages (future phases). Hide or mark "coming soon". | Medium |
| Merchant | User dropdown always shows "Become a Merchant" (also to owners) and has no link to the Mitra dashboard. | Medium |
| Customer | After login the `?from=` target is ignored (always role home); middleware redirects to `/login` and `/unauthorized` without the locale prefix (extra hop). | Low |
| Customer | Product cards link to hardcoded `/product/1`; cart is client-side only (catalog/cart not built yet — expected). | Info |
| Merchant | Staff can only be added if the person already has an account; no invite flow. | Info |
| UI | Unknown settings tab shows the not-found page but with HTTP 200 (soft 404): `(customer)/loading.tsx` starts streaming before `notFound()` (documented Next.js behavior). | Low |

### Decisions needed

- **Operating hours with close before open** are currently accepted. Rejecting them would block overnight hours (e.g. 22:00–02:00). Decide: reject, or support overnight hours explicitly.
- **Cart login requirement:** `/cart` is open to anonymous visitors (guest cart) until the backend cart exists; BR-CART-001 ties the active cart to a customer.

---

## Last Updated

2026-11-21
