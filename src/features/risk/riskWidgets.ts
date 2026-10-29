import type { TzarRiskEvent, TzarTeamCapacity } from '@tzardom-ui/react';
import {
  getTeamsOverCapacity,
  getUpcomingRiskEvents,
} from '@/lib/domain/metrics';
import type { Project, RiskEvent, Sprint, Team } from '@/lib/domain/types';

const EVENT_LABELS: Record<RiskEvent['type'], string> = {
  vacation: 'Vacation',
  absence: 'Absence',
  key_person_unavailable: 'Key person unavailable',
};

export const getOverCapacityItems = (
  teams: Team[],
  projects: Project[],
  sprints: Sprint[],
): TzarTeamCapacity[] => {
  const currentSprint = sprints[0];

  if (!currentSprint) {
    return [];
  }

  return getTeamsOverCapacity(teams, projects, currentSprint).map(
    ({ team, workload, capacity }) => ({
      id: team.id,
      name: team.name,
      workload,
      capacity,
    }),
  );
};

export const getUpcomingEventItems = (
  events: RiskEvent[],
  teams: Team[],
): TzarRiskEvent[] => {
  return getUpcomingRiskEvents(events, new Date(), 5).map((event) => ({
    id: event.id,
    label: EVENT_LABELS[event.type],
    teamName: teams.find((team) => team.id === event.teamId)?.name,
    description: event.description,
    date: event.date,
  }));
};
