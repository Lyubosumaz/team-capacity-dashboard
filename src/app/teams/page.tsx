import type { Team } from "@/lib/domain/types";
import { TeamsView } from "@/features/teams/TeamsView";
import { getCollectionWithId } from "@/lib/firebase/collections";
import { requireFirebase } from "@/features/auth/requireFirebase";

export const dynamic = "force-static";

const TeamsPage = async () => {
  const unavailable = requireFirebase("Teams");

  if (unavailable) {
    return unavailable;
  }

  const teams = await getCollectionWithId<Team>("teams");

  return <TeamsView teams={teams} />;
};

export default TeamsPage;
