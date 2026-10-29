export type MetricTexts = {
  label: string;
  helperText: string;
};

export type KeyMetricsSectionTexts = {
  section1: MetricTexts;
  section2: MetricTexts;
  section3: MetricTexts;
};

export type KeyMetricsSectionProps = {
  section1: number;
  section2: number;
  section3: number;
  texts: KeyMetricsSectionTexts;
};
