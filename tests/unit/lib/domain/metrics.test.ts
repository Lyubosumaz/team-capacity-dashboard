import { describe, expect, it } from 'vitest';
import {
  getCapacitySnapshotsForTeam,
  getTeamCapacityForSprint,
  getTeamsOverCapacity,
  getTeamWorkloadForSprint,
  getUpcomingRiskEvents,
} from '@/lib/domain/metrics';
import type { Project, RiskEvent, Sprint, Team } from '@/lib/domain/types';

const team: Team = {
  id: 'team-1',
  name: 'Team One',
  members: [
    {
      id: 'm1',
      name: 'Alice',
      role: 'Engineer',
      skills: [],
      capacityPerSprint: 10,
      isKeyPerson: true,
    },
    {
      id: 'm2',
      name: 'Bob',
      role: 'Engineer',
      skills: [],
      capacityPerSprint: 15,
      isKeyPerson: false,
    },
  ],
};

const sprint: Sprint = {
  id: 'sprint-1',
  name: 'Sprint 1',
  startDate: '2026-03-01',
  endDate: '2026-03-14',
};

const projects: Project[] = [
  {
    id: 'p1',
    name: 'Project A',
    teamId: 'team-1',
    sprintId: 'sprint-1',
    estimatedEffort: 20,
  },
  {
    id: 'p2',
    name: 'Project B',
    teamId: 'team-2',
    sprintId: 'sprint-1',
    estimatedEffort: 5,
  },
];

const teams: Team[] = [team];

const events: RiskEvent[] = [
  {
    id: 'e1',
    teamId: 'team-1',
    date: '2026-03-10',
    type: 'vacation',
    description: 'Vacation',
  },
  {
    id: 'e2',
    teamId: 'team-1',
    date: '2026-02-01',
    type: 'vacation',
    description: 'Past',
  },
];

describe('metrics', () => {
  it('computes team capacity per sprint', () => {
    expect(getTeamCapacityForSprint(team)).toBe(25);
  });

  it('computes workload for a team and sprint', () => {
    expect(getTeamWorkloadForSprint('team-1', sprint.id, projects)).toBe(20);
    expect(getTeamWorkloadForSprint('team-2', sprint.id, projects)).toBe(5);
  });

  it('identifies teams over capacity', () => {
    const over = getTeamsOverCapacity(teams, projects, sprint, 0.7);
    expect(over).toHaveLength(1);
    expect(over[0].team.id).toBe('team-1');
    expect(over[0].overCapacity).toBe(true);
  });

  it('filters upcoming risk events from a date', () => {
    const from = new Date('2026-03-01T00:00:00Z');
    const upcoming = getUpcomingRiskEvents(events, from, 10);
    expect(upcoming).toHaveLength(1);
    expect(upcoming[0].id).toBe('e1');
  });

  it('builds capacity snapshots for a team', () => {
    const snapshots = getCapacitySnapshotsForTeam(team, [sprint], projects);
    expect(snapshots).toHaveLength(1);
    expect(snapshots[0]).toMatchObject({
      sprintId: sprint.id,
      capacity: 25,
      workload: 20,
    });
  });
});
