# Oyen — Agent Operating Manual

This file defines how AI coding agents must work in this repository.

Read `docs/PROJECT_CONTEXT.md` before any implementation.

---

## 1. Core Workflow

For every implementation task:

1. Inspect existing code before editing.
2. Identify the requested user story, feature, and affected domain.
3. Read only the relevant canonical documentation.
4. Identify DB, API, UI, security, integration, and test impact.
5. Choose the appropriate execution mode.
6. Implement the smallest complete vertical slice.
7. Run all applicable tests, build, lint, and type-check.
8. If validation fails, diagnose and fix it automatically.
9. Repeat implementation → validation → fix until applicable checks pass.
10. Verify Acceptance Criteria and Definition of Done.
11. Report results concisely.

Do not stop after generating code. A task includes implementation,
validation, and fixing failures.

---

## 2. Source of Truth

Use this priority when information conflicts:

1. Latest explicit human requirement
2. `PROJECT_CONTEXT.md`
3. `FEATURE_KNOWLEDGE.md`
4. `BUSINESS_RULES.md`
5. `STATE_MACHINES.md`
6. `DATABASE_KNOWLEDGE.md`
7. Authorization, API, architecture, security, and integration docs
8. Existing implementation
9. Agent assumptions

If two authoritative sources materially conflict and the correct
behavior cannot be determined safely, stop and report the conflict.

Do not silently invent business rules.

---

## 3. Roadmap and Story Resolution

When a request references a phase, milestone, or user-story ID:

- Phase or milestone → resolve from
  `docs/implementation/IMPLEMENTATION_ROADMAP.md`

- User-story ID (for example `US-PET-001`) → resolve from
  `docs/implementation/USER_STORIES.md`

After resolving it, read only the canonical documentation relevant
to that scope and inspect existing code to determine what is already
implemented versus what remains.

Do not rely on memory or infer phase contents when the roadmap defines them.

---

## 4. Context Loading

Do not read every project document for every task.

Always understand:
- `AGENTS.md`
- `docs/PROJECT_CONTEXT.md`

Then load only documentation relevant to the affected domain.

Examples:

### Product feature
Read relevant sections of:
- FEATURE_KNOWLEDGE
- BUSINESS_RULES
- DATABASE_KNOWLEDGE
- AUTHORIZATION_MATRIX
- API documentation
- frontend/backend architecture as needed

Do not load booking, finance, chat, shipping, or dispute documentation
unless the feature depends on those domains.

### Payment feature
Read:
- payment/checkout business rules
- payment state machines
- relevant database tables
- API contract
- integration specification
- security requirements
- finance rules if affected

Prefer targeted context over loading the entire documentation tree.

---

## 5. Execution Modes

Choose the smallest mode that safely completes the task.

### FAST MODE

Use for:
- simple CRUD
- small bug fixes
- DTO changes
- repository queries
- small UI components/pages
- minor configuration
- localized refactoring

Process:

inspect → implement → test → validate → report

Do not create planning documents.

---

### STANDARD MODE

Default for normal feature development.

Use for:
- user stories
- new API endpoints
- backend + frontend features
- new business behavior
- several related classes/components

Process:

relevant docs → inspect → short internal plan → implement complete
vertical slice → test → fix → validate → report

Planning should remain internal.

Do not create temporary requirement/design/task documents.

---

### DEEP MODE

Use for high-risk or architecture-heavy work:

- authentication/security architecture
- checkout
- payments/webhooks
- inventory concurrency
- booking/slot concurrency
- refunds
- ledger
- settlement
- withdrawals
- major schema changes
- major cross-domain refactoring

Process:

requirements/invariants → architecture impact → failure scenarios →
implementation plan → incremental implementation → comprehensive
tests → security/concurrency validation → Definition of Done

If implementation introduces permanent architectural knowledge, update the
appropriate existing canonical architecture document.

Do not create a new design/planning document unless explicitly permitted by
the Documentation and Planning Files rules.

---

## 6. Documentation and Planning Files

### Hard Rule

Do NOT create new planning/specification files during implementation unless
the user explicitly asks for a document.

This prohibition includes, but is not limited to:

