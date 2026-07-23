# Implementation Roadmap
Build in dependency order.

## Phase 0 Foundation
Spring Boot 3/Java 21, Next.js/TypeScript, PostgreSQL, Flyway, local Docker dependencies, exception handling, OpenAPI, health, logging, test infrastructure and CI.

## Phase 1 Identity & RBAC
Registration/login/logout, JWT/access token, refresh sessions, verification/reset foundations, roles, permissions, security/ownership helpers.

## Phase 2 Customer & Pets
Profile, addresses, pet CRUD, pet types/breeds, basic vaccination history and media foundation.

## Phase 3 Merchant
Merchant onboarding/verification, documents, branches, hours/closures, staff, branch assignments and veterinarian verification.

## Phase 4 Catalog
Categories, brands, products, options, variants, images and public discovery.

## Phase 5 Inventory
Branch+variant inventory, movements, adjustment, reservation/release/finalization and concurrency tests. Do not proceed to checkout until overselling is prevented.

## Phase 6 Services & Scheduling
Services, pricing, branch availability, staff assignment, schedules/exceptions, availability engine, slot holds and verified-vet eligibility.

## Phase 7 Cart
Product/service cart items, multi-merchant and mixed-cart behavior.

## Phase 8 Checkout
Snapshots, shipping selection, vouchers/promotions, backend totals, stock reservations, slot holds, expiration and fulfillment grouping.

## Phase 9 Payment
Provider abstraction, payment attempts, webhooks, signatures, idempotency, checkout finalization and retry/reconciliation.

## Phase 10 Fulfillment
Orders, merchant processing, shipments/tracking; bookings, confirmation, check-in, service execution/completion and vaccination-history generation.

## Phase 11 Cancellation & Refund
Policies, cancellation, partial/full refunds, provider refund and idempotency.

## Phase 12 Finance
Commission, immutable ledger, balances, settlements, bank accounts, withdrawals and concurrency/audit tests.

## Phase 13 Engagement
Reviews, favorites, chat, attachments, notifications/preferences/delivery.

## Phase 14 Marketing
Vouchers, usage limits, campaigns, product/service promotions and banners.

## Phase 15 Admin & Disputes
Disputes/evidence, admin operations, moderation, audit and configuration.

## Phase 16 Production Hardening
E2E, security, rate limits, upload hardening, webhook replay, performance, observability, backups, deployment and rollback.

## Release-critical journeys
1. Register → pet → grooming → pay → complete → review.
2. Two merchants' products → one checkout → two orders.
3. Mixed product + service checkout.
4. Vaccination + verified vet → vaccination history.
5. Payment webhook replay creates no duplicate effects.
6. Race for last stock unit.
7. Race for final service capacity.
8. Cancellation/refund.
9. Earnings → settlement → withdrawal.
10. Cross-merchant IDOR attempt rejected.
