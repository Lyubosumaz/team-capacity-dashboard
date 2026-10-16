import type { Team } from "@/lib/domain/types";
import { TeamsPageClient } from "@/views/teams/TeamsPageClient";
import { getCollectionWithId } from "@/lib/firebase/collections";
import { requireFirebase } from "@/components/firebase/requireFirebase";

export const dynamic = "force-static";

const TeamsPage = async () => {
  const unavailable = requireFirebase("Teams");

  if (unavailable) {
    return unavailable;
  }

  const teams = await getCollectionWithId<Team>("teams");

  return <TeamsPageClient teams={teams} />;
};

export default TeamsPage;
