import { FirebaseGate } from '@/features/auth/FirebaseGate';
import { LoginView } from '@/features/auth/LoginView';

const LoginPage = () => (
  <FirebaseGate feature="Sign in">
    <LoginView />
  </FirebaseGate>
);

export default LoginPage;
