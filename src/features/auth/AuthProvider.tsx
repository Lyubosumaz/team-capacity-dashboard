'use client';

import type { User } from 'firebase/auth';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { isFirebaseConfigured } from '@/lib/firebase/config';

// Firebase Auth loads after the page shows, so it's not in every page's bundle.
const loadAuth = async () => {
  const [{ auth }, firebaseAuth] = await Promise.all([
    import('@/lib/firebase/client'),
    import('firebase/auth'),
  ]);
  return { auth, firebaseAuth };
};

export type AuthContextValue = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // Without Firebase there's no user to wait for, so we start not loading.
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return;
    }

    let unsubscribe = () => {};
    let stopped = false;

    loadAuth().then(({ auth, firebaseAuth }) => {
      if (stopped || !auth) {
        return;
      }
      unsubscribe = firebaseAuth.onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
    });

    return () => {
      stopped = true;
      unsubscribe();
    };
  }, []);

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      loading,
      logout: async () => {
        const { auth, firebaseAuth } = await loadAuth();
        if (!auth) {
          return;
        }
        await firebaseAuth.signOut(auth);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
