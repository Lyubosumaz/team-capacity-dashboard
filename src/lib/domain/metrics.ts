import type {
  CapacitySnapshot,
  Project,
  RiskEvent,
  Sprint,
  Team,
} from './types';

export const getTeamCapacityForSprint = (team: Team): number => {
  return team.members.reduce(
    (sum, member) => sum + member.capacityPerSprint,
    0,
  );
};

export const getTeamWorkloadForSprint = (
  teamId: string,
  sprintId: string,
  projects: Project[],
): number => {
  return projects
    .filter(
      (project) => project.teamId === teamId && project.sprintId === sprintId,
    )
    .reduce((sum, project) => sum + project.estimatedEffort, 0);
};

export const getTeamsOverCapacity = (
  teams: Team[],
  projects: Project[],
  sprint: Sprint,
  threshold = 1,
) => {
  return teams
    .map((team) => {
      const capacity = getTeamCapacityForSprint(team);
      const workload = getTeamWorkloadForSprint(team.id, sprint.id, projects);
      const utilization = capacity === 0 ? 0 : workload / capacity;

      return {
        team,
        capacity,
        workload,
        utilization,
        overCapacity: utilization > threshold,
      };
    })
    .filter((entry) => entry.overCapacity)
    .sort((a, b) => b.utilization - a.utilization);
};

export const getUpcomingRiskEvents = (
  events: RiskEvent[],
  fromDate: Date,
  limit = 5,
): RiskEvent[] => {
  const from = fromDate.toISOString().slice(0, 10);

  return events
    .filter((event) => event.date >= from)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
};

export const getCapacitySnapshotsForTeam = (
  team: Team,
  sprints: Sprint[],
  projects: Project[],
): CapacitySnapshot[] => {
  return sprints.map((sprint) => {
    const capacity = getTeamCapacityForSprint(team);
    const workload = getTeamWorkloadForSprint(team.id, sprint.id, projects);

    return {
      sprintId: sprint.id,
      sprintName: sprint.name,
      capacity,
      workload,
    };
  });
};

// Keeps only the items (projects, risks, events) that belong to these teams.
export const forTeams = <T extends { teamId?: string }>(
  items: T[],
  teams: Team[],
): T[] => {
  const teamIds = new Set(teams.map((team) => team.id));

  return items.filter(
    (item) => item.teamId !== undefined && teamIds.has(item.teamId),
  );
};
