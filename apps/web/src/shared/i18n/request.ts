import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { LOCALE_COOKIE, type Locale, locales } from './messages/types';

const loadMessages = {
  en: async () => (await import('./messages/en')).en,
  bg: async () => (await import('./messages/bg')).bg,
  ka: async () => (await import('./messages/ka')).ka,
};

const isLocale = (value: string | undefined): value is Locale =>
  locales.some((locale) => locale === value);

// Runs on the server for every request: picks the language from the cookie.
export default getRequestConfig(async () => {
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale: Locale = isLocale(saved) ? saved : 'en';

  return { locale, messages: await loadMessages[locale]() };
});
