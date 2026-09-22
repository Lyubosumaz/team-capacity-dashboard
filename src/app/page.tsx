import type { Team, Project, RiskInsight } from "@/lib/domain/types";
import { HomePageClient } from "@/components/home/HomePageClient";
import { getCollectionWithId } from "@/lib/firebase/collections";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import {
  teams as mockTeams,
  projects as mockProjects,
  riskInsights as mockRiskInsights,
} from "@/lib/domain/mockData";

const Home = async () => {
  const [teams, projects, riskInsights]: [Team[], Project[], RiskInsight[]] =
    isFirebaseConfigured
      ? await Promise.all([
          getCollectionWithId<Team>("teams"),
          getCollectionWithId<Project>("projects"),
          getCollectionWithId<RiskInsight>("riskInsights"),
        ])
      : [mockTeams, mockProjects, mockRiskInsights];

  const totalTeams = teams.length;
  const totalProjects = projects.length;
  const highRiskCount = riskInsights.filter(
    (insight) => insight.severity === "high",
  ).length;

  return (
    <HomePageClient
      totalTeams={totalTeams}
      totalProjects={totalProjects}
      highRiskCount={highRiskCount}
    />
  );
};

export default Home;
