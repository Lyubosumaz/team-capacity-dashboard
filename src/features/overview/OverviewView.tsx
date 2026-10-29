import {
  TzarPageHeader,
  type TzarRiskEvent,
  type TzarTeamCapacity,
} from '@tzardom-ui/react';
import { useTranslations } from 'next-intl';
import { CapacityAndRiskWidgetsSection } from '@/features/risk/CapacityAndRiskWidgetsSection';
import type { Project, Sprint, Team } from '@/lib/domain/types';
import { ChartsSection } from '@/shared/widgets/ChartsSection';
import { KeyMetricsSection } from '@/shared/widgets/KeyMetricsSection';

type OverviewViewProps = {
  totalTeams: number;
  totalProjects: number;
  highRiskCount: number;
  overCapacityTeams: TzarTeamCapacity[];
  upcomingEvents: TzarRiskEvent[];
  chartTeam?: Team;
  sprints: Sprint[];
  projects: Project[];
};

export const OverviewView = ({
  totalTeams,
  totalProjects,
  highRiskCount,
  overCapacityTeams,
  upcomingEvents,
  chartTeam,
  sprints,
  projects,
}: OverviewViewProps) => {
  const t = useTranslations();

  const keyMetricsLabels = {
    section1: {
      label: t('home.keyMetricsSection.teams.label'),
      helperText: t('home.keyMetricsSection.teams.helperText'),
    },
    section2: {
      label: t('home.keyMetricsSection.projects.label'),
      helperText: t('home.keyMetricsSection.projects.helperText'),
    },
    section3: {
      label: t('home.keyMetricsSection.highRiskInsights.label'),
      helperText: t('home.keyMetricsSection.highRiskInsights.helperText'),
    },
  };

  const chartsTexts = {
    noData: t('teams.detail.chartsSection.noData'),
    capacityOverTimeTitle: t(
      'teams.detail.chartsSection.capacityOverTimeTitle',
    ),
    workloadVsCapacityTitle: t(
      'teams.detail.chartsSection.workloadVsCapacityTitle',
    ),
    currentSprintFallback: t(
      'teams.detail.chartsSection.currentSprintFallback',
    ),
  };

  return (
    <section
      className="flex w-full flex-col gap-6"
      data-testid="home-overview-section"
    >
      <TzarPageHeader
        data-testid="home-header"
        title={t('home.overviewHeader.title')}
        description={t('home.overviewHeader.description')}
      />

      <KeyMetricsSection
        section1={totalTeams}
        section2={totalProjects}
        section3={highRiskCount}
        texts={keyMetricsLabels}
      />

      <CapacityAndRiskWidgetsSection
        overCapacityTeams={overCapacityTeams}
        upcomingEvents={upcomingEvents}
      />

      {chartTeam && (
        <ChartsSection
          team={chartTeam}
          sprints={sprints}
          projects={projects}
          withHeader={false}
          texts={chartsTexts}
        />
      )}
    </section>
  );
};
