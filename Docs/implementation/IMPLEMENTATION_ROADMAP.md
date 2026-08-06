# Oyen — Implementation Roadmap

Build in dependency order.

Each phase maps to user stories in `docs/implementation/USER_STORIES.md`.
Detailed behavior remains defined by the canonical product, business-rule,
database, API, authorization, architecture, security, acceptance-criteria,
and Definition-of-Done documentation.

A phase is complete only when its applicable stories and exit criteria pass.

---

## Phase 0 — Foundation

**Scope**

Spring Boot 3/Java 21, Next.js/TypeScript, PostgreSQL, Flyway, local Docker
dependencies, exception handling, OpenAPI, health, logging, test
infrastructure, CI, database migrations, seed data, JPA mappings, and database
foundation verification.

**Exit Criteria**

- Backend and frontend foundations build successfully.
- PostgreSQL/Flyway migrations execute cleanly from a fresh database.
- JPA mappings validate against the canonical schema.
- Required seed/reference data is present.
- Database constraints and critical indexes are verified.
- Applicable foundation tests pass.

---

## Phase 1 — Identity & RBAC

**Stories**

- US-AUTH-001 Register
- US-AUTH-002 Login
- US-AUTH-003 Sessions
- US-AUTH-004 Logout
- US-AUTH-005 Current User
- US-AUTH-006 Remember Me
- US-AUTH-007 Delete Account

**Scope**

Registration, login, logout, JWT access tokens, refresh sessions, current-user
context, roles, permissions, security/ownership helpers, complete frontend
authentication/session handling, remember me (extended session), and
self-service account deletion.

OAuth, password reset, email verification, and phone verification are deferred
unless explicitly introduced by a later approved requirement.

**Exit Criteria**

- All Phase 1 stories satisfy applicable acceptance criteria.
- Registration and login work end-to-end between Next.js and Spring Boot.
- Access-token authentication works.
- Refresh rotation, revocation, expiration, and replay protection work.
- Logout revokes the applicable session.
- Current-user context works.
- RBAC and protected backend endpoints are enforced.
- Protected frontend routes and session restoration work.
- Applicable backend/frontend/security tests pass.
- Build, lint, and type-check pass.
- Definition of Done passes.

---

## Phase 2 — Customer & Pets

**Stories**

- US-CUS-*
- US-PET-*

**Scope**

Customer profile, addresses, pet CRUD, pet types/breeds, basic vaccination
history, and pet/customer media foundation.

**Exit Criteria**

- Customers can manage only their own permitted profile/address/pet data.
- Ownership and authorization are enforced server-side.
- Pet reference data and validation behave according to canonical rules.
- Basic vaccination history is accessible only within authorized scope.
- Applicable tests and Definition of Done pass.

---

## Phase 3 — Merchant

**Stories**

- US-MER-*

**Scope**

Merchant onboarding/verification, documents, merchant profile, branches,
hours/closures, staff, branch assignments, and veterinarian verification.

**Exit Criteria**

- Merchant onboarding and verification flows work according to authorization.
- Merchant users cannot cross merchant/branch boundaries.
- Staff and veterinarian scope/verification rules are enforced.
- Applicable tests and Definition of Done pass.

---

## Phase 4 — Catalog

**Stories**

- US-PROD-*

**Scope**

Categories, brands, products, options, variants, images/media, merchant catalog
management, and public product discovery.

**Exit Criteria**

- Merchants manage only catalog resources within their scope.
- Product/variant/SKU/pricing rules are enforced.
- Public discovery exposes only eligible catalog data.
- Applicable tests and Definition of Done pass.

---

## Phase 5 — Inventory

**Stories**

- US-INV-*

**Scope**

Branch+variant inventory, movements, adjustments, reservation, release,
finalization, and concurrency protection.

**Exit Criteria**

- Every stock mutation creates required movement history.
- Reservations/releases/finalization are idempotent where required.
- Concurrent requests cannot oversell inventory.
- Inventory concurrency tests pass.
- Do not proceed to checkout until overselling is prevented.
- Definition of Done passes.

---

## Phase 6 — Services & Scheduling

**Stories**

- US-SVC-*

**Scope**

Services, pricing, branch availability, staff assignment, schedules/exceptions,
availability engine, slot holds, capacity protection, and verified-veterinarian
eligibility.

**Exit Criteria**

- Service configuration and pricing rules work.
- Availability is computed by the backend.
- Slot capacity cannot be oversold under concurrency.
- Slot hold/release behavior is safe and idempotent where required.
- Verified-veterinarian rules are enforced.
- Applicable tests and Definition of Done pass.

---

## Phase 7 — Cart

**Stories**

- US-CART-*

**Scope**

Product and service cart items, required service booking context,
multi-merchant behavior, and mixed product+service carts.

