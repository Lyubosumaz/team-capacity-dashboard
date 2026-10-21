'use client';

import { useFirebase } from '@/shared/providers/FirebaseProvider';
import type { FirebaseGateProps } from './FirebaseGate.types';
import { FirebaseUnavailable } from './FirebaseUnavailable';

// Shows FirebaseUnavailable instead of children when Firebase isn't configured.
// For client-only pages; pages that fetch on the server use requireFirebase().
export const FirebaseGate = ({ feature, children }: FirebaseGateProps) => {
  const { isConfigured } = useFirebase();

  if (!isConfigured) {
    return <FirebaseUnavailable feature={feature} />;
  }

  return children;
};
