import type { Messages } from './types';

export const bg: Messages = {
  header: {
    title: 'Табло за капацитет на екипа',
    subtitle: 'Планирай капацитет, натоварване и рискове при доставката.',
    nav: {
      overview: 'Общ преглед',
      risk: 'Рискове',
      teams: 'Екипи',
    },
    login: 'Вход',
  },
  footer: {
    copyright: '© {year} lyubosumaz-projects',
    appName: 'Табло за капацитет на екипа',
    builtWith: 'Изградено с Next.js и Tailwind CSS',
  },
  home: {
    overviewHeader: {
      title: 'Общ преглед',
      description:
        'Високо ниво на преглед на капацитета на екипите, натоварването и рисковете при доставката през екипи и проекти.',
    },
    keyMetricsSection: {
      teams: {
        label: 'Екипи',
        helperText: 'Активни инженерни екипи в организацията.',
      },
      projects: {
        label: 'Проекти',
        helperText: 'Текущи проекти, планирани за активния спринт.',
      },
      highRiskInsights: {
        label: 'Инсайти с висок риск',
        helperText:
          'Потенциални рискове при доставката, които изискват внимание.',
      },
    },
    chartsSection: {
      capacityOverTimeTitle: 'Капацитет във времето',
      workloadVsCapacityTitle: 'Натоварване спрямо капацитет по екипи',
    },
  },
  teams: {
    overviewHeader: {
      title: 'Екипи',
      description:
        'Разгледай екипите, виж кой в кой екип е и влез в детайли за техния капацитет и натоварване.',
    },
    list: {
      membersSuffixSingular: 'член',
      membersSuffixPlural: 'члена',
      viewLabel: 'Виж',
    },
    detail: {
      pageDescription:
        'Членове на екипа, капацитет на спринт, текущи проекти и тенденции.',
      membersSection: {
        heading: 'Членове и капацитет',
        nameColumn: 'Име',
        roleColumn: 'Роля',
        skillsColumn: 'Умения',
        capacityPerSprintColumn: 'Капацитет / спринт',
        totalCapacityRow: 'Общ капацитет',
        keyBadge: 'Ключов',
        noSkillsPlaceholder: '—',
      },
      projectsAndRisksSection: {
        heading: 'Проекти и рискове',
        projectsHeading: 'Проекти в този спринт',
        projectsEmpty:
          'В момента няма проекти, които са асоциирани с този екип.',
        risksHeading: 'Инсайти за риск',
        risksEmpty: 'Няма конкретни рискове, идентифицирани за този екип.',
      },
      chartsSection: {
        heading: 'Капацитет и натоварване',
        description:
          'Как планираният капацитет на екипа се сравнява с натоварването през спринтове.',
        noData:
          'Все още няма достатъчно данни за показване на графики за този екип.',
        capacityOverTimeTitle: 'Капацитет във времето',
        workloadVsCapacityTitle: 'Натоварване спрямо капацитет',
        currentSprintFallback: 'Текущ спринт',
      },
    },
  },
  risk: {
    overviewHeader: {
      title: 'Преглед на рисковете',
      description:
        'Фокусиран изглед към рисковете при доставката, натоварването и предстоящите събития, които могат да повлияят на екипите ти.',
    },
    metricsSection: {
      highRiskInsights: {
        label: 'Инсайти с висок риск',
        helperText:
          'Потенциални рискове при доставката, маркирани като висок приоритет.',
      },
      highRiskTeams: {
        label: 'Екипи с висок риск',
        helperText: 'Екипи с поне един инсайт с висок риск.',
      },
      upcomingEvents: {
        label: 'Предстоящи рискови събития',
        helperText: 'Отпуски и критични събития в близко бъдеще.',
      },
    },
    insightsList: {
      heading: 'Инсайти за риск',
      emptyState: 'Все още няма открити инсайти за риск.',
      fallbackTitle: 'Инсайт за риск',
      unassignedTeam: 'Неприсвоен екип',
      overCapacitySuffix: '· Над капацитет през този спринт',
      severity: {
        high: 'Висок',
        medium: 'Среден',
        low: 'Нисък',
      },
    },
  },
  sashe: {
    message: 'Обичам те, Сашенце',
  },
  auth: {
    login: {
      title: 'Вход',
      description: 'Влез, за да достъпиш таблото за капацитет на екипа.',
      emailLabel: 'Служебен имейл',
      passwordLabel: 'Парола',
      submitLabel: 'Вход',
      submittingLabel: 'Влизане…',
      error: 'Неуспешен вход. Провери имейла и паролата.',
    },
    register: {
      title: 'Създай профил',
      description: 'Регистрирай се със служебния си имейл, за да започнеш.',
      emailLabel: 'Служебен имейл',
      passwordLabel: 'Парола',
      confirmPasswordLabel: 'Потвърди паролата',
      submitLabel: 'Регистрация',
      submittingLabel: 'Създаване на профил…',
      error:
        'Неуспешна регистрация. Моля, провери въведените данни и опитай отново.',
    },
  },
};