- `requirements.md`
- `design.md`
- `tasks.md`
- `implementation-plan.md`
- `plan.md`
- `spec.md`
- temporary analysis documents
- feature-specific planning folders/files

This rule applies in FAST, STANDARD, and DEEP MODE.

DEEP MODE does NOT automatically authorize creation of `design.md`,
`requirements.md`, or `tasks.md`.

Perform implementation planning internally.

### Existing Canonical Documentation

Use and update the existing canonical documentation when permanent project
knowledge genuinely changes.

Do not create a new document when an existing canonical document owns that
information.

Examples:

- architecture decision → update the appropriate existing architecture document
- business rule → update `BUSINESS_RULES.md`
- database contract → update `DATABASE_KNOWLEDGE.md`
- API contract → update existing API documentation
- user story → update `USER_STORIES.md`
- roadmap/scope → update `IMPLEMENTATION_ROADMAP.md`

### Documentation Creation Exception

A new documentation file may be created ONLY when:

1. the user explicitly requests that specific document; or
2. no existing canonical document can logically contain required permanent
   project knowledge AND the user explicitly approves creation of the new file.

If neither condition is true, DO NOT create the file.

### Kiro Usage

This repository already contains canonical requirements, architecture,
roadmap, user stories, acceptance criteria, and Definition of Done.

For normal implementation work, use Kiro Agentic Chat/Vibe workflow rather
than creating a new Kiro Spec.

Do not create `.kiro/specs/*`, `requirements.md`, `design.md`, or `tasks.md`
unless the user explicitly requests a Kiro Spec.

Existing canonical project documentation replaces per-feature Kiro Specs for
normal implementation work.

### Implementation Tasks

For normal implementation requests:

read canonical docs
→ inspect code
→ plan internally
→ implement
→ test
→ fix
→ validate
→ report

Do not materialize the internal plan as repository files.

---

## 7. Vertical Slice Rule

Prefer completing an entire coherent user story instead of stopping
after individual layers.

For example, a backend feature should normally include applicable:

DTO
→ validation
→ repository
→ service/domain logic
→ authorization
→ controller
→ error handling
→ tests
→ OpenAPI

A full-stack feature may continue through:

backend
→ API integration
→ frontend query/mutation
→ UI
→ UX states
→ tests

Do not ask for approval between these steps unless a stop condition
is encountered.

---

## 8. Autonomous Execution

Once implementation is requested, continue autonomously through all
normal implementation steps.

Automatically:

- create/edit required source files;
- create migrations when legitimately required;
- add/update tests;
- run tests;
- run build;
- run lint;
- run type-check;
- diagnose failures;
- fix failures;
- rerun validation.

Do not return to the user merely because the first implementation
attempt failed.

Do not ask the user to run commands that the agent can run itself.

---

## 9. Stop Conditions

Stop and ask/report only when:

- canonical requirements materially conflict;
- required business behavior is genuinely unspecified and guessing
  could create incorrect behavior;
- a destructive or irreversible operation requires approval;
- external credentials/secrets are required;
- required external infrastructure is unavailable;
- a major architectural decision not covered by canonical docs is
  necessary;
- continuing would violate security or data integrity requirements.

Minor implementation decisions should be resolved using existing
architecture and coding conventions without asking the user.

---

## 10. Testing and Validation

Implementation is not complete when code merely compiles.

Run all applicable:

- unit tests
- integration tests
- security tests
- database verification tests
- concurrency tests
- frontend tests
- lint
- type-check
- backend build
- frontend build
- relevant E2E tests

For regressions, fix the implementation rather than weakening tests.

Critical domains require stronger testing.

---

## 11. Security and Data Integrity

Never:

- trust frontend price, stock, availability, discount, fees, or totals;
- trust client-provided ownership or merchant scope;
- bypass authorization;
- expose JPA entities directly as API DTOs;
- create arbitrary public status setters;
- use floating point for money;
- mutate immutable ledger or stock-history records;
- disable tests to make CI green;
- weaken assertions merely to pass tests;
- substitute TODOs, mocks, or placeholders for requested production behavior;
- use `ddl-auto=update` in production;
- rewrite released Flyway migrations;
- introduce microservices without explicit approval;
- expose secrets or sensitive tokens in logs;
- blindly store long-lived sensitive authentication tokens in insecure browser storage.

