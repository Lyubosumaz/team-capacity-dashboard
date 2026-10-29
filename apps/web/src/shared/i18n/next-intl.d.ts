import type { Locale } from './messages/types';

declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
  }
}
