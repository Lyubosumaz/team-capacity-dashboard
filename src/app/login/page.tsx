import { LoginView } from "@/features/auth/LoginView";
import { FirebaseGate } from "@/features/auth/FirebaseGate";

const LoginPage = () => (
  <FirebaseGate feature="Sign in">
    <LoginView />
  </FirebaseGate>
);

export default LoginPage;
