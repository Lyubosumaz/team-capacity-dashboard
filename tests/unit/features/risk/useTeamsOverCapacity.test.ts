import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useQuery } from "@tanstack/react-query";
import { useTeamsOverCapacity } from "@/features/risk/useTeamsOverCapacity";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

const mockedUseQuery = useQuery as unknown as ReturnType<typeof vi.fn>;

const team = (id: string, capacityPerSprint: number) => ({
  id,
  name: `Team ${id}`,
  members: [{ capacityPerSprint }],
});

describe("useTeamsOverCapacity", () => {
  it("is loading while the query loads", () => {
    mockedUseQuery.mockReturnValue({ isLoading: true });

    const { result } = renderHook(() => useTeamsOverCapacity());

    expect(result.current).toEqual({ status: "loading", teams: [] });
  });

  it("is an error when the query fails", () => {
    mockedUseQuery.mockReturnValue({ isLoading: false, isError: true });

    const { result } = renderHook(() => useTeamsOverCapacity());

    expect(result.current).toEqual({ status: "error", teams: [] });
  });

  it("is an error when there is no sprint", () => {
    mockedUseQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { teams: [team("a", 10)], projects: [], sprints: [] },
    });

    const { result } = renderHook(() => useTeamsOverCapacity());

    expect(result.current.status).toBe("error");
  });

  it("is ready with no teams when nobody is over capacity", () => {
    mockedUseQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        teams: [team("a", 10)],
        projects: [],
        sprints: [{ id: "sprint-1" }],
      },
    });

    const { result } = renderHook(() => useTeamsOverCapacity());

    expect(result.current).toEqual({ status: "ready", teams: [] });
  });
});
