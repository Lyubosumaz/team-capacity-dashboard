import { getCurrentUser } from '@/features/auth/currentUser';
import { LoginRequired } from '@/features/auth/LoginRequired';
import { TeamsView } from '@/features/teams/TeamsView';
import type { Team, UserProfile } from '@/lib/domain/types';
import {
  getCollectionWhere,
  getCollectionWithId,
} from '@/lib/firebase/collections';

const TeamsPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return <LoginRequired />;
  }

  const [teams, accounts] = await Promise.all([
    getCollectionWhere<Team>('teams', 'ownerId', user.uid),
    getCollectionWithId<UserProfile>('users', 'email'),
  ]);

  return <TeamsView teams={teams} accounts={accounts} />;
};

export default TeamsPage;
