import { OverviewView } from '@/features/overview/OverviewView';
import {
  projects as mockProjects,
  riskInsights as mockRiskInsights,
  teams as mockTeams,
} from '@/lib/domain/mockData';
import type { Project, RiskInsight, Team } from '@/lib/domain/types';
import { getCollectionWithId } from '@/lib/firebase/collections';
import { isFirebaseConfigured } from '@/lib/firebase/config';

const Home = async () => {
  const [teams, projects, riskInsights]: [Team[], Project[], RiskInsight[]] =
    isFirebaseConfigured
      ? await Promise.all([
          getCollectionWithId<Team>('teams'),
          getCollectionWithId<Project>('projects'),
          getCollectionWithId<RiskInsight>('riskInsights'),
        ])
      : [mockTeams, mockProjects, mockRiskInsights];

  const totalTeams = teams.length;
  const totalProjects = projects.length;
  const highRiskCount = riskInsights.filter(
    (insight) => insight.severity === 'high',
  ).length;

  return (
    <OverviewView
      totalTeams={totalTeams}
      totalProjects={totalProjects}
      highRiskCount={highRiskCount}
    />
  );
};

export default Home;
