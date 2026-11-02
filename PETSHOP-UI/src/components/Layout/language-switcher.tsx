'use client';

import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';
import { SUPPORTED_LOCALES, LOCALE_LABELS, type Locale } from '@/locales';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from '@/lib/i18n/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  function handleLocaleChange(nextLocale: Locale) {
    if (nextLocale === locale) return;

    router.replace(pathname, {
      locale: nextLocale,
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant='ghost' className='inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground' aria-label='Change language'>
            <Globe className='size-4' />
            <span className='hidden sm:inline'>{LOCALE_LABELS[locale]}</span>
          </Button>
        }
      />

      <DropdownMenuContent align='end' className='w-40'>
        <DropdownMenuGroup>
          {SUPPORTED_LOCALES.map((loc) => (
            <DropdownMenuItem key={loc} onClick={() => handleLocaleChange(loc)} className={locale === loc ? 'font-medium text-primary' : ''}>
              {LOCALE_LABELS[loc]}
              {locale === loc && (
                <span className='ml-auto' aria-label='Current language'>
                  ✓
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
