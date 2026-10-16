"use client";

import type { ReactNode } from "react";
import { useFirebase } from "@/providers/FirebaseProvider";
import { FirebaseUnavailable } from "./FirebaseUnavailable";

type FirebaseGateProps = {
  feature: string;
  children: ReactNode;
};

// Shows FirebaseUnavailable instead of children when Firebase isn't configured.
// For client-only pages; pages that fetch on the server use requireFirebase().
export const FirebaseGate = ({ feature, children }: FirebaseGateProps) => {
  const { isConfigured } = useFirebase();

  if (!isConfigured) {
    return <FirebaseUnavailable feature={feature} />;
  }

  return children;
};
