"use client";

import {
  TzarTeamsOverCapacity,
  TzarUpcomingRiskEvents,
} from "@tzardom-ui/react";
import { useTeamsOverCapacity } from "@/hooks/useTeamsOverCapacity";
import { useUpcomingRiskEvents } from "@/hooks/useUpcomingRiskEvents";

const CARD_CLASSES = "rounded-lg border border-border-subtle bg-background p-4";

export const CapacityAndRiskWidgetsSection = () => {
  const teamsOverCapacity = useTeamsOverCapacity();
  const upcomingRiskEvents = useUpcomingRiskEvents();

  return (
    <div
      className="grid w-full gap-4 sm:gap-6 md:grid-cols-2"
      data-testid="capacity-and-risk-widgets"
    >
      <TzarTeamsOverCapacity
        data-testid="teams-over-capacity"
        title="Teams over capacity this sprint"
        status={teamsOverCapacity.status}
        teams={teamsOverCapacity.teams}
        usedText="utilised"
        className={CARD_CLASSES}
      />
      <TzarUpcomingRiskEvents
        data-testid="upcoming-risk-events"
        title="Upcoming risk events"
        status={upcomingRiskEvents.status}
        events={upcomingRiskEvents.events}
        className={CARD_CLASSES}
      />
    </div>
  );
};
