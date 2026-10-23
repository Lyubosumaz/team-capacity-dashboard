import type { Messages } from './types';

export const en: Messages = {
  header: {
    title: 'Team Capacity Dashboard',
    subtitle: 'Plan capacity, workload, and delivery risk.',
    nav: {
      overview: 'Overview',
      risk: 'Risk',
      teams: 'Teams',
    },
    login: 'Log in',
  },
  footer: {
    copyright: '© {year} lyubosumaz-projects',
    appName: 'Team Capacity Dashboard',
    builtWith: 'Built with Next.js & Tailwind CSS',
  },
  home: {
    overviewHeader: {
      title: 'Overview',
      description:
        'High-level view of team capacity, workload, and delivery risk across teams and projects.',
    },
    keyMetricsSection: {
      teams: {
        label: 'Teams',
        helperText: 'Active engineering teams in the organisation.',
      },
      projects: {
        label: 'Projects',
        helperText: 'Current projects planned for the active sprint.',
      },
      highRiskInsights: {
        label: 'High-risk insights',
        helperText: 'Potential delivery risks that need attention.',
      },
    },
    chartsSection: {
      capacityOverTimeTitle: 'Capacity over time',
      workloadVsCapacityTitle: 'Workload vs capacity per team',
    },
  },
  teams: {
    overviewHeader: {
      title: 'Teams',
      description:
        'Browse teams, see who is on each team, and drill down into their capacity and workload.',
    },
    list: {
      membersSuffixSingular: 'member',
      membersSuffixPlural: 'members',
      viewLabel: 'View',
    },
    detail: {
      pageDescription:
        'Team members, capacity per sprint, current projects, and trends.',
      membersSection: {
        heading: 'Members & capacity',
        nameColumn: 'Name',
        roleColumn: 'Role',
        skillsColumn: 'Skills',
        capacityPerSprintColumn: 'Capacity / sprint',
        totalCapacityRow: 'Total capacity',
        keyBadge: 'Key',
        noSkillsPlaceholder: '—',
      },
      projectsAndRisksSection: {
        heading: 'Projects & risks',
        projectsHeading: 'Projects this sprint',
        projectsEmpty: 'No projects are currently assigned to this team.',
        risksHeading: 'Risk insights',
        risksEmpty: 'No specific risks identified for this team.',
      },
      chartsSection: {
        heading: 'Capacity & workload',
        description:
          "How this team's planned capacity compares to workload over sprints.",
        loading: 'Loading charts…',
        error: 'Unable to load charts for this team right now.',
        notFound: 'This team could not be found.',
        noData: 'Not enough data yet to show charts for this team.',
        capacityOverTimeTitle: 'Capacity over time',
        workloadVsCapacityTitle: 'Workload vs capacity',
        currentSprintFallback: 'Current sprint',
      },
    },
  },
  risk: {
    overviewHeader: {
      title: 'Risk overview',
      description:
        'Focused view of delivery risks, capacity pressure, and upcoming events that could impact your teams.',
    },
    metricsSection: {
      highRiskInsights: {
        label: 'High-risk insights',
        helperText:
          'Potential delivery risks that are marked as high severity.',
      },
      highRiskTeams: {
        label: 'Teams with high risk',
        helperText: 'Teams with at least one high-severity insight.',
      },
      upcomingEvents: {
        label: 'Upcoming risk events',
        helperText: 'Vacations and critical events in the near future.',
      },
    },
    insightsList: {
      heading: 'Risk insights',
      emptyState: 'No risk insights have been identified yet.',
      fallbackTitle: 'Risk insight',
      unassignedTeam: 'Unassigned team',
      overCapacitySuffix: '· Over capacity this sprint',
      severity: {
        high: 'High',
        medium: 'Medium',
        low: 'Low',
      },
    },
  },
  sashe: {
    message: 'I love you Sashe',
  },
  auth: {
    login: {
      title: 'Log in',
      description: 'Sign in to access your team capacity dashboard.',
      emailLabel: 'Work email',
      passwordLabel: 'Password',
      submitLabel: 'Log in',
      submittingLabel: 'Logging in…',
      error: 'Unable to log in. Check your email and password.',
    },
    register: {
      title: 'Create an account',
      description: 'Register with your work email to get started.',
      emailLabel: 'Work email',
      passwordLabel: 'Password',
      confirmPasswordLabel: 'Confirm password',
      submitLabel: 'Sign up',
      submittingLabel: 'Creating account…',
      error: 'Unable to register. Please check your details and try again.',
    },
  },
};
