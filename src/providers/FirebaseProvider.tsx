"use client";

import { createContext, useContext, type FC, type ReactNode } from "react";
import { isFirebaseConfigured } from "@/lib/firebase/config";

export type FirebaseContextValue = {
  isConfigured: boolean;
};

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

type FirebaseProviderProps = {
  children: ReactNode;
  // Defaults to the real config (NEXT_PUBLIC_ env vars, inlined at build
  // time). Pass it explicitly in tests/Storybook to force either state
  // without mocking modules.
  isConfigured?: boolean;
};

export const FirebaseProvider: FC<FirebaseProviderProps> = ({
  children,
  isConfigured = isFirebaseConfigured,
}) => (
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
