import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/currentUser';
import { LoginRequired } from '@/features/auth/LoginRequired';
import { TeamDetailView } from '@/features/teams/TeamDetailView';
import type {
  Project,
  RiskInsight,
  Sprint,
  Team,
  UserProfile,
} from '@/lib/domain/types';
import {
  getCollectionWhere,
  getCollectionWithId,
  getDocWithId,
} from '@/lib/firebase/collections';

type TeamPageParams = {
  id: string;
};

const TeamDetailPage = async ({
  params,
}: {
  params: Promise<TeamPageParams>;
}) => {
  const { id } = await params;

  const user = await getCurrentUser();

  if (!user) {
    return <LoginRequired />;
  }

  if (!id) {
    notFound();
  }

  const team = await getDocWithId<Team>('teams', id);

  // Other people's teams look like missing ones.
  if (!team || team.ownerId !== user.uid) {
    notFound();
  }

  const [teamProjects, teamRisks, sprints, accounts] = await Promise.all([
    getCollectionWhere<Project>('projects', 'teamId', id),
    getCollectionWhere<RiskInsight>('riskInsights', 'teamId', id),
    getCollectionWithId<Sprint>('sprints'),
    getCollectionWithId<UserProfile>('users', 'email'),
  ]);

  const totalCapacity = team.members.reduce(
    (sum, member) => sum + member.capacityPerSprint,
    0,
  );

  return (
    <TeamDetailView
      team={team}
      projects={teamProjects}
      risks={teamRisks}
      sprints={sprints}
      totalCapacity={totalCapacity}
      accounts={accounts}
    />
  );
};

export default TeamDetailPage;
