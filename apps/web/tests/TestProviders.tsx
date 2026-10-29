import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { en } from '@/shared/i18n/messages/en';
import { Providers } from '@/shared/providers/Providers';

// The app's providers plus English texts, as the root layout gives them.
export const TestProviders = ({ children }: { children: ReactNode }) => (
  <NextIntlClientProvider locale="en" messages={en}>
    <Providers>{children}</Providers>
  </NextIntlClientProvider>
);
