'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TzarProvider } from '@tzardom-ui/react';
import { type ReactNode, useState } from 'react';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { LocalizationProvider } from '@/shared/i18n/LocalizationProvider';
import { FirebaseProvider } from './FirebaseProvider';

const THEME_STORAGE_KEY = 'theme';

type ProvidersProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TzarProvider storageKey={THEME_STORAGE_KEY}>
        <LocalizationProvider>
          <FirebaseProvider>
            <AuthProvider>{children}</AuthProvider>
          </FirebaseProvider>
        </LocalizationProvider>
      </TzarProvider>
    </QueryClientProvider>
  );
};
