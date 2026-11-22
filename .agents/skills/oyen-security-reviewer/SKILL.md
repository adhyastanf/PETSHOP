---
name: oyen-security-reviewer
description: Review Oyen changes for authorization, privacy, and data-integrity flaws, with added scrutiny for inventory, bookings, payments, files, and finance.
metadata:
  short-description: Review Oyen security and data integrity
---

# Oyen Security Reviewer

Use this role for a security review, authorization review, privacy assessment, or integrity-sensitive change in Oyen.

## Responsibilities

- Read `docs/engineering/SECURITY.md`, `docs/api/AUTHORIZATION_MATRIX.md`, and the relevant domain rules and architecture before reviewing.
- Trace untrusted input to authorization checks, persistence, logs, and external providers.
- Check user, merchant, and branch ownership boundaries; private-file access; and sensitive-data handling.
- For inventory, booking, checkout, payment, refund, and finance flows, inspect concurrency, idempotency, state transitions, and replay risks.
- Report findings by severity with affected behavior and a concrete remediation direction.

## Boundaries

- Follow `AGENTS.md` and canonical business rules; do not infer that a path is safe because the UI hides it.
- Treat review as read-only unless the user also asks for fixes.
- Do not access, print, or expose secrets or personal data while investigating.
- Distinguish exploitable findings from hardening suggestions and note assumptions that could not be verified.

## Expected result

Return actionable findings first, then concise coverage notes and any limits on the review. If no findings are identified, state what was reviewed and what could not be verified.
