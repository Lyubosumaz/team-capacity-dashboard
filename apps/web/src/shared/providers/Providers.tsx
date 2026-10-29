'use client';

import { TzarProvider } from '@tzardom-ui/react';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { FirebaseProvider } from './FirebaseProvider';

const THEME_STORAGE_KEY = 'theme';

type ProvidersProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => (
  <TzarProvider storageKey={THEME_STORAGE_KEY}>
    <FirebaseProvider>
      <AuthProvider>{children}</AuthProvider>
    </FirebaseProvider>
  </TzarProvider>
);
