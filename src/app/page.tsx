import { OverviewView } from '@/features/overview/OverviewView';
import {
  getOverCapacityItems,
  getUpcomingEventItems,
} from '@/features/risk/riskWidgets';
import {
  projects as mockProjects,
  riskEvents as mockRiskEvents,
  riskInsights as mockRiskInsights,
  sprints as mockSprints,
  teams as mockTeams,
} from '@/lib/domain/mockData';
import type {
  Project,
  RiskEvent,
  RiskInsight,
  Sprint,
  Team,
} from '@/lib/domain/types';
import { getCollectionWithId } from '@/lib/firebase/collections';
import { isFirebaseConfigured } from '@/lib/firebase/config';

const CHART_TEAM_ID = 'team-alpha';

const Home = async () => {
  const [teams, projects, sprints, riskInsights, riskEvents]: [
    Team[],
    Project[],
    Sprint[],
    RiskInsight[],
    RiskEvent[],
  ] = isFirebaseConfigured
    ? await Promise.all([
        getCollectionWithId<Team>('teams'),
        getCollectionWithId<Project>('projects'),
        getCollectionWithId<Sprint>('sprints'),
        getCollectionWithId<RiskInsight>('riskInsights'),
        getCollectionWithId<RiskEvent>('riskEvents'),
      ])
    : [mockTeams, mockProjects, mockSprints, mockRiskInsights, mockRiskEvents];

  const highRiskCount = riskInsights.filter(
    (insight) => insight.severity === 'high',
  ).length;

  const overCapacityTeams = getOverCapacityItems(teams, projects, sprints);

  const upcomingEvents = getUpcomingEventItems(riskEvents, teams);

  const chartTeam = teams.find((team) => team.id === CHART_TEAM_ID);

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

export default Home;
