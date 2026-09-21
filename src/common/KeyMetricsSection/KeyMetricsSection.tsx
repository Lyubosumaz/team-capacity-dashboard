import { FC } from "react";
import { MetricCard } from "./MetricCard";

type MetricTexts = {
  label: string;
  helperText: string;
};

type KeyMetricsSectionTexts = {
  section1: MetricTexts;
  section2: MetricTexts;
  section3: MetricTexts;
};

type KeyMetricsSectionProps = {
  section1: number;
  section2: number;
  section3: number;
  texts: KeyMetricsSectionTexts;
};

export const KeyMetricsSection: FC<KeyMetricsSectionProps> = ({
  section1,
  section2,
  section3,
  texts,
}) => {
  return (
    <div
      className="grid gap-4 sm:grid-cols-3 pb-10"
      data-testid="key-metrics-wrapper"
    >
      <MetricCard
        label={texts.section1.label}
        value={section1}
        helperText={texts.section1.helperText}
      />
      <MetricCard
        label={texts.section2.label}
        value={section2}
        helperText={texts.section2.helperText}
      />
      <MetricCard
        label={texts.section3.label}
        value={section3}
        helperText={texts.section3.helperText}
      />
    </div>
  );
};
