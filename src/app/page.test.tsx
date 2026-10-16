import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/widgets/ChartsSection/ChartsSection", () => ({
  ChartsSection: () => <div data-testid="charts-section" />,
}));

import { Providers } from "@/providers/Providers";
import { HomePageClient } from "@/views/home/HomePageClient";
import {
  teams as mockTeams,
  projects as mockProjects,
  riskInsights as mockRiskInsights,
} from "@/lib/domain/mockData";

describe("Home page", () => {
  it("renders overview heading and key sections", () => {
    const totalTeams = mockTeams.length;
    const totalProjects = mockProjects.length;
    const highRiskCount = mockRiskInsights.filter(
      (insight) => insight.severity === "high",
    ).length;

    render(
      <Providers>
        <HomePageClient
          totalTeams={totalTeams}
          totalProjects={totalProjects}
          highRiskCount={highRiskCount}
        />
      </Providers>,
    );

    expect(screen.getByTestId("home-overview-section")).toBeInTheDocument();
    expect(screen.getByTestId("key-metrics-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("capacity-and-risk-widgets")).toBeInTheDocument();
    expect(screen.getByTestId("charts-section")).toBeInTheDocument();
  });
});
