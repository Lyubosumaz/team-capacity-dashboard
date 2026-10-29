import { describe, expect, it } from 'vitest';
import {
  getOverCapacityItems,
  getUpcomingEventItems,
} from '@/features/risk/riskWidgets';
import type { Project, RiskEvent, Sprint, Team } from '@/lib/domain/types';

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

const sprint: Sprint = {
  id: 'sprint-1',
  name: 'Mock Sprint',
  startDate: '2026-01-01',
  endDate: '2026-01-14',
};

const projects: Project[] = [
  {
    id: 'project-1',
    name: 'Mock Project',
    teamId: 'team-1',
    sprintId: 'sprint-1',
    estimatedEffort: 15,
  },
];

const events: RiskEvent[] = [
  {
    id: 'event-past',
    teamId: 'team-1',
    date: '2000-01-01',
    type: 'absence',
    description: 'Mock past absence',
  },
  {
    id: 'event-future',
    teamId: 'team-1',
    date: '2999-01-01',
    type: 'vacation',
    description: 'Mock person is off',
  },
];

describe('getOverCapacityItems', () => {
  it('lists teams over capacity in the current sprint', () => {
    expect(getOverCapacityItems([team], projects, [sprint])).toEqual([
      { id: 'team-1', name: 'Mock Team', workload: 15, capacity: 10 },
    ]);
  });

  it('returns nothing when there are no sprints', () => {
    expect(getOverCapacityItems([team], projects, [])).toEqual([]);
  });
});

describe('getUpcomingEventItems', () => {
  it('keeps future events and adds the label and team name', () => {
    expect(getUpcomingEventItems(events, [team])).toEqual([
      {
        id: 'event-future',
        label: 'Vacation',
        teamName: 'Mock Team',
        description: 'Mock person is off',
        date: '2999-01-01',
      },
    ]);
  });
});
