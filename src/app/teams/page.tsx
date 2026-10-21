import { requireFirebase } from '@/features/auth/requireFirebase';
import { TeamsView } from '@/features/teams/TeamsView';
import type { Team } from '@/lib/domain/types';
import { getCollectionWithId } from '@/lib/firebase/collections';

export const dynamic = 'force-static';

const TeamsPage = async () => {
  const unavailable = requireFirebase('Teams');

  if (unavailable) {
    return unavailable;
  }

  const teams = await getCollectionWithId<Team>('teams');

  return <TeamsView teams={teams} />;
};

export default TeamsPage;
