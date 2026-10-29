import { TzarChart, TzarPageHeader } from '@tzardom-ui/react';
import {
  getCapacitySnapshotsForTeam,
  getTeamCapacityForSprint,
  getTeamWorkloadForSprint,
} from '@/lib/domain/metrics';
import type { ChartsSectionProps } from './ChartsSection.types';
import { ChartsSectionLayout } from './ChartsSectionLayout';

const CAPACITY_SERIES = [
  { key: 'capacity', label: 'Capacity', color: '#db2777' },
  { key: 'workload', label: 'Workload', color: '#0891b2' },
];

export const ChartsSection = ({
  team,
  sprints,
  projects,
  texts,
  withHeader = true,
}: ChartsSectionProps) => {
  const snapshots = getCapacitySnapshotsForTeam(team, sprints, projects);

  const currentSprint = sprints[0];
  const workloadData = currentSprint
    ? [
        {
          name: team.name,
          capacity: getTeamCapacityForSprint(team),
          workload: getTeamWorkloadForSprint(
            team.id,
            currentSprint.id,
            projects,
          ),
        },
      ]
    : [];

  if (snapshots.length === 0 && workloadData.length === 0) {
    return <ChartsSectionLayout texts={texts} message={texts.noData} />;
  }

  return (
    <section className="space-y-4">
      {withHeader && texts?.heading && texts?.description && (
        <TzarPageHeader
          data-testid="charts-section-header"
          title={texts.heading}
          description={texts.description}
          as="h2"
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {snapshots.length > 0 && (
          <TzarChart
            data-testid="capacity-over-time-chart"
            type="line"
            data={snapshots}
            xKey="sprintName"
            xLabel="Sprint"
            series={CAPACITY_SERIES}
            title={texts.capacityOverTimeTitle}
            subtitle={team.name}
          />
        )}

        {workloadData.length > 0 && (
          <TzarChart
            data-testid="workload-vs-capacity-chart"
            type="bar"
            data={workloadData}
            xKey="name"
            xLabel="Team"
            series={CAPACITY_SERIES}
            title={texts.workloadVsCapacityTitle}
            subtitle={
              currentSprint ? currentSprint.name : texts.currentSprintFallback
            }
          />
        )}
      </div>
    </section>
  );
};
