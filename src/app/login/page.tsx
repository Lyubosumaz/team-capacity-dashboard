import type { FC } from "react";
import { LoginPageClient } from "@/components/auth/LoginPageClient";
import { FirebaseGate } from "@/common/FirebaseGate/FirebaseGate";

const LoginPage: FC = () => (
  <FirebaseGate feature="Sign in">
    <LoginPageClient />
  </FirebaseGate>
);

export default LoginPage;
