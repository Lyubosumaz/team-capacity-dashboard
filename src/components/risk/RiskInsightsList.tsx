import type { FC } from "react";

import type { Team, RiskInsight, RiskRule } from "@/lib/domain/types";

type RiskInsightsListProps = {
  insights: RiskInsight[];
  rules: RiskRule[];
  teams: Team[];
  overCapacityTeamIds: string[];
  texts: {
    heading: string;
    emptyState: string;
    fallbackTitle: string;
    unassignedTeam: string;
    overCapacitySuffix: string;
    severityHigh: string;
    severityMedium: string;
    severityLow: string;
  };
};

export const RiskInsightsList: FC<RiskInsightsListProps> = ({
  insights,
  rules,
  teams,
  overCapacityTeamIds,
  texts,
}) => {
  if (insights.length === 0) {
    return (
      <section className="space-y-3" data-testid="risk-insights-list">
        <h2
          id="risk-insights-heading"
          className="text-sm font-semibold uppercase tracking-wide opacity-70"
        >
          {texts.heading}
        </h2>
        <p className="text-xs opacity-80">{texts.emptyState}</p>
      </section>
    );
  }

  const overCapacitySet = new Set(overCapacityTeamIds);

  return (
    <section className="space-y-3" data-testid="risk-insights-list">
      <h2
        id="risk-insights-heading"
        className="text-sm font-semibold uppercase tracking-wide opacity-70"
      >
        {texts.heading}
      </h2>
      <ul className="space-y-2 text-sm">
        {insights.map((insight) => {
          const rule = rules.find(
            (candidate) => candidate.id === insight.ruleId,
          );
          const team = insight.teamId
            ? teams.find((candidate) => candidate.id === insight.teamId)
            : undefined;

          const severityLabel =
            insight.severity === "high"
              ? texts.severityHigh
              : insight.severity === "medium"
                ? texts.severityMedium
                : texts.severityLow;

          const severityClassName =
            insight.severity === "high"
              ? "bg-danger-soft text-danger"
              : insight.severity === "medium"
                ? "bg-warning-soft text-warning"
                : "bg-success-soft text-success";

          const isTeamOverCapacity = team && overCapacitySet.has(team.id);

          return (
            <li
              key={insight.id}
              className="rounded-md border border-border-subtle bg-background px-3 py-2"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">
                  {rule?.name ?? texts.fallbackTitle}
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${severityClassName}`}
                >
                  {severityLabel}
                </span>
              </div>
              <p className="mt-1 text-xs opacity-90">{insight.message}</p>
              <p className="mt-1 text-[11px] opacity-70">
                {team ? team.name : texts.unassignedTeam}
                {isTeamOverCapacity && ` ${texts.overCapacitySuffix}`}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
