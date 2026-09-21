import type { Team, Project, RiskInsight } from "@/lib/domain/types";
import { HomePageClient } from "@/components/home/HomePageClient";
import { getCollectionWithId } from "@/lib/firebase/collections";

const Home = async () => {
  const [teams, projects, riskInsights] = await Promise.all([
    getCollectionWithId<Team>("teams"),
    getCollectionWithId<Project>("projects"),
    getCollectionWithId<RiskInsight>("riskInsights"),
  ]);

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
