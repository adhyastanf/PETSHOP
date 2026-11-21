# Oyen — UI Coding Standards

Standards for `PETSHOP-UI`. Backend conventions are in the API project (`PETSHOP-API/docs/engineering/CODING_STANDARDS.md`).

## General
Optimize for clarity, consistency, testability, and business correctness over clever abstractions.

## TypeScript
- Strict TypeScript.
- Avoid `any` unless isolated and justified.
- API types are explicit and match backend DTOs.
- Keep server state in TanStack Query. Do not copy fetched collections into Zustand.
- Keep Zustand stores small and domain/UI focused (for example modal open/mode/selected id).
- Reusable components must not hide business authorization.
- Call the backend only through services that use the shared axios instance (`@/lib/api`). No raw `fetch`, no extra axios instances.

## Nullability
Make optionality intentional in types and forms. Do not use nullable fields simply to avoid modeling lifecycle requirements.

## Structure
- Pages under `src/app/[locale]/` stay thin and render a container.
- Feature UI lives in `src/containers/<Domain>/<Domain>Containers.tsx`; modal forms in `src/containers/<Domain>/Form/`.
- Zod schemas live in `src/lib/schema/` and are used with React Hook Form (`zodResolver`).
- Confirmations and result dialogs use `alertDialog` from `@/lib/alert-dialog`.
- Internal links and navigation use `@/lib/i18n/navigation` so the locale prefix is kept.

## Money and Business Values
The frontend never computes prices, discounts, fees, commission, stock, or availability. Render the values returned by the backend. Format currency and dates with `Intl`.

## Security
- Tokens live only in httpOnly cookies handled by the Next.js route handlers. Never store tokens in `localStorage`, `sessionStorage`, or Zustand.
- Never put secrets in `NEXT_PUBLIC_*` variables.
- UI role checks are convenience, not security.

## Comments
Explain *why* a non-obvious rule exists, not what obvious code syntax does.

## Tests
Cover loading, error, empty, validation, and success states for important flows. Wrap components that use `useTranslations` in `NextIntlClientProvider`. Mock `useMe` from `@/hooks/use-auth` when a test depends on the current user.

## Git / Change Discipline
Keep UI changes, locale keys, and tests in the same change. Do not perform unrelated broad refactors while implementing a scoped feature unless explicitly approved.

---

## Internationalization

### Rules

1. **Never hardcode user-facing strings.** All UI text comes from translation resources.
2. **Always use translation keys.** Components reference keys, not raw text.
3. **Never use translated text as identifiers.** Logic uses stable codes/enums, not display strings.
4. **Group keys by namespace and feature.** Example: `auth.login.title`, `pet.form.name`, `common.save`.
5. **Keep keys stable.** Renaming a key is a breaking change that requires updating both locales.
6. **Prefer descriptive key names.** `auth.login.invalidCredentials` over `auth.error1`.
7. **Use interpolation for dynamic values.** Example: `"Welcome, {name}"`, not string concatenation.
8. **Pluralization uses ICU format.** Example: `"{count, plural, one {# item} other {# items}}"`.
9. **Date and number formatting uses the `Intl` API.** Never hand-format dates for display.
10. **Source language is English.** English JSON files are the source of truth for keys; every key must exist in both `en` and `id`.
11. **Use next-intl.** `useTranslations()` for text, `useLocale()` for the active locale. The app routes are locale-prefixed (`/id`, `/en`).

### Migration Strategy

Existing hardcoded strings are replaced with translation keys whenever the file is touched for other work. This is a progressive migration; do not create a dedicated refactoring phase.
