import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useQuery } from "@tanstack/react-query";
import { TeamsOverCapacityWidget } from "./TeamsOverCapacityWidget";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

const mockedUseQuery = useQuery as unknown as ReturnType<typeof vi.fn>;

describe("TeamsOverCapacityWidget", () => {
  it("shows loading state", () => {
    mockedUseQuery.mockReturnValue({ isLoading: true });

    render(<TeamsOverCapacityWidget />);

    expect(
      screen.getByTestId("teams-over-capacity-widget"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Loading capacity data/i)).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockedUseQuery.mockReturnValue({ isLoading: false, isError: true });

    render(<TeamsOverCapacityWidget />);

    expect(
      screen.getByTestId("teams-over-capacity-widget"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Unable to load capacity data right now/i),
    ).toBeInTheDocument();
  });
});
