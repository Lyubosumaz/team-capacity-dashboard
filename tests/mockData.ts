import type {
  Project,
  RiskEvent,
  RiskInsight,
  RiskRule,
  Sprint,
  Team,
} from '@/lib/domain/types';

export const skills = [
  {
    id: 'skill-frontend',
    name: 'mock_Frontend',
    category: 'mock_Engineering',
  },
  {
    id: 'skill-backend',
    name: 'mock_Backend',
    category: 'mock_Engineering',
  },
  { id: 'skill-devops', name: 'mock_DevOps', category: 'mock_Engineering' },
  { id: 'skill-data', name: 'mock_Data', category: 'mock_Engineering' },
  { id: 'skill-ux', name: 'mock_UX', category: 'mock_Design' },
] as const;

export const teams: Team[] = [
  {
    id: 'team-alpha',
    name: 'mock_Team Alpha',
    members: [
      {
        id: 'member-1',
        name: 'mock_Alex',
        role: 'mock_Tech Lead',
        skills: [skills[0], skills[1]],
        capacityPerSprint: 30,
        isKeyPerson: true,
      },
      {
        id: 'member-2',
        name: 'mock_Blake',
        role: 'mock_Engineer',
        skills: [skills[0]],
        capacityPerSprint: 25,
      },
    ],
  },
  {
    id: 'team-bravo',
    name: 'mock_Team Bravo',
    members: [
      {
        id: 'member-3',
        name: 'mock_Jordan',
        role: 'mock_Engineer',
        skills: [skills[1]],
        capacityPerSprint: 28,
      },
      {
        id: 'member-4',
        name: 'mock_Dana',
        role: 'mock_Engineer',
        skills: [skills[0], skills[3]],
        capacityPerSprint: 22,
      },
    ],
  },
  {
    id: 'team-charlie',
    name: 'mock_Team Charlie (no charts)',
    members: [],
  },
  {
    id: 'team-delta',
    name: 'mock_Team Delta',
    members: [
      {
        id: 'member-5',
        name: 'mock_Eli',
        role: 'mock_Data Scientist',
        skills: [skills[3]],
        capacityPerSprint: 20,
      },
      {
        id: 'member-6',
        name: 'mock_Fern',
        role: 'mock_Designer',
        skills: [skills[4]],
        capacityPerSprint: 18,
      },
    ],
  },
  {
    id: 'team-omega',
    name: 'mock_Team Omega (no charts)',
    members: [],
  },
];

export const sprints: Sprint[] = [
  {
    id: 'sprint-1',
    name: 'mock_Sprint 1',
    startDate: '2026-03-16',
    endDate: '2026-03-29',
  },
  {
    id: 'sprint-2',
    name: 'mock_Sprint 2',
    startDate: '2026-03-30',
    endDate: '2026-04-12',
  },
  {
    id: 'sprint-3',
    name: 'mock_Sprint 3 (future)',
    startDate: '2026-04-13',
    endDate: '2026-04-26',
  },
];

export const projects: Project[] = [
  {
    id: 'project-dashboard',
    name: 'mock_Capacity Dashboard',
    description: 'mock_Internal tooling for capacity planning.',
    teamId: 'team-alpha',
    sprintId: 'sprint-1',
    estimatedEffort: 60,
  },
  {
    id: 'project-internal-tools',
    name: 'mock_Internal Tools',
    description: 'mock_Backlog work, light effort.',
    teamId: 'team-bravo',
    sprintId: 'sprint-2',
    estimatedEffort: 20,
  },
  {
    id: 'project-ml-platform',
    name: 'mock_ML Platform',
    description: 'mock_New internal machine learning platform.',
    teamId: 'team-delta',
    sprintId: 'sprint-2',
    estimatedEffort: 45,
  },
  {
    id: 'project-design-system',
    name: 'mock_Design System Refresh',
    description: 'mock_Revamp of shared UI components.',
    teamId: 'team-delta',
    sprintId: 'sprint-3',
    estimatedEffort: 30,
  },
];

export const riskRules: RiskRule[] = [
  {
    id: 'rule-overallocation',
    name: 'mock_Team overallocation',
    description: 'mock_Team workload exceeds available capacity.',
    severity: 'high',
  },
  {
    id: 'rule-key-person',
    name: 'mock_Key person dependency',
    description: 'mock_Too much work depends on a single key person.',
    severity: 'medium',
  },
  {
    id: 'rule-low-capacity',
    name: 'mock_Low team capacity',
    description: 'mock_Team has very low total capacity this sprint.',
    severity: 'medium',
  },
  {
    id: 'rule-future-project',
    name: 'mock_Upcoming heavy project',
    description: 'mock_Large project scheduled in an upcoming sprint.',
    severity: 'low',
  },
];

export const riskInsights: RiskInsight[] = [
  {
    id: 'insight-alpha-overallocated',
    ruleId: 'rule-overallocation',
    teamId: 'team-alpha',
    sprintId: 'sprint-1',
    message: 'mock_Team Alpha is at risk of being overallocated in Sprint 1.',
    severity: 'high',
  },
  {
    id: 'insight-bravo-low-capacity',
    ruleId: 'rule-low-capacity',
    teamId: 'team-bravo',
    sprintId: 'sprint-2',
    message: 'mock_Team Bravo has low available capacity in Sprint 2.',
    severity: 'medium',
  },
  {
    id: 'insight-delta-future-project',
    ruleId: 'rule-future-project',
    teamId: 'team-delta',
    sprintId: 'sprint-3',
    message: 'mock_Team Delta has a heavy project scheduled in Sprint 3.',
    severity: 'low',
  },
];

export const riskEvents: RiskEvent[] = [
  {
    id: 'event-alpha-vacation',
    teamId: 'team-alpha',
    memberId: 'member-1',
    date: '2026-03-25',
    type: 'vacation',
    description: 'mock_Alex on vacation for 3 days during Sprint 1.',
  },
  {
    id: 'event-bravo-absence',
    teamId: 'team-bravo',
    memberId: 'member-3',
    date: '2026-03-27',
    type: 'absence',
    description: 'mock_Casey attending offsite for 1 day.',
  },
  {
    id: 'event-delta-conference',
    teamId: 'team-delta',
    memberId: 'member-5',
    date: '2026-04-15',
    type: 'absence',
    description: 'mock_Eli speaking at an industry conference.',
  },
];
