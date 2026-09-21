import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Providers } from "@/providers/Providers";
import { RiskPageClient } from "@/components/risk/RiskPageClient";
import {
  teams as mockTeams,
  projects as mockProjects,
  riskRules as mockRiskRules,
  riskInsights as mockRiskInsights,
  riskEvents as mockRiskEvents,
  sprints as mockSprints,
} from "@/lib/domain/mockData";
import {
  getTeamsOverCapacity,
  getUpcomingRiskEvents,
} from "@/lib/domain/metrics";

describe("Risk page", () => {
  it("renders risk overview heading and key sections", () => {
    const highRiskInsights = mockRiskInsights.filter(
      (insight) => insight.severity === "high",
    );

    const highRiskTeamsCount = new Set(
      highRiskInsights
        .map((insight) => insight.teamId)
        .filter((id): id is string => Boolean(id)),
    ).size;

    const upcomingEvents = getUpcomingRiskEvents(
      mockRiskEvents,
      new Date(),
      50,
    );

    const teamsOverCapacity =
      mockSprints.length > 0
        ? getTeamsOverCapacity(mockTeams, mockProjects, mockSprints[0], 1)
        : [];

    const overCapacityTeamIds = teamsOverCapacity.map(({ team }) => team.id);

    render(
      <Providers>
        <RiskPageClient
          highRiskInsightsCount={highRiskInsights.length}
          highRiskTeamsCount={highRiskTeamsCount}
          upcomingEventsCount={upcomingEvents.length}
          insights={mockRiskInsights}
          rules={mockRiskRules}
          teams={mockTeams}
          overCapacityTeamIds={overCapacityTeamIds}
        />
      </Providers>,
    );

    expect(
      screen.getByRole("heading", { name: /risk overview/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/High-risk insights/i)).toBeInTheDocument();
    expect(screen.getByTestId("capacity-and-risk-widgets")).toBeInTheDocument();
    expect(
      screen.getByTestId("teams-over-capacity-widget"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("upcoming-risk-events-widget"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("risk-insights-list")).toBeInTheDocument();
  });
});
