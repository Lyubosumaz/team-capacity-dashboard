"use client";

import type { FC } from "react";
import type { Team, RiskInsight, RiskRule } from "@/lib/domain/types";
import { useLocalization } from "@/providers/LocalizationProvider";
import { CapacityAndRiskWidgetsSection } from "@/common/CapacityAndRiskWidgetsSection/CapacityAndRiskWidgetsSection";
import { RiskInsightsList } from "@/components/risk/RiskInsightsList";
import { TzarPageHeader } from "@tzardom-ui/react";
import { KeyMetricsSection } from "@/common/KeyMetricsSection/KeyMetricsSection";

type RiskPageClientProps = {
  highRiskInsightsCount: number;
  highRiskTeamsCount: number;
  upcomingEventsCount: number;
  insights: RiskInsight[];
  rules: RiskRule[];
  teams: Team[];
  overCapacityTeamIds: string[];
};

export const RiskPageClient: FC<RiskPageClientProps> = ({
  highRiskInsightsCount,
  highRiskTeamsCount,
  upcomingEventsCount,
  insights,
  rules,
  teams,
  overCapacityTeamIds,
}) => {
  const { t } = useLocalization();

  return (
    <section className="flex w-full flex-col gap-6">
      <TzarPageHeader
        data-testid="risk-header"
        title={t("risk.overviewHeader.title")}
        description={t("risk.overviewHeader.description")}
      />

      <KeyMetricsSection
        section1={highRiskInsightsCount}
        section2={highRiskTeamsCount}
        section3={upcomingEventsCount}
        texts={{
          section1: {
            label: t("risk.metricsSection.highRiskInsights.label"),
            helperText: t("risk.metricsSection.highRiskInsights.helperText"),
          },
          section2: {
            label: t("risk.metricsSection.highRiskTeams.label"),
            helperText: t("risk.metricsSection.highRiskTeams.helperText"),
          },
          section3: {
            label: t("risk.metricsSection.upcomingEvents.label"),
            helperText: t("risk.metricsSection.upcomingEvents.helperText"),
          },
        }}
      />

      <CapacityAndRiskWidgetsSection />

      <RiskInsightsList
        insights={insights}
        rules={rules}
        teams={teams}
        overCapacityTeamIds={overCapacityTeamIds}
        texts={{
          heading: t("risk.insightsList.heading"),
          emptyState: t("risk.insightsList.emptyState"),
          fallbackTitle: t("risk.insightsList.fallbackTitle"),
          unassignedTeam: t("risk.insightsList.unassignedTeam"),
          overCapacitySuffix: t("risk.insightsList.overCapacitySuffix"),
          severityHigh: t("risk.insightsList.severity.high"),
          severityMedium: t("risk.insightsList.severity.medium"),
          severityLow: t("risk.insightsList.severity.low"),
        }}
      />
    </section>
  );
};