**Exit Criteria**

- Product and service cart operations work.
- Customers access only their own cart.
- Documented multi-merchant and mixed-cart combinations work.
- Server-authoritative values are not trusted from the client.
- Applicable tests and Definition of Done pass.

---

## Phase 8 — Checkout

**Stories**

- US-CHK-*

**Scope**

Checkout creation, immutable snapshots, shipping selection, application of
already-defined voucher/promotion rules, backend totals, stock reservations,
slot holds, expiration, and fulfillment grouping.

**Dependency / Boundary**

Checkout must be capable of consuming and validating applicable voucher or
promotion rules needed for checkout.

Full voucher, promotion, campaign, and banner administration belongs to
Phase 15 and must not be pulled into Phase 8 unless explicitly required.

**Exit Criteria**

- Backend revalidates all transaction-critical inputs.
- Required checkout snapshots are preserved.
- Backend calculates authoritative totals.
- Stock and slot resources are reserved safely.
- Expiration releases resources exactly once.
- Multi-merchant/mixed-cart fulfillment grouping works according to rules.
- Applicable concurrency/integration tests and Definition of Done pass.

---

## Phase 9 — Payment

**Stories**

- US-PAY-*

**Scope**

Payment-provider abstraction, payment attempts, authoritative payment status,
webhooks, signature verification, idempotency, checkout finalization,
retry, and reconciliation.

**Exit Criteria**

- Payment integration is behind the documented provider abstraction.
- Webhook authenticity is verified.
- Webhook replay creates no duplicate effects.
- Amount/currency/transaction identity are reconciled before finalization.
- Payment retries do not duplicate completed effects.
- Applicable security/integration tests and Definition of Done pass.

---

## Phase 10 — Fulfillment

**Stories**

- US-ORD-*
- US-SHP-*
- US-BKG-*

**Scope**

Product orders, merchant processing, shipments/tracking, service bookings,
confirmation, check-in, service execution/completion, and vaccination-history
generation.

**Exit Criteria**

- Product checkout splits into correct merchant/branch orders.
- Merchant order processing obeys ownership and state machines.
- Shipping quote/create/track/update flows work through integration boundaries.
- Paid services create bookings exactly once.
- Booking confirmation and fulfillment transitions are valid and authorized.
- Eligible vaccination completion creates history exactly once.
- Applicable tests and Definition of Done pass.

---

## Phase 11 — Pet Hotel (Boarding)

**Stories**

- US-HTL-*

**Scope**

Room types and capacity management per branch, multi-night booking flow,
room availability search, check-in/check-out, daily activity updates,
stay extension, early checkout, boarding-specific pricing and cancellation
policy, and staff assignment for boarding guests.

Pet hotel reuses the service/booking/payment infrastructure from earlier phases
and extends it with multi-day duration, room inventory, and daily activity
tracking.

**Exit Criteria**

- Room types and capacity are branch-scoped and managed by merchant.
- Multi-night availability is computed correctly.
- Booking flow supports date-range selection and room type.
- Check-in/check-out lifecycle transitions are valid and authorized.
- Daily updates are visible only to pet owner and authorized staff.
- Extension and early checkout handle availability and refunds correctly.
- Concurrent bookings cannot exceed room capacity.
- Applicable tests and Definition of Done pass.

---

## Phase 12 — Cancellation & Refund

**Stories**

- US-REF-*
- Applicable cancellation stories from US-ORD-*, US-BKG-*, and US-HTL-*

**Scope**

Cancellation policies, eligibility calculation, partial/full refunds,
refund review where required, provider refunds, status/history, and
idempotency.

**Exit Criteria**

- Backend determines cancellation/refund eligibility and amount.
- Refund processing is idempotent.
- Order/booking/payment/finance effects remain consistent.
- Applicable integration tests and Definition of Done pass.

---

## Phase 13 — Finance

**Stories**

- US-FIN-*

**Scope**

Commission, immutable ledger, merchant balances, settlements, bank accounts,
withdrawals, concurrency protection, and financial auditability.

**Exit Criteria**

- Commission calculations follow canonical rules.
- Ledger movements are immutable and posted exactly once.
- Merchant balances derive from canonical financial records.
- Settlement cannot duplicate eligible earnings.
- Withdrawal cannot exceed available balance.
- Financial concurrency/audit tests pass.
- Definition of Done passes.

---

## Phase 14 — Engagement

**Stories**

- US-REV-*
- US-FAV-*
- US-CHAT-*
- US-NOT-*

**Scope**

Reviews, favorites, chat, private attachments, notifications, preferences,
and notification delivery behavior.

**Exit Criteria**

