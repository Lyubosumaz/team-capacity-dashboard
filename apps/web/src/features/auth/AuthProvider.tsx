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
import { deleteSession, saveSession } from './session';

// Gives the server the browser's current login, or removes it on logout.
const syncSession = async (firebaseUser: User | null) => {
  if (firebaseUser) {
    await saveSession(await firebaseUser.getIdToken());
  } else {
    await deleteSession();
  }
};

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
  // True until the browser's login is known and shared with the server.
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
      // Runs on login and logout, and each time Firebase renews the login
      // token (about every hour), so the server's copy never goes stale.
      unsubscribe = firebaseAuth.onIdTokenChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        syncSession(firebaseUser)
          .catch((error) => console.error('Could not share the login', error))
          .finally(() => setLoading(false));
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
        // Remove the server session first, so the pages lock right away.
        await deleteSession();
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
