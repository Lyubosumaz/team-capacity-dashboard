import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KeyMetricsSection } from "@/shared/widgets/KeyMetricsSection";

const texts = {
  section1: { label: "Section 1", helperText: "First metric" },
  section2: { label: "Section 2", helperText: "Second metric" },
  section3: { label: "Section 3", helperText: "Third metric" },
};

describe("KeyMetricsSection", () => {
  it("renders three metric cards with their labels and values", () => {
    render(
      <KeyMetricsSection
        section1={1}
        section2={2}
        section3={3}
        texts={texts}
      />,
    );

    for (const index of [1, 2, 3]) {
      const card = screen.getByTestId(`key-metrics-card-${index}`);
      expect(card).toHaveTextContent(`Section ${index}`);
      expect(card).toHaveTextContent(String(index));
    }
    expect(screen.getByTestId("key-metrics-card-3")).toHaveTextContent(
      "Third metric",
    );
  });
});
