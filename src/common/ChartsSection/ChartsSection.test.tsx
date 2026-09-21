import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("@/lib/domain/metrics", () => ({
  getCapacitySnapshotsForTeam: vi.fn(),
  getTeamCapacityForSprint: vi.fn(),
  getTeamWorkloadForSprint: vi.fn(),
}));

vi.mock("@/components/charts/CapacityOverTimeChart", () => ({
  CapacityOverTimeChart: ({ title }: any) => <div>{title}</div>,
}));

vi.mock("@/components/charts/WorkloadVsCapacityChart", () => ({
  WorkloadVsCapacityChart: ({ title }: any) => <div>{title}</div>,
}));

import { useQuery } from "@tanstack/react-query";
import {
  getCapacitySnapshotsForTeam,
  getTeamCapacityForSprint,
  getTeamWorkloadForSprint,
} from "@/lib/domain/metrics";
import { ChartsSection } from "./ChartsSection";

const mockedUseQuery = useQuery as unknown as ReturnType<typeof vi.fn>;
const mockedGetCapacitySnapshotsForTeam =
  getCapacitySnapshotsForTeam as unknown as ReturnType<typeof vi.fn>;
const mockedGetTeamCapacityForSprint =
  getTeamCapacityForSprint as unknown as ReturnType<typeof vi.fn>;
const mockedGetTeamWorkloadForSprint =
  getTeamWorkloadForSprint as unknown as ReturnType<typeof vi.fn>;

const baseTexts = {
  heading: "Capacity & workload",
  description:
    "How this team's planned capacity compares to workload over sprints.",
  loading: "Loading charts…",
  error: "Unable to load charts for this team right now.",
  notFound: "This team could not be found.",
  noData: "Not enough data yet to show charts for this team.",
  capacityOverTimeTitle: "Capacity over time",
  workloadVsCapacityTitle: "Workload vs capacity",
  currentSprintFallback: "Current sprint",
};

describe("ChartsSection", () => {
  it("shows loading state", () => {
    mockedUseQuery.mockReturnValue({ isLoading: true });

    render(<ChartsSection teamId="team-1" texts={baseTexts} />);

    expect(screen.getByTestId("charts-section")).toBeInTheDocument();
    expect(screen.getByText(/Loading charts/i)).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockedUseQuery.mockReturnValue({ isLoading: false, isError: true });

    render(<ChartsSection teamId="team-1" texts={baseTexts} />);

    expect(screen.getByTestId("charts-section")).toBeInTheDocument();
    expect(
      screen.getByText(/Unable to load charts for this team right now/i),
    ).toBeInTheDocument();
  });

  it("shows not found state when team is missing", () => {
    mockedUseQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        teams: [],
        sprints: [],
        projects: [],
      },
    });

    render(<ChartsSection teamId="team-1" texts={baseTexts} />);

    expect(screen.getByTestId("charts-section")).toBeInTheDocument();
    expect(
      screen.getByText(/This team could not be found/i),
    ).toBeInTheDocument();
  });

  it("shows not enough data state when no snapshots or workload", () => {
    mockedUseQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        teams: [
          {
            id: "team-1",
            name: "Team 1",
            members: [],
          },
        ],
        sprints: [],
        projects: [],
      },
    });

    mockedGetCapacitySnapshotsForTeam.mockReturnValue([]);

    render(<ChartsSection teamId="team-1" texts={baseTexts} />);

    expect(screen.getByTestId("charts-section")).toBeInTheDocument();
    expect(
      screen.getByText(/Not enough data yet to show charts for this team/i),
    ).toBeInTheDocument();
  });

  it("renders charts when data is available", () => {
    mockedUseQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        teams: [
          {
            id: "team-1",
            name: "Team 1",
            members: [
              {
                id: "member-1",
                name: "Alex",
                role: "Engineer",
                skills: [],
                capacityPerSprint: 10,
              },
            ],
          },
        ],
        sprints: [
          {
            id: "sprint-1",
            name: "Sprint 1",
            startDate: "2026-03-16",
            endDate: "2026-03-29",
          },
        ],
        projects: [],
      },
    });

    mockedGetCapacitySnapshotsForTeam.mockReturnValue([
      {
        sprintId: "sprint-1",
        sprintName: "Sprint 1",
        capacity: 10,
        workload: 8,
      },
    ]);
    mockedGetTeamCapacityForSprint.mockReturnValue(10);
    mockedGetTeamWorkloadForSprint.mockReturnValue(8);

    render(<ChartsSection teamId="team-1" texts={baseTexts} />);

    expect(
      screen.getByRole("heading", { name: /capacity & workload/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Capacity over time/i)).toBeInTheDocument();
    expect(screen.getByText(/Workload vs capacity/i)).toBeInTheDocument();
  });
});
