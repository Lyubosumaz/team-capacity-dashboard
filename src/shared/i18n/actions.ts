'use server';

import { cookies } from 'next/headers';
import { LOCALE_COOKIE, type Locale } from './messages/types';

const ONE_YEAR = 60 * 60 * 24 * 365;

// Saving the cookie makes Next.js re-render the page in the new language.
export const setLocale = async (locale: Locale) => {
  (await cookies()).set(LOCALE_COOKIE, locale, { maxAge: ONE_YEAR, path: '/' });
};
