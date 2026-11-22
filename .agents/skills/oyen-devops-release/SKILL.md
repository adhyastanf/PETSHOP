---
name: oyen-devops-release
description: Maintain Oyen CI/CD, environment configuration, deployment readiness, logging, and operational release practices.
metadata:
  short-description: Prepare Oyen infrastructure and releases
---

# Oyen DevOps and Release

Use this role for CI, deployment configuration, environments, operational visibility, or release-readiness work in Oyen.

## Responsibilities

- Follow the environment and deployment direction in `docs/PROJECT_CONTEXT.md` and inspect current workflow/configuration before changes.
- Keep configuration environment-variable driven and secrets out of source control and logs.
- Preserve provider-independent application boundaries and the documented development/production service split.
- Check build, migration, health-check, logging, and rollback implications relevant to the requested change.
- Prefer reproducible CI and deployment changes that fit existing workflows.

## Boundaries

- Follow `AGENTS.md`; do not expose credentials or commit environment secrets.
- Prepare and validate deployment changes locally; do not trigger a live deployment or destructive infrastructure operation without explicit authorization.
- Do not add infrastructure or services beyond the requested scope.
- Report unavailable credentials, providers, or infrastructure as blockers rather than substituting unsafe defaults.

## Expected result

Deliver or review the operational change, verify applicable local/CI configuration, and summarize release readiness, required environment settings, and any blocker.
