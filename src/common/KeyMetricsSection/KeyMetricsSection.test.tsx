import { render, screen } from "@testing-library/react";
import { tzrTestId } from "@tzardom-ui/react";
import { describe, expect, it } from "vitest";
import { KeyMetricsSection } from "./KeyMetricsSection";

const texts = {
  section1: { label: "Section 1", helperText: "First metric" },
  section2: { label: "Section 2", helperText: "Second metric" },
  section3: { label: "Section 3", helperText: "Third metric" },
};

describe("KeyMetricsSection", () => {
  it("renders three metric cards with stable test ids", () => {
    render(
      <KeyMetricsSection
        section1={1}
        section2={2}
        section3={3}
        texts={texts}
      />,
    );

    for (const value of ["1", "2", "3"]) {
      expect(
        screen.getByTestId(tzrTestId("metricCard", value)),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(tzrTestId("metricCard", value, "value")),
      ).toHaveTextContent(value);
    }
    expect(screen.getByText("Section 2")).toBeInTheDocument();
    expect(screen.getByText("Third metric")).toBeInTheDocument();
  });
});
