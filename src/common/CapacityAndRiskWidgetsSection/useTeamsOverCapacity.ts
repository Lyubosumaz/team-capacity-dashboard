import { useQuery } from "@tanstack/react-query";
import type { TzarTeamCapacity, TzarWidgetStatus } from "@tzardom-ui/react";
import { api } from "@/lib/api/client";
import { getTeamsOverCapacity } from "@/lib/domain/metrics";

type TeamsOverCapacity = {
  status: TzarWidgetStatus;
  teams: TzarTeamCapacity[];
};

export const useTeamsOverCapacity = (): TeamsOverCapacity => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["teams-over-capacity"],
    queryFn: async () => {
      const [teams, projects, sprints] = await Promise.all([
        api.getTeams(),
        api.getProjects(),
        api.getSprints(),
      ]);
      return { teams, projects, sprints };
    },
  });

  if (isLoading) {
    return { status: "loading", teams: [] };
  }

  if (isError || !data || data.sprints.length === 0) {
    return { status: "error", teams: [] };
  }

  const teams = getTeamsOverCapacity(
    data.teams,
    data.projects,
    data.sprints[0],
    1,
  ).map(({ team, workload, capacity }) => ({
    id: team.id,
    name: team.name,
    workload,
    capacity,
  }));

  return { status: "ready", teams };
};
