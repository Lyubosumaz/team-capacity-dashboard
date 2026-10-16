import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/widgets/ChartsSection/ChartsSection", () => ({
  ChartsSection: () => <div data-testid="charts-section" />,
}));

import { Providers } from "@/providers/Providers";
import { TeamDetailPageClient } from "@/views/teams/TeamDetailPageClient";
import {
  teams as mockTeams,
  projects as mockProjects,
  riskInsights as mockRiskInsights,
} from "@/lib/domain/mockData";

describe("TeamDetailPage", () => {
  it("renders team detail heading when team exists", async () => {
    const team = mockTeams.find((t) => t.id === "team-alpha");

    if (!team) {
      throw new Error("Expected mock team 'team-alpha' to exist");
    }

    const teamProjects = mockProjects.filter(
      (project) => project.teamId === team.id,
    );
    const teamRisks = mockRiskInsights.filter(
      (insight) => insight.teamId === team.id,
    );

    const totalCapacity = team.members.reduce(
      (sum, member) => sum + member.capacityPerSprint,
      0,
    );

    render(
      <Providers>
        <TeamDetailPageClient
          team={team}
          projects={teamProjects}
          risks={teamRisks}
          totalCapacity={totalCapacity}
        />
      </Providers>,
    );

    expect(screen.getByTestId("team-members-heading")).toHaveTextContent(
      /members & capacity/i,
    );
    expect(screen.getByTestId("team-projects-heading")).toHaveTextContent(
      /projects & risks/i,
    );
  });
});
