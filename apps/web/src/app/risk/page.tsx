import { getCurrentUser } from '@/features/auth/currentUser';
import { LoginRequired } from '@/features/auth/LoginRequired';
import { RiskView } from '@/features/risk/RiskView';
import {
  getOverCapacityItems,
  getUpcomingEventItems,
} from '@/features/risk/riskWidgets';
import { forTeams, getUpcomingRiskEvents } from '@/lib/domain/metrics';
import type {
  Project,
  RiskEvent,
  RiskInsight,
  RiskRule,
  Sprint,
  Team,
} from '@/lib/domain/types';
import {
  getCollectionWhere,
  getCollectionWithId,
} from '@/lib/firebase/collections';

const RiskPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return <LoginRequired />;
  }

  const [
    teams,
    allProjects,
    sprints,
    riskRules,
    allRiskInsights,
    allRiskEvents,
  ] = await Promise.all([
    getCollectionWhere<Team>('teams', 'ownerId', user.uid),
    getCollectionWithId<Project>('projects'),
    getCollectionWithId<Sprint>('sprints'),
    getCollectionWithId<RiskRule>('riskRules'),
    getCollectionWithId<RiskInsight>('riskInsights'),
    getCollectionWithId<RiskEvent>('riskEvents'),
  ]);

  // Only what belongs to the user's own teams.
  const projects = forTeams(allProjects, teams);
  const riskInsights = forTeams(allRiskInsights, teams);
  const riskEvents = forTeams(allRiskEvents, teams);

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
