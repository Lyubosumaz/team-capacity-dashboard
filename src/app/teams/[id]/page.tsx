import { notFound } from "next/navigation";
import { collection, doc, getDoc, query, where } from "firebase/firestore";
import { getDb } from "@/lib/firebase/firestore";
import { requireFirebase } from "@/components/firebase/requireFirebase";
import type { Team, Project, RiskInsight } from "@/lib/domain/types";
import { TeamDetailPageClient } from "@/views/teams/TeamDetailPageClient";
import { getCollectionQueryWithId } from "@/lib/firebase/collections";

type TeamPageParams = {
  id: string;
};

const TeamDetailPage = async ({
  params,
}: {
  params: Promise<TeamPageParams>;
}) => {
  const { id } = await params;

  const unavailable = requireFirebase("Team details");

  if (unavailable) {
    return unavailable;
  }

  if (!id) {
    notFound();
  }

  const db = getDb();
  const teamDoc = await getDoc(doc(db, "teams", id));

  if (!teamDoc.exists()) {
    notFound();
  }

  const teamData = teamDoc.data() as Omit<Team, "id">;
  const team: Team = { ...teamData, id: teamDoc.id };

  const [teamProjects, teamRisks] = await Promise.all([
    getCollectionQueryWithId<Project>(
      query(collection(db, "projects"), where("teamId", "==", id)),
    ),
    getCollectionQueryWithId<RiskInsight>(
      query(collection(db, "riskInsights"), where("teamId", "==", id)),
    ),
  ]);

  const totalCapacity = team.members.reduce(
    (sum, member) => sum + member.capacityPerSprint,
    0,
  );

  return (
    <TeamDetailPageClient
      team={team}
      projects={teamProjects}
      risks={teamRisks}
      totalCapacity={totalCapacity}
    />
  );
};

export default TeamDetailPage;
