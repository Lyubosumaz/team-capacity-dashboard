import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useQuery } from "@tanstack/react-query";
import { useUpcomingRiskEvents } from "./useUpcomingRiskEvents";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

const mockedUseQuery = useQuery as unknown as ReturnType<typeof vi.fn>;

describe("useUpcomingRiskEvents", () => {
  it("is loading while the query loads", () => {
    mockedUseQuery.mockReturnValue({ isLoading: true });

    const { result } = renderHook(() => useUpcomingRiskEvents());

    expect(result.current).toEqual({ status: "loading", events: [] });
  });

  it("is an error when the query fails", () => {
    mockedUseQuery.mockReturnValue({ isLoading: false, isError: true });

    const { result } = renderHook(() => useUpcomingRiskEvents());

    expect(result.current).toEqual({ status: "error", events: [] });
  });

  it("returns future events with a label and the team's name", () => {
    mockedUseQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        teams: [{ id: "team-a", name: "Team A" }],
        events: [
          {
            id: "past",
            teamId: "team-a",
            type: "absence",
            description: "Already happened",
            date: "2000-01-01",
          },
          {
            id: "future",
            teamId: "team-a",
            type: "key_person_unavailable",
            description: "Lead is away",
            date: "2999-01-01",
          },
          {
            id: "no-team",
            teamId: "unknown",
            type: "vacation",
            description: "Someone is off",
            date: "2999-01-02",
          },
        ],
      },
    });

    const { result } = renderHook(() => useUpcomingRiskEvents());

    expect(result.current).toEqual({
      status: "ready",
      events: [
        {
          id: "future",
          label: "Key person unavailable",
          teamName: "Team A",
          description: "Lead is away",
          date: "2999-01-01",
        },
        {
          id: "no-team",
          label: "Vacation",
          teamName: undefined,
          description: "Someone is off",
          date: "2999-01-02",
        },
      ],
    });
  });
});
