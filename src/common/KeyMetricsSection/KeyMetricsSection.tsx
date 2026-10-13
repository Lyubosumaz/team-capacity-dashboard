import { FC } from "react";
import { TzarMetricCard } from "@tzardom-ui/react";

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
      <TzarMetricCard
        data-testid="1"
        label={texts.section1.label}
        value={section1}
        helperText={texts.section1.helperText}
      />
      <TzarMetricCard
        data-testid="2"
        label={texts.section2.label}
        value={section2}
        helperText={texts.section2.helperText}
      />
      <TzarMetricCard
        data-testid="3"
        label={texts.section3.label}
        value={section3}
        helperText={texts.section3.helperText}
      />
    </div>
  );
};
