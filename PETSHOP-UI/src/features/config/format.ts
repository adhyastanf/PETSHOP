import type { Locale } from '@/locales';

/**
 * Formats an ISO date/instant string into a readable, locale-appropriate date
 * for the Admin UI (e.g. "9 Sep 2026" / "9 Sep 2026"). Never exposes raw ISO
 * strings to users.
 *
 * @param iso           ISO string from the backend (nullable)
 * @param locale        current UI locale
 * @param unlimitedLabel label to show when the value is null (e.g. "Unlimited" / "Tidak terbatas")
 */
export function formatEffectiveDate(
  iso: string | null | undefined,
  locale: Locale,
  unlimitedLabel: string
): string {
  if (!iso) {
    return unlimitedLabel;
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return unlimitedLabel;
  }
  const intlLocale = locale === 'id' ? 'id-ID' : 'en-GB';
  return new Intl.DateTimeFormat(intlLocale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
