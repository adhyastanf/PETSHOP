# Project Progress

Quick status overview. Agents should read this first to avoid re-inspecting completed work.

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| 0 | Foundation | ✅ Done | DB migrations, seed data, JPA, Flyway, project skeleton |
| 1 | Identity & RBAC | ✅ Done | Register, login, logout, JWT, refresh, role-based frontend routing, tests. Remember Me and Delete Account pending. |
| 2 | Customer & Pets | ✅ Done | Profile, addresses, pet CRUD, types/breeds, vaccinations, frontend wired |
| 2.5 | Platform Foundation | ✅ Done | Storage, Image, Email, Notification, Payment, Shipping abstractions + Spring Cache + Spring Scheduling enabled |
| 3 | Merchant | ⏳ Not started | |
| 4 | Catalog | ⏳ Not started | |
| 5 | Inventory | ⏳ Not started | |
| 6 | Services & Scheduling | ⏳ Not started | |
| 7 | Cart | ⏳ Not started | |
| 8 | Checkout | ⏳ Not started | |
| 9 | Payment | ⏳ Not started | |
| 10 | Fulfillment | ⏳ Not started | |
| 11 | Pet Hotel (Boarding) | ⏳ Not started | |
| 12 | Cancellation & Refund | ⏳ Not started | |
| 13 | Finance | ⏳ Not started | |
| 14 | Engagement | ⏳ Not started | |
| 15 | Marketing | ⏳ Not started | |
| 16 | Admin & Disputes | ⏳ Not started | |
| 17 | Legal & Store Compliance | ⏳ Not started | |
| 18 | Production Hardening | ⏳ Not started | |

## Cross-Cutting Work Completed

| Area | Status | Notes |
|------|--------|-------|
| Design System | ✅ Done | DESIGN_SYSTEM.md + UI_PATTERNS.md, Oyen orange palette applied |
| Internationalization (i18n) | ✅ Done | English + Bahasa Indonesia, all Phase 1+2 pages use t() keys |
| UI Redesign (Phase 1+2) | ✅ Done | Oyen branding, consistent tokens, empty states, footer |
| Test Infrastructure | ✅ Done | Vitest + Testing Library, 28 tests passing |
| Docs Reorganization | ✅ Done | Clean folder structure, merged API docs |
| Project Branding | ✅ Done | Renamed to "Oyen" across all docs |
| Cloud Dev Prep | ✅ Done | GitHub Actions CI, env vars, Vercel/Koyeb/Supabase config documented |

## Phase 1 — Remaining Items

- [ ] US-AUTH-006 Remember Me
- [ ] US-AUTH-007 Delete Account

## Last Updated

2026-08-06
