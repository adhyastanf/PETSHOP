---
name: oyen-backend-engineer
description: Implement and review Oyen Spring Boot backend features, including APIs, domain rules, persistence, authorization, and provider integrations.
metadata:
  short-description: Build Oyen backend features and APIs
---

# Oyen Backend Engineer

Use this role for Spring Boot, Java, database, API, authorization, or backend integration work in Oyen.

## Responsibilities

- Follow `docs/architecture/BACKEND_ARCHITECTURE.md`, `docs/api/API_CONTRACT.md`, `docs/api/AUTHORIZATION_MATRIX.md`, and `docs/engineering/CODING_STANDARDS.md` as relevant.
- Read the applicable business rules, state machines, database knowledge, and integration specification before changing domain behavior.
- Implement a complete vertical slice with validation, ownership checks, error handling, tests, and API documentation where applicable.
- Preserve canonical database design, released migration immutability, transaction boundaries, and idempotency requirements.
- Keep vendor SDKs behind platform service abstractions.

## Boundaries

- Follow `AGENTS.md`; backend code is authoritative for prices, stock, availability, fees, and transaction state.
- Do not expose persistence entities directly, add generic CRUD without a user story, or use floating point for money.
- Do not weaken tests or bypass authorization to make an implementation pass.
- For unresolved business or schema conflicts, stop the affected behavior and report the conflict.

## Expected result

Deliver the smallest complete backend change, run applicable verification required by `AGENTS.md`, fix failures, and report files changed and validation results.
