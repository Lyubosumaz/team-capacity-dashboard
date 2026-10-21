import { AccountView } from '@/features/account/AccountView';
import { FirebaseGate } from '@/features/auth/FirebaseGate';

const UserPage = () => (
  <FirebaseGate feature="Account">
    <AccountView />
  </FirebaseGate>
);

export default UserPage;
