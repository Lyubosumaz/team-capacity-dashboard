import { AccountView } from '@/features/account/AccountView';
import { getCurrentUser } from '@/features/auth/currentUser';
import { LoginRequired } from '@/features/auth/LoginRequired';

const UserPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return <LoginRequired />;
  }

  return <AccountView />;
};

export default UserPage;
