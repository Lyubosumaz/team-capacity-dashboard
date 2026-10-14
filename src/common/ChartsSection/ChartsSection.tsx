"use client";

import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import {
  getCapacitySnapshotsForTeam,
  getTeamCapacityForSprint,
  getTeamWorkloadForSprint,
} from "@/lib/domain/metrics";
import { TzarChart, TzarPageHeader } from "@tzardom-ui/react";
import { ChartsSectionLayout } from "./ChartsSectionLayout";

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

const CAPACITY_SERIES = [
  { key: "capacity", label: "Capacity" },
  { key: "workload", label: "Workload" },
];

type ChartsSectionProps = {
  teamId: string;
  texts: ChartsSectionTexts;
  withHeader?: boolean;
};

export const ChartsSection: FC<ChartsSectionProps> = ({
  teamId,
  texts,
  withHeader = true,
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["team-charts", teamId],
    queryFn: async () => {
      const [teams, sprints, projects] = await Promise.all([
        api.getTeams(),
        api.getSprints(),
        api.getProjects(),
      ]);

      return { teams, sprints, projects };
    },
  });

  if (isLoading) {
    return <ChartsSectionLayout texts={texts} message={texts.loading} />;
  }

  if (isError || !data) {
    return <ChartsSectionLayout texts={texts} message={texts.error} />;
  }

  const team = data.teams.find((t) => t.id === teamId);

  if (!team) {
    return <ChartsSectionLayout texts={texts} message={texts.notFound} />;
  }

  const snapshots = getCapacitySnapshotsForTeam(
    team.id,
    data.sprints,
    data.teams,
    data.projects,
  );

  const currentSprint = data.sprints[0];
  const workloadData = currentSprint
    ? [
        {
          name: team.name,
          capacity: getTeamCapacityForSprint(team),
          workload: getTeamWorkloadForSprint(
            team.id,
            currentSprint.id,
            data.projects,
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
          data-testid="charts"
          title={texts.heading}
          description={texts.description}
          as="h2"
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {snapshots.length > 0 && (
          <TzarChart
            type="line"
            data={snapshots}
            xKey="sprintName"
            xLabel="Sprint"
            series={CAPACITY_SERIES}
            title={texts.capacityOverTimeTitle}
            subtitle={team.name}
            data-testid="capacity-over-time"
          />
        )}

        {workloadData.length > 0 && (
          <TzarChart
            type="bar"
            data={workloadData}
            xKey="name"
            xLabel="Team"
            series={CAPACITY_SERIES}
            data-testid="workload-vs-capacity"
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
