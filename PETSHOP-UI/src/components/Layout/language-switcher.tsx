'use client';

import { Globe } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { SUPPORTED_LOCALES, LOCALE_LABELS, type Locale } from '@/locales';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Language switcher dropdown.
 * Shows current language with globe icon, allows switching.
 */
export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className='inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring'
            aria-label='Change language'
          >
            <Globe className='size-4' />
            <span className='hidden sm:inline'>{LOCALE_LABELS[locale]}</span>
          </button>
        }
      />
      <DropdownMenuContent align='end' className='w-40'>
        <DropdownMenuGroup>
          {SUPPORTED_LOCALES.map((loc) => (
            <DropdownMenuItem
              key={loc}
              onClick={() => setLocale(loc)}
              className={locale === loc ? 'font-medium text-primary' : ''}
            >
              {LOCALE_LABELS[loc]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
