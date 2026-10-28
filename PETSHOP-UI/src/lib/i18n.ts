/**
 * Internationalization utilities.
 * Provides the translation hook and locale management.
 */

'use client';

import { createContext, useContext } from 'react';
import { type Locale, DEFAULT_LOCALE, getMessages } from '@/locales';

const STORAGE_KEY = 'oyen_locale';

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key) => key,
});

/**
 * Hook to access translations.
 * Usage: const { t, locale, setLocale } = useI18n();
 *        t('auth.login.title')
 *        t('pet.deleteConfirm', { name: 'Milo' })
 */
export function useI18n() {
  return useContext(I18nContext);
}

/**
 * Resolve a dotted key path from nested messages.
 */
export function resolveKey(messages: Record<string, unknown>, key: string): string {
  const parts = key.split('.');
  let current: unknown = messages;

  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return key; // fallback to key
    }
    current = (current as Record<string, unknown>)[part];
  }

  if (typeof current === 'string') {
    return current;
  }

  return key; // fallback to key if not found
}

/**
 * Interpolate {param} placeholders in a translated string.
 */
export function interpolate(text: string, params?: Record<string, string | number>): string {
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (_, paramKey) => {
    return params[paramKey]?.toString() ?? `{${paramKey}}`;
  });
}

/**
 * Get persisted locale from localStorage.
 */
export function getPersistedLocale(): Locale | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'id') return stored;
  } catch {
    // ignore
  }
  return null;
}

/**
 * Persist locale to localStorage.
 */
export function persistLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // ignore
  }
}

/**
 * Detect browser locale preference.
 */
export function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('id')) return 'id';
  return DEFAULT_LOCALE;
}

/**
 * Create translation function for a given locale.
 */
export function createTranslator(locale: Locale) {
  const msgs = getMessages(locale);
  return (key: string, params?: Record<string, string | number>): string => {
    const resolved = resolveKey(msgs, key);
    return interpolate(resolved, params);
  };
}
