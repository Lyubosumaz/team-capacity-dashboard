import type { FC } from "react";

import { TeamsOverCapacityWidget } from "@/common/CapacityAndRiskWidgetsSection/TeamsOverCapacityWidget";
import { UpcomingRiskEventsWidget } from "@/common/CapacityAndRiskWidgetsSection/UpcomingRiskEventsWidget";

type CapacityAndRiskWidgetsSectionProps = Record<string, never>;

export const CapacityAndRiskWidgetsSection: FC<
  CapacityAndRiskWidgetsSectionProps
> = () => {
  return (
    <div
      className="grid w-full gap-4 sm:gap-6 md:grid-cols-2"
      data-testid="capacity-and-risk-widgets"
    >
      <div className="rounded-lg border border-border-subtle bg-background p-4">
        <TeamsOverCapacityWidget />
      </div>
      <div className="rounded-lg border border-border-subtle bg-background p-4">
        <UpcomingRiskEventsWidget />
      </div>
    </div>
  );
};
