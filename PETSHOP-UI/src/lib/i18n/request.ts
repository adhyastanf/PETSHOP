import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { cookies } from 'next/headers';
import { getMessages, Locale } from '@/locales';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get('NEXT_LOCALE')?.value;

  const locale = savedLocale && routing.locales.includes(savedLocale as Locale) ? savedLocale : routing.defaultLocale;

  return {
    locale,
    messages: getMessages(locale as Locale),
  };
});
