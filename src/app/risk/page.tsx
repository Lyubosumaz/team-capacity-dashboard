import { requireFirebase } from '@/features/auth/requireFirebase';
import { RiskView } from '@/features/risk/RiskView';
import {
  getOverCapacityItems,
  getUpcomingEventItems,
} from '@/features/risk/riskWidgets';
import { getUpcomingRiskEvents } from '@/lib/domain/metrics';
import type {
  Project,
  RiskEvent,
  RiskInsight,
  RiskRule,
  Sprint,
  Team,
} from '@/lib/domain/types';
import { getCollectionWithId } from '@/lib/firebase/collections';

const RiskPage = async () => {
  const unavailable = requireFirebase('Risk insights');

  if (unavailable) {
    return unavailable;
  }

  const [teams, projects, sprints, riskRules, riskInsights, riskEvents] =
    await Promise.all([
      getCollectionWithId<Team>('teams'),
      getCollectionWithId<Project>('projects'),
      getCollectionWithId<Sprint>('sprints'),
      getCollectionWithId<RiskRule>('riskRules'),
      getCollectionWithId<RiskInsight>('riskInsights'),
      getCollectionWithId<RiskEvent>('riskEvents'),
    ]);

  const highRiskInsights = riskInsights.filter(
    (insight) => insight.severity === 'high',
  );

  const highRiskTeamsCount = new Set(
    highRiskInsights
      .map((insight) => insight.teamId)
      .filter((id): id is string => Boolean(id)),
  ).size;

  const upcomingEvents = getUpcomingRiskEvents(riskEvents, new Date(), 50);

  const overCapacityTeams = getOverCapacityItems(teams, projects, sprints);

  const upcomingEventItems = getUpcomingEventItems(riskEvents, teams);

  return (
    <RiskView
      highRiskInsightsCount={highRiskInsights.length}
      highRiskTeamsCount={highRiskTeamsCount}
      upcomingEventsCount={upcomingEvents.length}
      insights={riskInsights}
      rules={riskRules}
      teams={teams}
      overCapacityTeams={overCapacityTeams}
      upcomingEvents={upcomingEventItems}
    />
  );
};

export default RiskPage;
