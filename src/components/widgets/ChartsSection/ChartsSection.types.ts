export type ChartsSectionTexts = {
  heading?: string;
  description?: string;
  loading: string;
  error: string;
  notFound: string;
  noData: string;
  capacityOverTimeTitle: string;
  workloadVsCapacityTitle: string;
  currentSprintFallback: string;
};

export type ChartsSectionProps = {
  teamId: string;
  texts: ChartsSectionTexts;
  withHeader?: boolean;
};

export type ChartsSectionLayoutProps = {
  texts?: ChartsSectionTexts;
  message?: string;
};
