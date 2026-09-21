import { render, screen } from "@testing-library/react";
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

    const cards = screen.getAllByTestId("metric-card");
    expect(cards).toHaveLength(3);
  });
});
