import {
  type TzarRiskEvent,
  type TzarTeamCapacity,
  TzarTeamsOverCapacity,
  TzarUpcomingRiskEvents,
} from '@tzardom-ui/react';

const CARD_CLASSES = 'rounded-lg border border-border-subtle bg-background p-4';

type CapacityAndRiskWidgetsSectionProps = {
  overCapacityTeams: TzarTeamCapacity[];
  upcomingEvents: TzarRiskEvent[];
};

export const CapacityAndRiskWidgetsSection = ({
  overCapacityTeams,
  upcomingEvents,
}: CapacityAndRiskWidgetsSectionProps) => {
  return (
    <div
      className="grid w-full gap-4 sm:gap-6 md:grid-cols-2"
      data-testid="capacity-and-risk-widgets"
    >
      <TzarTeamsOverCapacity
        data-testid="teams-over-capacity"
        title="Teams over capacity this sprint"
        status="ready"
        teams={overCapacityTeams}
        usedText="utilised"
        className={CARD_CLASSES}
      />
      <TzarUpcomingRiskEvents
        data-testid="upcoming-risk-events"
        title="Upcoming risk events"
        status="ready"
        events={upcomingEvents}
        className={CARD_CLASSES}
      />
    </div>
  );
};
