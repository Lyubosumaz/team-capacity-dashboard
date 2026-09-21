import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

import { useQuery } from "@tanstack/react-query";
import { UpcomingRiskEventsWidget } from "./UpcomingRiskEventsWidget";

const mockedUseQuery = useQuery as unknown as ReturnType<typeof vi.fn>;

describe("UpcomingRiskEventsWidget", () => {
  it("shows loading state", () => {
    mockedUseQuery.mockReturnValue({ isLoading: true });

    render(<UpcomingRiskEventsWidget />);

    expect(
      screen.getByTestId("upcoming-risk-events-widget"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Loading upcoming risk events/i),
    ).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockedUseQuery.mockReturnValue({ isLoading: false, isError: true });

    render(<UpcomingRiskEventsWidget />);

    expect(
      screen.getByTestId("upcoming-risk-events-widget"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Unable to load upcoming risk events right now/i),
    ).toBeInTheDocument();
  });
});
