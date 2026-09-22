import { collection, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { withFirebasePage } from "@/common/withFirebasePage/withFirebasePage";
import type { Team, Project, RiskInsight } from "@/lib/domain/types";
import { TeamDetailPageClient } from "@/components/teams/TeamDetailPageClient";
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

  return withFirebasePage("Team details", async () => {
    if (!id) {
      return null;
    }

    const teamDoc = await getDoc(doc(db!, "teams", id));

    if (!teamDoc.exists()) {
      return null;
    }

    const teamData = teamDoc.data() as Omit<Team, "id">;
    const team: Team = { ...teamData, id: teamDoc.id };

    const [teamProjects, teamRisks] = await Promise.all([
      getCollectionQueryWithId<Project>(
        query(collection(db!, "projects"), where("teamId", "==", id)),
      ),
      getCollectionQueryWithId<RiskInsight>(
        query(collection(db!, "riskInsights"), where("teamId", "==", id)),
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
  });
};

export default TeamDetailPage;
