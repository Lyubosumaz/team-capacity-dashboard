import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RiskInsightsList } from "./RiskInsightsList";
import { Providers } from "@/providers/Providers";

describe("RiskInsightsList", () => {
  it("renders empty state when there are no insights", () => {
    render(
      <Providers>
        <RiskInsightsList
          insights={[]}
          rules={[]}
          teams={[]}
          overCapacityTeamIds={[]}
          texts={{
            heading: "Risk insights",
            emptyState: "No risk insights have been identified yet.",
            fallbackTitle: "Risk insight",
            unassignedTeam: "Unassigned team",
            overCapacitySuffix: "· Over capacity this sprint",
            severityHigh: "High",
            severityMedium: "Medium",
            severityLow: "Low",
          }}
        />
      </Providers>,
    );

    expect(screen.getByTestId("risk-insights-list")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /risk insights/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/no risk insights have been identified yet/i),
    ).toBeInTheDocument();
  });

  it("renders an insight with rule name, severity, message, and team", () => {
    const rules = [
      { id: "rule-1", name: "High work-in-progress", description: "" },
    ];
    const teams = [
      {
        id: "team-1",
        name: "Engineering",
        members: [],
      },
    ];
    const insights = [
      {
        id: "insight-1",
        ruleId: "rule-1",
        teamId: "team-1",
        severity: "high" as const,
        message: "Team has too many items in progress.",
      },
    ];

    render(
      <Providers>
        <RiskInsightsList
          insights={insights}
          rules={rules}
          teams={teams}
          overCapacityTeamIds={[]}
          texts={{
            heading: "Risk insights",
            emptyState: "No risk insights have been identified yet.",
            fallbackTitle: "Risk insight",
            unassignedTeam: "Unassigned team",
            overCapacitySuffix: "· Over capacity this sprint",
            severityHigh: "High",
            severityMedium: "Medium",
            severityLow: "Low",
          }}
        />
      </Providers>,
    );

    expect(screen.getByTestId("risk-insights-list")).toBeInTheDocument();
    expect(screen.getByText("High work-in-progress")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(
      screen.getByText(/team has too many items in progress/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
  });

  it("falls back to generic title when rule is missing", () => {
    const insights = [
      {
        id: "insight-1",
        ruleId: "missing-rule",
        teamId: undefined,
        severity: "low" as const,
        message: "Some low severity issue.",
      },
    ];

    render(
      <Providers>
        <RiskInsightsList
          insights={insights}
          rules={[]}
          teams={[]}
          overCapacityTeamIds={[]}
          texts={{
            heading: "Risk insights",
            emptyState: "No risk insights have been identified yet.",
            fallbackTitle: "Risk insight",
            unassignedTeam: "Unassigned team",
            overCapacitySuffix: "· Over capacity this sprint",
            severityHigh: "High",
            severityMedium: "Medium",
            severityLow: "Low",
          }}
        />
      </Providers>,
    );

    expect(screen.getByTestId("risk-insights-list")).toBeInTheDocument();
    expect(screen.getByText("Risk insight")).toBeInTheDocument();
    expect(screen.getByText("Unassigned team")).toBeInTheDocument();
  });

  it("marks team as over capacity when id is in overCapacityTeamIds", () => {
    const teams = [
      {
        id: "team-1",
        name: "Engineering",
        members: [],
      },
    ];
    const insights = [
      {
        id: "insight-1",
        ruleId: "rule-1",
        teamId: "team-1",
        severity: "medium" as const,
        message: "Some medium severity issue.",
      },
    ];
    const rules = [{ id: "rule-1", name: "Rule", description: "" }];

    render(
      <Providers>
        <RiskInsightsList
          insights={insights}
          rules={rules}
          teams={teams}
          overCapacityTeamIds={["team-1"]}
          texts={{
            heading: "Risk insights",
            emptyState: "No risk insights have been identified yet.",
            fallbackTitle: "Risk insight",
            unassignedTeam: "Unassigned team",
            overCapacitySuffix: "· Over capacity this sprint",
            severityHigh: "High",
            severityMedium: "Medium",
            severityLow: "Low",
          }}
        />
      </Providers>,
    );

    expect(
      screen.getByText(/engineering · over capacity this sprint/i),
    ).toBeInTheDocument();
  });
});
