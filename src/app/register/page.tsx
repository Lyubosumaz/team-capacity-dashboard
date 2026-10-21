import { RegisterView } from "@/features/auth/RegisterView";
import { FirebaseGate } from "@/features/auth/FirebaseGate";

const RegisterPage = () => (
  <FirebaseGate feature="Registration">
    <RegisterView />
  </FirebaseGate>
);

export default RegisterPage;
