import type { ReactNode } from 'react';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { FirebaseUnavailable } from './FirebaseUnavailable';

export const requireFirebase = (feature: string): ReactNode | null => {
  if (isFirebaseConfigured) {
    return null;
  }

  return <FirebaseUnavailable feature={feature} />;
};
