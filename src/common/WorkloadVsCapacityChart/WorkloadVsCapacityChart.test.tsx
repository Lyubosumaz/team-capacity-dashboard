import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WorkloadVsCapacityChart } from "./WorkloadVsCapacityChart";

const sampleData = [{ name: "Team Alpha", capacity: 10, workload: 8 }];

describe("WorkloadVsCapacityChart", () => {
  it("renders title and subtitle when data is present", () => {
    render(
      <WorkloadVsCapacityChart
        data={sampleData}
        title="Workload vs capacity"
        subtitle="Sprint 1"
      />,
    );

    expect(
      screen.getByTestId("workload-vs-capacity-chart"),
    ).toBeInTheDocument();
    expect(screen.getByText("Workload vs capacity")).toBeInTheDocument();
    expect(screen.getByText("Sprint 1")).toBeInTheDocument();
  });

  it("renders nothing when data is empty", () => {
    const { container } = render(<WorkloadVsCapacityChart data={[]} />);

    expect(container.firstChild).toBeNull();
  });
});
