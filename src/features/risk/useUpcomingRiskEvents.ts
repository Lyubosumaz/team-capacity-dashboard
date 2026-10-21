import { useQuery } from '@tanstack/react-query';
import type { TzarRiskEvent, TzarWidgetStatus } from '@tzardom-ui/react';
import { api } from '@/lib/api/client';
import { getUpcomingRiskEvents } from '@/lib/domain/metrics';
import type { RiskEvent } from '@/lib/domain/types';

const EVENT_LABELS: Record<RiskEvent['type'], string> = {
  vacation: 'Vacation',
  absence: 'Absence',
  key_person_unavailable: 'Key person unavailable',
};

type UpcomingRiskEvents = {
  status: TzarWidgetStatus;
  events: TzarRiskEvent[];
};

export const useUpcomingRiskEvents = (): UpcomingRiskEvents => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['upcoming-risk-events'],
    queryFn: async () => {
      const [teams, riskBundle] = await Promise.all([
        api.getTeams(),
        api.getRiskBundle(),
      ]);
      return { teams, events: riskBundle.events };
    },
  });

  if (isLoading) {
    return { status: 'loading', events: [] };
  }

  if (isError || !data) {
    return { status: 'error', events: [] };
  }

  const events = getUpcomingRiskEvents(data.events, new Date(), 5).map(
    (event) => ({
      id: event.id,
      label: EVENT_LABELS[event.type],
      teamName: data.teams.find((team) => team.id === event.teamId)?.name,
      description: event.description,
      date: event.date,
    }),
  );

  return { status: 'ready', events };
};
