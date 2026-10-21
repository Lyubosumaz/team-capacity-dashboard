import { FirebaseGate } from '@/features/auth/FirebaseGate';
import { RegisterView } from '@/features/auth/RegisterView';

const RegisterPage = () => (
  <FirebaseGate feature="Registration">
    <RegisterView />
  </FirebaseGate>
);

export default RegisterPage;
