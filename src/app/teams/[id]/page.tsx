import { collection, doc, getDoc, query, where } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import { requireFirebase } from '@/features/auth/requireFirebase';
import { TeamDetailView } from '@/features/teams/TeamDetailView';
import type { Project, RiskInsight, Team } from '@/lib/domain/types';
import { getCollectionQueryWithId } from '@/lib/firebase/collections';
import { getDb } from '@/lib/firebase/firestore';

type TeamPageParams = {
  id: string;
};

const TeamDetailPage = async ({
  params,
}: {
  params: Promise<TeamPageParams>;
}) => {
  const { id } = await params;

  const unavailable = requireFirebase('Team details');

  if (unavailable) {
    return unavailable;
  }

  if (!id) {
    notFound();
  }

  const db = getDb();
  const teamDoc = await getDoc(doc(db, 'teams', id));

  if (!teamDoc.exists()) {
    notFound();
  }

  const teamData = teamDoc.data() as Omit<Team, 'id'>;
  const team: Team = { ...teamData, id: teamDoc.id };

  const [teamProjects, teamRisks] = await Promise.all([
    getCollectionQueryWithId<Project>(
      query(collection(db, 'projects'), where('teamId', '==', id)),
    ),
    getCollectionQueryWithId<RiskInsight>(
      query(collection(db, 'riskInsights'), where('teamId', '==', id)),
    ),
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
      totalCapacity={totalCapacity}
    />
  );
};

export default TeamDetailPage;
