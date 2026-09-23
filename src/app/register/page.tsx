import type { FC } from "react";
import { RegisterPageClient } from "@/components/auth/RegisterPageClient";
import { FirebaseGate } from "@/common/FirebaseGate/FirebaseGate";

const RegisterPage: FC = () => (
  <FirebaseGate feature="Registration">
    <RegisterPageClient />
  </FirebaseGate>
);

export default RegisterPage;
