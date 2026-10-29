import { getCurrentUser } from '@/features/auth/currentUser';
import { LoginRequired } from '@/features/auth/LoginRequired';
import { OverviewView } from '@/features/overview/OverviewView';
import {
  getOverCapacityItems,
  getUpcomingEventItems,
} from '@/features/risk/riskWidgets';
import { forTeams } from '@/lib/domain/metrics';
import type {
  Project,
  RiskEvent,
  RiskInsight,
  Sprint,
  Team,
} from '@/lib/domain/types';
import {
  getCollectionWhere,
  getCollectionWithId,
} from '@/lib/firebase/collections';

const OverviewPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return <LoginRequired />;
  }

  const [teams, allProjects, sprints, allRiskInsights, allRiskEvents] =
    await Promise.all([
      getCollectionWhere<Team>('teams', 'ownerId', user.uid),
      getCollectionWithId<Project>('projects'),
      getCollectionWithId<Sprint>('sprints'),
      getCollectionWithId<RiskInsight>('riskInsights'),
      getCollectionWithId<RiskEvent>('riskEvents'),
    ]);

  // Only what belongs to the user's own teams.
  const projects = forTeams(allProjects, teams);
  const riskInsights = forTeams(allRiskInsights, teams);
  const riskEvents = forTeams(allRiskEvents, teams);

  const highRiskCount = riskInsights.filter(
    (insight) => insight.severity === 'high',
  ).length;

  const overCapacityTeams = getOverCapacityItems(teams, projects, sprints);

  const upcomingEvents = getUpcomingEventItems(riskEvents, teams);

  // The chart shows the first team; the team pages have one per team.
  const chartTeam = teams[0];

  return (
    <OverviewView
      totalTeams={teams.length}
      totalProjects={projects.length}
      highRiskCount={highRiskCount}
      overCapacityTeams={overCapacityTeams}
      upcomingEvents={upcomingEvents}
      chartTeam={chartTeam}
      sprints={sprints}
      projects={projects}
    />
  );
};

export default OverviewPage;
