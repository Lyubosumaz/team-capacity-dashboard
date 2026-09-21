import type {
  Team,
  Project,
  Sprint,
  RiskRule,
  RiskInsight,
  RiskEvent,
} from "@/lib/domain/types";
import { getCollectionWithId } from "@/lib/firebase/collections";
import {
  getTeamsOverCapacity,
  getUpcomingRiskEvents,
} from "@/lib/domain/metrics";
import { RiskPageClient } from "@/components/risk/RiskPageClient";

const RiskPage = async () => {
  const [teams, projects, sprints, riskRules, riskInsights, riskEvents] =
    await Promise.all([
      getCollectionWithId<Team>("teams"),
      getCollectionWithId<Project>("projects"),
      getCollectionWithId<Sprint>("sprints"),
      getCollectionWithId<RiskRule>("riskRules"),
      getCollectionWithId<RiskInsight>("riskInsights"),
      getCollectionWithId<RiskEvent>("riskEvents"),
    ]);

  const highRiskInsights = riskInsights.filter(
    (insight) => insight.severity === "high",
  );

  const highRiskTeamsCount = new Set(
    highRiskInsights
      .map((insight) => insight.teamId)
      .filter((id): id is string => Boolean(id)),
  ).size;

  const upcomingEvents = getUpcomingRiskEvents(riskEvents, new Date(), 50);

  const teamsOverCapacity =
    sprints.length > 0
      ? getTeamsOverCapacity(teams, projects, sprints[0], 1)
      : [];

  const overCapacityTeamIds = teamsOverCapacity.map(({ team }) => team.id);

  return (
    <RiskPageClient
      highRiskInsightsCount={highRiskInsights.length}
      highRiskTeamsCount={highRiskTeamsCount}
      upcomingEventsCount={upcomingEvents.length}
      insights={riskInsights}
      rules={riskRules}
      teams={teams}
      overCapacityTeamIds={overCapacityTeamIds}
    />
  );
};

export default RiskPage;