High-risk domains:

- authentication
- authorization
- inventory
- service-slot concurrency
- checkout
- payments/webhooks
- refunds
- ledger
- settlement
- withdrawal
- private files

---

## 12. Database Rules

`DATABASE_KNOWLEDGE.md` and released Flyway migrations define the
canonical database design according to the documented source-of-truth
hierarchy.

When JPA and the canonical schema disagree, do not modify the database
merely to satisfy Hibernate.

Investigate the mismatch first.

Released Flyway migrations are immutable.

Schema changes require a new migration.

For critical persistence changes verify:

migration
→ PostgreSQL
→ JPA validation
→ integration tests

---

## 13. Backend Rules

Follow `architecture/BACKEND_ARCHITECTURE.md`, `api/API_CONTRACT.md`,
`api/AUTHORIZATION_MATRIX.md`, and `engineering/CODING_STANDARDS.md`.

Prefer intent-based business operations such as:

`confirmBooking()`
`cancelOrder()`
`approveRefund()`

instead of generic:

`setStatus()`

Business state transitions must be validated server-side.

External providers must be accessed through integration abstractions.

Configurable business values (commission, checkout expiration, slot-hold
duration, minimum withdrawal, review window, payment-method availability, etc.)
must be read through `BusinessConfigurationService` / the `businessconfig`
module — never hardcoded. Do not make technical/security invariants
admin-editable. When consuming commission in future finance/order phases,
snapshot the resolved rate onto the transaction so historical records are never
retroactively changed. Xendit is the canonical payment provider. See
`architecture/BACKEND_ARCHITECTURE.md` → Business Configuration.

---

## 14. Frontend Rules

Follow `architecture/FRONTEND_ARCHITECTURE.md`.

Use TanStack Query for server state.

Use Zustand only for appropriate client/global UI state.

Do not duplicate server state into Zustand without a concrete reason.

The frontend must not become the source of truth for:

- authorization
- prices
- discounts
- inventory
- booking availability
- payment status
- transaction state

Handle applicable:

loading
→ success
→ empty
→ validation error
→ API error
→ retry/recovery

Prevent duplicate submissions.

---

## 15. Definition of Done

Before declaring a task complete, verify
`docs/implementation/DEFINITION_OF_DONE.md`.

Also apply:

`docs/implementation/ACCEPTANCE_CRITERIA.md`

A task that fails applicable Definition of Done requirements must be
reported as PARTIAL or BLOCKED, not DONE.

---

## 16. Final Report

Keep completion reports concise.

Report:

### Completed
What was implemented.

### Changed
Important files/components/migrations.

### Validation
Tests, build, lint, type-check, and relevant verification results.

### Remaining
Only actual gaps, blockers, risks, or intentionally deferred scope.

Do not generate another long explanation of requirements that were
already known.

---

## 17. Default Behavior

Unless the user says otherwise:

- use STANDARD MODE;
- work autonomously;
- read only relevant documentation;
- do not create temporary planning documents;
- NEVER create `requirements.md`, `design.md`, `tasks.md`, `plan.md`,
  `spec.md`, `implementation-plan.md`, or `.kiro/specs/*` unless explicitly
  requested by the user;
- implement complete vertical slices;
- run applicable validation;
- fix failures automatically;
- follow Acceptance Criteria;
- follow Definition of Done;
- stop only for defined stop conditions;
- provide only the concise completion report.

Therefore a request such as:

> Implement US-PET-001.

is sufficient authorization to implement, test, validate, and complete
that story according to the canonical documentation.


---

## 18. Frontend Design

When implementing frontend features:

- Read `docs/design/DESIGN_SYSTEM.md`.
- Read `docs/design/UI_PATTERNS.md`.
- Reuse existing components.
- Do not redesign existing UI.
- Extend the design system only when necessary.
- Maintain one consistent visual language.
- Prefer component reuse over creating new variants.
- Use English for all user-facing text.
- Always show toast notification for API errors using Sonner.
