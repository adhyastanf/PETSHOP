# Project Progress

Quick status overview. Agents should read this FIRST to avoid re-inspecting completed work.

---

## Phase Status

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| 0 | Foundation | ✅ Done | DB migrations, seed data, JPA, Flyway, project skeleton |
| 1 | Identity & RBAC | ✅ Done | Register, login, logout, JWT, refresh, role-based frontend routing, tests |
| 2 | Customer & Pets | ✅ Done | Profile, addresses, pet CRUD, types/breeds, vaccinations, frontend wired |
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

| Story | Phase | Status | Priority | Blocks Phase 3? |
|-------|-------|--------|----------|-----------------|
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

---

## Phase 3 Readiness

| Requirement | Status |
|-------------|--------|
| DB schema exists (merchants, branches, staff, hours) | ✅ |
| Roles seeded (PETSHOP_OWNER, ADMIN, STAFF, GROOMER, VET) | ✅ |
| Permissions seeded (merchants module) | ✅ |
| RBAC service loads authorities | ✅ |
| SecurityConfig enforces auth | ✅ |
| Platform abstractions ready | ✅ |
| Merchant authorization (ownership check) | ❌ Needs implementation |
| Merchant business logic | ❌ Needs implementation |
| Merchant frontend | ❌ Needs implementation |

**Verdict: Ready to start Phase 3.** The schema foundation exists. Business logic and ownership enforcement will be built as part of Phase 3 implementation.

---

## Technical Debt

| Item | Severity | Phase |
|------|----------|-------|
| Two error contracts coexist (ApiResponse + ErrorResponse) | Low | Consolidate during Phase 3 |
| Some empty packages exist (dto/, repository/, service/) | Low | Clean up organically |
| Frontend lint has 3 pre-existing errors (chart/carousel/use-mobile) | Low | Fix when touching those files |
| .next cache occasionally creates stale type errors | Low | Delete .next when it happens |

---

## Last Updated

2026-08-18
