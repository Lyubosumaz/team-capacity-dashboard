"use client";

import type { FC, ReactNode } from "react";
import { useFirebase } from "@/providers/FirebaseProvider";
import { FirebaseUnavailable } from "@/common/FirebaseUnavailable/FirebaseUnavailable";

type FirebaseGateProps = {
  feature: string;
  children: ReactNode;
};

/**
 * Client-side guard for pages that only render client UI (login, register,
 * user). Renders `FirebaseUnavailable` instead of `children` when Firebase
 * isn't configured.
 *
 *   const LoginPage = () => (
 *     <FirebaseGate feature="Sign in">
 *       <LoginPageClient />
 *     </FirebaseGate>
 *   );
 *
 * NOT for pages that fetch data on the server: their server code runs before
 * this component ever sees `children`. Use `requireFirebase()` there.
 */
export const FirebaseGate: FC<FirebaseGateProps> = ({ feature, children }) => {
  const { isConfigured } = useFirebase();

  if (!isConfigured) {
    return <FirebaseUnavailable feature={feature} />;
  }

  return children;
};