- Review eligibility is transaction-backed.
- Favorites are user-scoped.
- Chat membership and attachments are authorization-protected.
- Notifications respect supported preferences.
- Applicable tests and Definition of Done pass.

---

## Phase 15 — Marketing

**Stories**

- US-VOU-*
- US-CAM-*

**Scope**

Voucher management and usage limits, merchant/admin promotions, campaigns,
banners, scheduling, and customer-facing marketing discovery.

**Boundary**

Phase 8 may consume already-defined voucher/promotion rules during checkout.
Phase 15 owns the full management lifecycle and administration of those
marketing capabilities.

**Exit Criteria**

- Voucher scope/time/usage limits are enforced server-side.
- Concurrent voucher usage cannot exceed documented limits.
- Promotions/campaigns/banners obey ownership, authorization, and schedules.
- Customers see only active/eligible marketing content.
- Applicable tests and Definition of Done pass.

---

## Phase 16 — Admin & Disputes

**Stories**

- US-DIS-*
- US-ADM-*

**Scope**

Disputes/evidence, administrative operations, moderation, audit access,
marketplace configuration, and explicit permission enforcement.

**Exit Criteria**

- Disputes and evidence are access-controlled.
- Admin operations require explicit permissions.
- Sensitive administrative actions are audited.
- Admin functionality does not bypass domain invariants/state machines.
- Applicable security tests and Definition of Done pass.

---

## Phase 17 — Legal & Store Compliance

**Stories**

- US-LEGAL-001 Terms of Service
- US-LEGAL-002 Privacy Policy
- US-LEGAL-003 Consent & Agreement
- US-LEGAL-004 Cookie/Tracking Disclosure
- US-LEGAL-005 Data Export
- US-LEGAL-006 Content Guidelines
- US-LEGAL-007 App Store Metadata

**Scope**

Terms of service, privacy policy, acceptable use policy, refund/cancellation
policy summary, user consent tracking, GDPR/local data protection compliance
pages, cookie/tracking disclosure, user data export (right to access),
content/community guidelines, app store metadata (descriptions, screenshots,
age rating, category, contact info), and required legal links in app/footer.

This phase satisfies Google Play and Apple App Store publishing requirements
for legal compliance, user safety, and content policies.

**Exit Criteria**

- Terms of Service page is accessible without authentication.
- Privacy Policy page is accessible without authentication.
- User must accept ToS/Privacy Policy during registration (consent recorded with timestamp).
- Privacy Policy includes data collection, usage, sharing, retention, and deletion disclosures.
- Account deletion flow references data retention/deletion policy.
- Data export endpoint/UI allows user to download their personal data.
- Content/community guidelines page exists.
- App store listing metadata (description, screenshots, category, age rating, contact) is prepared.
- Required legal links are present in app footer/settings and app store listings.
- Cookie/tracking disclosure is shown where applicable.
- All legal pages support versioning (date/version header).
- Applicable tests and Definition of Done pass.

---

## Phase 18 — Production Hardening

**Scope**

End-to-end validation, security hardening, rate limits, upload hardening,
webhook replay protection, performance, observability, backups, deployment,
rollback, and production-readiness verification.

**Exit Criteria**

- Release-critical E2E journeys pass.
- Security review/hardening is complete.
- Rate limits and abuse protections are applied where required.
- Upload/private-file controls are verified.
- Webhook replay/idempotency protections are verified.
- Performance of critical flows is acceptable.
- Logging, metrics, health, and operational visibility are production-ready.
- Backup/restore procedures are verified.
- Deployment and rollback procedures are documented and tested.
- Full Definition of Done/release criteria pass.

---

## Release-Critical Journeys

1. Register → pet → grooming → pay → complete → review.
2. Two merchants' products → one checkout → two orders.
3. Mixed product + service checkout.
4. Vaccination + verified veterinarian → vaccination history.
5. Payment webhook replay creates no duplicate effects.
6. Race for last stock unit.
7. Race for final service capacity.
8. Cancellation/refund.
9. Earnings → settlement → withdrawal.
10. Cross-merchant IDOR attempt is rejected.
11. Pet hotel: book multi-night stay → check-in → daily updates → check-out → settlement.
12. Pet hotel: concurrent booking cannot exceed room capacity.

---

## Roadmap Execution Rule

Phase references must be resolved from this roadmap.

Story details must be resolved from
`docs/implementation/USER_STORIES.md` and the relevant canonical
documentation.

When asked to complete a phase, the agent must:

1. Resolve the phase scope and stories from this document.
2. Inspect existing implementation to determine what is already complete.
3. Implement only the remaining work required by the phase.
4. Follow `AGENTS.md` execution rules.
5. Verify applicable acceptance criteria and Definition of Done.
6. Do not begin the next phase unless explicitly requested.

Do not infer additional scope merely because a later feature is related.
