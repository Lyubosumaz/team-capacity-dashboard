import { LoginPageClient } from "@/views/auth/LoginPageClient";
import { FirebaseGate } from "@/components/firebase/FirebaseGate";

const LoginPage = () => (
  <FirebaseGate feature="Sign in">
    <LoginPageClient />
  </FirebaseGate>
);

export default LoginPage;
