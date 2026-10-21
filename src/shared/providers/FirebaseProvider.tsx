"use client";

import { createContext, useContext, type ReactNode } from "react";
import { isFirebaseConfigured } from "@/lib/firebase/config";

export type FirebaseContextValue = {
  isConfigured: boolean;
};

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

type FirebaseProviderProps = {
  children: ReactNode;
  // Defaults to the real config; pass it in tests to force a state.
  isConfigured?: boolean;
};

export const FirebaseProvider = ({
  children,
  isConfigured = isFirebaseConfigured,
}: FirebaseProviderProps) => (
  <FirebaseContext.Provider value={{ isConfigured }}>
    {children}
  </FirebaseContext.Provider>
);

export const useFirebase = (): FirebaseContextValue => {
  const context = useContext(FirebaseContext);

  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }

  return context;
};
