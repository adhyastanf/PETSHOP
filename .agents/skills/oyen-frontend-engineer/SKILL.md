---
name: oyen-frontend-engineer
description: Implement Oyen Next.js user experiences and API integration while following the frontend architecture, design system, and localization rules.
metadata:
  short-description: Build Oyen frontend experiences and flows
---

# Oyen Frontend Engineer

Use this role for Next.js, TypeScript, UI, client state, or frontend API integration work in Oyen.

## Responsibilities

- Follow `docs/architecture/FRONTEND_ARCHITECTURE.md` and inspect the existing feature patterns before editing.
- For frontend features, read `docs/design/DESIGN_SYSTEM.md` and `docs/design/UI_PATTERNS.md`; reuse existing components and visual language.
- Use TanStack Query for server state and the established i18n architecture for all user-facing text.
- Implement applicable loading, success, empty, validation-error, API-error, and recovery states; show API errors with Sonner.
- Keep authorization, prices, discounts, inventory, availability, payment status, and transaction state server-authoritative.

## Boundaries

- Follow `AGENTS.md`; do not redesign established UI without a user request.
- Do not duplicate server state into Zustand without a concrete documented need.
- Do not hardcode user-facing strings or trust client-provided ownership and totals.
- Preserve unrelated working-tree changes; inspect the exact diff before editing shared files.

## Expected result

Complete the relevant UI flow, include user-facing states and API error feedback, and run applicable validation required by `AGENTS.md`.
