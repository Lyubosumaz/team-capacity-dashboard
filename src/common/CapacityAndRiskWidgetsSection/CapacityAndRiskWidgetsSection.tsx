"use client";

import type { FC } from "react";
import {
  TzarTeamsOverCapacity,
  TzarUpcomingRiskEvents,
} from "@tzardom-ui/react";
import { useTeamsOverCapacity } from "./useTeamsOverCapacity";
import { useUpcomingRiskEvents } from "./useUpcomingRiskEvents";

const CARD_CLASSES = "rounded-lg border border-border-subtle bg-background p-4";

export const CapacityAndRiskWidgetsSection: FC = () => {
  const teamsOverCapacity = useTeamsOverCapacity();
  const upcomingRiskEvents = useUpcomingRiskEvents();

  return (
    <div
      className="grid w-full gap-4 sm:gap-6 md:grid-cols-2"
      data-testid="capacity-and-risk-widgets"
    >
      <TzarTeamsOverCapacity
        title="Teams over capacity this sprint"
        status={teamsOverCapacity.status}
        teams={teamsOverCapacity.teams}
        usedText="utilised"
        className={CARD_CLASSES}
        data-testid="widgets"
      />
      <TzarUpcomingRiskEvents
        title="Upcoming risk events"
        status={upcomingRiskEvents.status}
        events={upcomingRiskEvents.events}
        className={CARD_CLASSES}
        data-testid="widgets"
      />
    </div>
  );
};
