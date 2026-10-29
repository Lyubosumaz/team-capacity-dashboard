import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Project, Sprint, Team } from '@/lib/domain/types';
import { ChartsSection } from '@/shared/widgets/ChartsSection';

const texts = {
  heading: 'Capacity & workload',
  description:
    "How this team's planned capacity compares to workload over sprints.",
  noData: 'Not enough data yet to show charts for this team.',
  capacityOverTimeTitle: 'Capacity over time',
  workloadVsCapacityTitle: 'Workload vs capacity',
  currentSprintFallback: 'Current sprint',
};

const team: Team = {
  id: 'team-1',
  name: 'Mock Team',
  members: [
    {
      id: 'member-1',
      name: 'Mock Person',
      role: 'Engineer',
      skills: [],
      capacityPerSprint: 10,
    },
  ],
};

const sprints: Sprint[] = [
  {
    id: 'sprint-1',
    name: 'Mock Sprint',
    startDate: '2026-01-01',
    endDate: '2026-01-14',
  },
];

const projects: Project[] = [
  {
    id: 'project-1',
    name: 'Mock Project',
    teamId: 'team-1',
    sprintId: 'sprint-1',
    estimatedEffort: 8,
  },
];

describe('ChartsSection', () => {
  it('shows a message when there are no sprints', () => {
    render(
      <ChartsSection
        team={team}
        sprints={[]}
        projects={projects}
        texts={texts}
      />,
    );

    expect(screen.getByTestId('charts-section-message')).toHaveTextContent(
      texts.noData,
    );
  });

  it('renders both charts when there is data', () => {
    render(
      <ChartsSection
        team={team}
        sprints={sprints}
        projects={projects}
        texts={texts}
      />,
    );

    expect(screen.getByTestId('charts-section-header')).toHaveTextContent(
      texts.heading,
    );
    expect(screen.getByTestId('capacity-over-time-chart')).toHaveTextContent(
      texts.capacityOverTimeTitle,
    );
    expect(screen.getByTestId('workload-vs-capacity-chart')).toHaveTextContent(
      texts.workloadVsCapacityTitle,
    );
  });
});
