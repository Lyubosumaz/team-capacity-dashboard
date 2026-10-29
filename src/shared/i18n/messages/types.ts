export const locales = ['en', 'bg', 'ka'] as const;
export type Locale = (typeof locales)[number];

export const LOCALE_COOKIE = 'locale';

export type Messages = {
  header: {
    title: string;
    subtitle: string;
    nav: {
      overview: string;
      risk: string;
      teams: string;
    };
    login: string;
  };
  footer: {
    copyright: string;
    appName: string;
    builtWith: string;
  };
  home: {
    overviewHeader: {
      title: string;
      description: string;
    };
    keyMetricsSection: {
      teams: {
        label: string;
        helperText: string;
      };
      projects: {
        label: string;
        helperText: string;
      };
      highRiskInsights: {
        label: string;
        helperText: string;
      };
    };
    chartsSection: {
      capacityOverTimeTitle: string;
      workloadVsCapacityTitle: string;
    };
  };
  teams: {
    overviewHeader: {
      title: string;
      description: string;
    };
    list: {
      membersSuffixSingular: string;
      membersSuffixPlural: string;
      viewLabel: string;
    };
    detail: {
      pageDescription: string;
      membersSection: {
        heading: string;
        nameColumn: string;
        roleColumn: string;
        skillsColumn: string;
        capacityPerSprintColumn: string;
        totalCapacityRow: string;
        keyBadge: string;
        noSkillsPlaceholder: string;
      };
      projectsAndRisksSection: {
        heading: string;
        projectsHeading: string;
        projectsEmpty: string;
        risksHeading: string;
        risksEmpty: string;
      };
      chartsSection: {
        heading: string;
        description: string;
        noData: string;
        capacityOverTimeTitle: string;
        workloadVsCapacityTitle: string;
        currentSprintFallback: string;
      };
    };
  };
  risk: {
    overviewHeader: {
      title: string;
      description: string;
    };
    metricsSection: {
      highRiskInsights: {
        label: string;
        helperText: string;
      };
      highRiskTeams: {
        label: string;
        helperText: string;
      };
      upcomingEvents: {
        label: string;
        helperText: string;
      };
    };
    insightsList: {
      heading: string;
      emptyState: string;
      fallbackTitle: string;
      unassignedTeam: string;
      overCapacitySuffix: string;
      severity: {
        high: string;
        medium: string;
        low: string;
      };
    };
  };
  sashe: {
    message: string;
  };
  auth: {
    login: {
      title: string;
      description: string;
      emailLabel: string;
      passwordLabel: string;
      submitLabel: string;
      submittingLabel: string;
      error: string;
    };
    register: {
      title: string;
      description: string;
      emailLabel: string;
      passwordLabel: string;
      confirmPasswordLabel: string;
      submitLabel: string;
      submittingLabel: string;
      error: string;
    };
  };
};
