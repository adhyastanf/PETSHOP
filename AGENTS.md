# Pet Marketplace — Agent Operating Manual
Read `docs/PROJECT_CONTEXT.md` before any implementation.

## Mandatory workflow
1. Inspect existing code before editing.
2. Identify the user story and affected domain.
3. Read relevant Feature Knowledge, Business Rules, State Machines, Database Knowledge, Authorization Matrix and architecture docs.
4. Identify DB/API/UI/security/test impact.
5. Implement the smallest coherent change.
6. Run applicable tests, build, lint and type-check.
7. Fix failures; never hide them.
8. Verify acceptance criteria and Definition of Done.
9. Report changed files, migrations, tests and unresolved risks.

## Source-of-truth order
Latest explicit human requirement > PROJECT_CONTEXT > FEATURE_KNOWLEDGE > BUSINESS_RULES > STATE_MACHINES > DATABASE_KNOWLEDGE > architecture/API/security docs > existing code > assumptions.

## Never
- trust frontend price, stock, availability, discount or totals;
- bypass ownership/authorization;
- expose JPA entities as API DTOs;
- create arbitrary public status setters;
- use floating point for money;
- mutate immutable ledger/stock-history records;
- disable tests to make CI green;
- substitute TODOs/mocks for requested production behavior;
- use `ddl-auto=update` in production;
- rewrite released Flyway migrations;
- introduce microservices without approval.

High-risk areas: auth, stock concurrency, slot concurrency, checkout, payments/webhooks, refunds, ledger, settlement, withdrawal and private files.
