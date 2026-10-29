'use client';

import { useFirebase } from '@/shared/providers/FirebaseProvider';
import type { FirebaseGateProps } from './FirebaseGate.types';
import { FirebaseUnavailable } from './FirebaseUnavailable';

// Shows FirebaseUnavailable instead of children when Firebase isn't configured.
// Used by the login and sign-up pages; pages with data use LoginRequired.
export const FirebaseGate = ({ feature, children }: FirebaseGateProps) => {
  const { isConfigured } = useFirebase();

  if (!isConfigured) {
    return <FirebaseUnavailable feature={feature} />;
  }

  return children;
};
