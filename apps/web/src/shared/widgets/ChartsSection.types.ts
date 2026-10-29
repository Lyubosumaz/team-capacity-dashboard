import type { Project, Sprint, Team } from '@/lib/domain/types';

export type ChartsSectionTexts = {
  heading?: string;
  description?: string;
  noData: string;
  capacityOverTimeTitle: string;
  workloadVsCapacityTitle: string;
  currentSprintFallback: string;
};

export type ChartsSectionProps = {
  team: Team;
  sprints: Sprint[];
  projects: Project[];
  texts: ChartsSectionTexts;
  withHeader?: boolean;
};

export type ChartsSectionLayoutProps = {
  texts?: ChartsSectionTexts;
  message?: string;
};
