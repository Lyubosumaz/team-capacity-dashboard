import { TzarMetricCard } from "@tzardom-ui/react";
import type { KeyMetricsSectionProps } from "./KeyMetricsSection.types";

export const KeyMetricsSection = ({
  section1,
  section2,
  section3,
  texts,
}: KeyMetricsSectionProps) => {
  return (
    <div
      className="grid gap-4 sm:grid-cols-3 pb-10"
      data-testid="key-metrics-wrapper"
    >
      <TzarMetricCard
        data-testid="key-metrics-card-1"
        label={texts.section1.label}
        value={section1}
        helperText={texts.section1.helperText}
      />
      <TzarMetricCard
        data-testid="key-metrics-card-2"
        label={texts.section2.label}
        value={section2}
        helperText={texts.section2.helperText}
      />
      <TzarMetricCard
        data-testid="key-metrics-card-3"
        label={texts.section3.label}
        value={section3}
        helperText={texts.section3.helperText}
      />
    </div>
  );
};
