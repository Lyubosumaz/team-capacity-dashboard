"use client";

import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { getTeamsOverCapacity } from "@/lib/domain/metrics";

export const TeamsOverCapacityWidget: FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["teams-over-capacity"],
    queryFn: async () => {
      const [teams, projects, sprints] = await Promise.all([
        api.getTeams(),
        api.getProjects(),
        api.getSprints(),
      ]);
      return { teams, projects, sprints };
    },
  });

  if (isLoading) {
    return (
      <section
        className="space-y-2 text-xs opacity-80"
        data-testid="teams-over-capacity-widget"
      >
        <p>Loading capacity data…</p>
      </section>
    );
  }

  if (isError || !data || data.sprints.length === 0) {
    return (
      <section
        className="space-y-2 text-xs opacity-80"
        data-testid="teams-over-capacity-widget"
      >
        <p>Unable to load capacity data right now.</p>
      </section>
    );
  }

  const sprint = data.sprints[0];
  const overCapacity = getTeamsOverCapacity(
    data.teams,
    data.projects,
    sprint,
    1,
  );

  return (
    <section className="space-y-2" data-testid="teams-over-capacity-widget">
      <h2
        id="teams-over-capacity-heading"
        className="text-sm font-semibold uppercase tracking-wide opacity-70"
      >
        Teams over capacity this sprint
      </h2>
      {overCapacity.length === 0 ? (
        <p className="text-xs opacity-80">
          No teams are currently over capacity.
        </p>
      ) : (
        <ul className="space-y-1 text-sm">
          {overCapacity.map(({ team, capacity, workload, utilization }) => (
            <li key={team.id} className="flex items-center justify-between">
              <span className="font-medium">{team.name}</span>
              <span className="text-xs opacity-80">
                {workload}/{capacity} ({Math.round(utilization * 100)}%
                utilised)
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
