import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useTeamsOverCapacity } from "./useTeamsOverCapacity";
import { useUpcomingRiskEvents } from "./useUpcomingRiskEvents";
import { CapacityAndRiskWidgetsSection } from "./CapacityAndRiskWidgetsSection";

vi.mock("./useTeamsOverCapacity", () => ({
  useTeamsOverCapacity: vi.fn(),
}));
vi.mock("./useUpcomingRiskEvents", () => ({
  useUpcomingRiskEvents: vi.fn(),
}));

const mockedTeams = vi.mocked(useTeamsOverCapacity);
const mockedEvents = vi.mocked(useUpcomingRiskEvents);

describe("CapacityAndRiskWidgetsSection", () => {
  it("shows the teams over capacity and the upcoming events", () => {
    mockedTeams.mockReturnValue({
      status: "ready",
      teams: [{ id: "team-1", name: "Mock Team", workload: 15, capacity: 10 }],
    });
    mockedEvents.mockReturnValue({
      status: "ready",
      events: [
        {
          id: "event-1",
          label: "Mock vacation",
          description: "Mock person is off",
          date: "2026-11-02",
        },
      ],
    });

    render(<CapacityAndRiskWidgetsSection />);

    expect(screen.getByTestId("teams-over-capacity")).toHaveTextContent(
      "Mock Team",
    );
    expect(screen.getByTestId("upcoming-risk-events")).toHaveTextContent(
      "Mock vacation",
    );
  });

  it("passes each widget its loading state", () => {
    mockedTeams.mockReturnValue({ status: "loading", teams: [] });
    mockedEvents.mockReturnValue({ status: "loading", events: [] });

    render(<CapacityAndRiskWidgetsSection />);

    expect(screen.getByTestId("teams-over-capacity")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(screen.getByTestId("upcoming-risk-events")).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });
});
