import { RegisterPageClient } from "@/views/auth/RegisterPageClient";
import { FirebaseGate } from "@/components/firebase/FirebaseGate";

const RegisterPage = () => (
  <FirebaseGate feature="Registration">
    <RegisterPageClient />
  </FirebaseGate>
);

export default RegisterPage;
