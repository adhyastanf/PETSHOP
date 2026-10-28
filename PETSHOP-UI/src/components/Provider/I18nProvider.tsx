'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { type Locale, DEFAULT_LOCALE } from '@/locales';
import {
  I18nContext,
  createTranslator,
  detectBrowserLocale,
  getPersistedLocale,
  persistLocale,
} from '@/lib/i18n';

/**
 * I18nProvider — wraps the app with locale context.
 * Initializes locale from: persisted → browser detection → default.
 */
export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Initialize locale on mount
  useEffect(() => {
    const persisted = getPersistedLocale();
    if (persisted) {
      setLocaleState(persisted);
    } else {
      const detected = detectBrowserLocale();
      setLocaleState(detected);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    persistLocale(newLocale);
  }, []);

  const t = useMemo(() => createTranslator(locale), [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
