'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import { defaultLocale, type Locale, messages } from './messages';

type LocalizationContextValue = {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (nextLocale: Locale) => void;
};

const LocalizationContext = createContext<LocalizationContextValue | null>(
  null,
);

export const LocalizationProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  const value: LocalizationContextValue = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key: string) => {
        const segments = key.split('.');
        let current: unknown = messages[locale];

        for (const segment of segments) {
          if (
            current &&
            typeof current === 'object' &&
            segment in (current as Record<string, unknown>)
          ) {
            current = (current as Record<string, unknown>)[segment];
          } else {
            return key;
          }
        }

        return typeof current === 'string' ? current : key;
      },
    }),
    [locale],
  );

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextValue => {
  const context = useContext(LocalizationContext);

  if (!context) {
    throw new Error(
      'useLocalization must be used within a LocalizationProvider',
    );
  }

  return context;
};
