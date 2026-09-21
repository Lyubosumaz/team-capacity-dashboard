import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricCard } from "./MetricCard";

describe("MetricCard", () => {
  it("renders label, value and helper text", () => {
    render(
      <MetricCard
        label="Teams"
        value={3}
        helperText="Active teams in the org."
      />,
    );

    expect(screen.getByText("Teams")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText(/active teams in the org/i)).toBeInTheDocument();
  });
});
