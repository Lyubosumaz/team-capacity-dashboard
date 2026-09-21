import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CapacityOverTimeChart } from "./CapacityOverTimeChart";

const sampleData = [
  {
    sprintId: "s1",
    sprintName: "Sprint 1",
    capacity: 10,
    workload: 8,
  },
];

describe("CapacityOverTimeChart", () => {
  it("renders title and subtitle when data is present", () => {
    render(
      <CapacityOverTimeChart
        data={sampleData}
        title="Capacity over time"
        subtitle="Team Alpha"
      />,
    );

    expect(screen.getByTestId("capacity-over-time-chart")).toBeInTheDocument();
    expect(screen.getByText("Capacity over time")).toBeInTheDocument();
    expect(screen.getByText("Team Alpha")).toBeInTheDocument();
  });

  it("renders nothing when data is empty", () => {
    const { container } = render(<CapacityOverTimeChart data={[]} />);

    expect(container.firstChild).toBeNull();
  });
});
