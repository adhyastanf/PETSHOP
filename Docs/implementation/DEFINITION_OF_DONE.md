# Definition of Done
A story is DONE only when all applicable items pass.

- [ ] Requirements/business rules identified; no unresolved conflict.
- [ ] Flyway migration added if needed; constraints/indexes reviewed; clean migration passes.
- [ ] Request/response DTOs and validation implemented.
- [ ] Authentication, permission and ownership enforced.
- [ ] Business logic is in service/domain layer.
- [ ] Transaction/state-transition/idempotency behavior reviewed.
- [ ] External provider is behind an adapter.
- [ ] Stable API errors and OpenAPI updated.
- [ ] Frontend integration/UI implemented.
- [ ] Loading/empty/error/validation/pending states implemented where relevant.
- [ ] Sensitive data not logged/exposed.
- [ ] Unit tests added for business logic.
- [ ] Integration/API and authorization tests added where applicable.
- [ ] Idempotency/concurrency tests added for critical operations.
- [ ] Critical E2E journey updated where applicable.
- [ ] Backend build/tests pass.
- [ ] Frontend build/lint/type-check/tests pass.
- [ ] No disabled tests used as workaround.
- [ ] No required implementation replaced by TODO/mock/placeholder.
- [ ] Documentation updated when contract/behavior changes.
- [ ] Agent reports changes, migrations, tests, validation commands and risks.

If an applicable item cannot pass, report PARTIAL/BLOCKED, not DONE.
