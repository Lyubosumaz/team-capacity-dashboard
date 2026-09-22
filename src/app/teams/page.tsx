import type { Team } from "@/lib/domain/types";
import { TeamsPageClient } from "@/components/teams/TeamsPageClient";
import { getCollectionWithId } from "@/lib/firebase/collections";
import { withFirebasePage } from "@/common/withFirebasePage/withFirebasePage";

export const dynamic = "force-static";

const TeamsPage = async () =>
  withFirebasePage("Teams", async () => {
    const teams = await getCollectionWithId<Team>("teams");

    return <TeamsPageClient teams={teams} />;
  });

export default TeamsPage;
