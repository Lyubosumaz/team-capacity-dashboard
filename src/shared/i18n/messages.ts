export type Locale = 'en' | 'bg' | 'ka';

export const defaultLocale: Locale = 'en';

type SectionMessages = {
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
        loading: string;
        error: string;
        notFound: string;
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

export const messages: Record<Locale, SectionMessages> = {
  en: {
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
  },
  bg: {
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
          loading: 'Зареждане на графики…',
          error: 'В момента не можем да заредим графиките за този екип.',
          notFound: 'Този екип не беше намерен.',
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
  },
  ka: {
    header: {
      title: 'გუნდის ტევადობის დაფა',
      subtitle: 'დაგეგმე ტევადობა, დატვირთვა და მიწოდების რისკები.',
      nav: {
        overview: 'მიმოხილვა',
        risk: 'რისკები',
        teams: 'გუნდები',
      },
      login: 'შესვლა',
    },
    footer: {
      copyright: '© {year} lyubosumaz-projects',

      appName: 'გუნდის ტევადობის დაფა',
      builtWith: 'შექმნილია Next.js-ით და Tailwind CSS-ით',
    },
    home: {
      overviewHeader: {
        title: 'მიმოხილვა',
        description:
          'გუნდების ტევადობის, დატვირთვის და მიწოდების რისკების მაღალ დონეზე ხედვა გუნდებსა და პროექტებზე.',
      },
      keyMetricsSection: {
        teams: {
          label: 'გუნდები',
          helperText: 'აქტიური საინჟინრო გუნდები ორგანიზაციაში.',
        },
        projects: {
          label: 'პროექტები',
          helperText: 'მიმდინარე პროექტები აქტიური სპრინტისთვის.',
        },
        highRiskInsights: {
          label: 'მაღალი რისკის ინსაიტები',
          helperText:
            'მიწოდების პოტენციური რისკები, რომლებიც ყურადღებას საჭიროებს.',
        },
      },
      chartsSection: {
        capacityOverTimeTitle: 'ტევადობა დროში',
        workloadVsCapacityTitle: 'დატვირთვა და ტევადობა გუნდების მიხედვით',
      },
    },
    teams: {
      overviewHeader: {
        title: 'გუნდები',
        description:
          'დაათვალიერე გუნდები, ნახე ვინ რომელ გუნდშია და დეტალურად გაეცანი მათ ტევადობას და დატვირთვას.',
      },
      list: {
        membersSuffixSingular: 'წევრი',
        membersSuffixPlural: 'წევრი',
        viewLabel: 'ნახვა',
      },
      detail: {
        pageDescription:
          'გუნდის წევრები, ტევადობა სპრინტზე, მიმდინარე პროექტები და ტენდენციები.',
        membersSection: {
          heading: 'წევრები და ტევადობა',
          nameColumn: 'სახელი',
          roleColumn: 'როლი',
          skillsColumn: 'უნარები',
          capacityPerSprintColumn: 'ტევადობა / სპრინტი',
          totalCapacityRow: 'ჯამური ტევადობა',
          keyBadge: 'ძირითადი',
          noSkillsPlaceholder: '—',
        },
        projectsAndRisksSection: {
          heading: 'პროექტები და რისკები',
          projectsHeading: 'პროექტები ამ სპრინტში',
          projectsEmpty: 'ამ გუნდზე ამჟამად არცერთი პროექტი არ არის მიბმული.',
          risksHeading: 'რისკის ინსაიტები',
          risksEmpty:
            'ამ გუნდისთვის კონკრეტული რისკები არ არის იდენტიფიცირებული.',
        },
        chartsSection: {
          heading: 'ტევადობა და დატვირთვა',
          description:
            'როგორ ერწყმის ამ გუნდის დაგეგმილი ტევადობა დატვირთვას სპრინტებზე.',
          loading: 'გრაფიკების ჩატვირთვა…',
          error: 'ამ გუნდის გრაფიკების ჩატვირთვა ამ დროს შეუძლებელია.',
          notFound: 'ეს გუნდი ვერ მოიძებნა.',
          noData:
            'ჯერ არ არის საკმარისი მონაცემი ამ გუნდის გრაფიკების საჩვენებლად.',
          capacityOverTimeTitle: 'ტევადობა დროში',
          workloadVsCapacityTitle: 'დატვირთვა და ტევადობა',
          currentSprintFallback: 'მიმდინარე სპრინტი',
        },
      },
    },
    risk: {
      overviewHeader: {
        title: 'რისკების მიმოხილვა',
        description:
          'კონცენტრირებული ხედვა მიწოდების რისკებზე, ტევადობის ზეწოლაზე და მოახლოებულ მოვლენებზე, რომლებიც შეიძლება გუნდებზე იმოქმედოს.',
      },
      metricsSection: {
        highRiskInsights: {
          label: 'მაღალი რისკის ინსაიტები',
          helperText:
            'შესაძლო მიწოდების რისკები, აღნიშნული როგორც მაღალი სიმძიმე.',
        },
        highRiskTeams: {
          label: 'მაღალი რისკის მქონე გუნდები',
          helperText:
            'გუნდები, რომლებსაც აქვთ მაინც ერთი მაღალი რისკის ინსაიტი.',
        },
        upcomingEvents: {
          label: 'მომავალი რისკის მოვლენები',
          helperText: 'შვებულებები და კრიტიკული მოვლენები უახლოეს მომავალში.',
        },
      },
      insightsList: {
        heading: 'რისკის ინსაიტები',
        emptyState: 'რისკის ინსაიტები ჯერ არ არის აღმოჩენილი.',
        fallbackTitle: 'რისკის ინსაიტი',
        unassignedTeam: 'გუნდი არ არის მითითებული',
        overCapacitySuffix: '· ამ სპრინტში გადატვირთულია',
        severity: {
          high: 'მაღალი',
          medium: 'საშუალო',
          low: 'დაბალი',
        },
      },
    },
    sashe: {
      message: 'მე შენ მიყვარხარ, საშენცე',
    },
    auth: {
      login: {
        title: 'შესვლა',
        description: 'შედი სისტემაში, რომ იხილო შენი გუნდის ტევადობის დაფა.',
        emailLabel: 'სამუშაო ელფოსტა',
        passwordLabel: 'პაროლი',
        submitLabel: 'შესვლა',
        submittingLabel: 'შესვლა…',
        error: 'შესვლა ვერ მოხერხდა. გადაამოწმე ელფოსტა და პაროლი.',
      },
      register: {
        title: 'ანგარიშის შექმნა',
        description: 'დარეგისტრირდი შენი სამუშაო ელფოსტით, რომ დაიწყო მუშაობა.',
        emailLabel: 'სამუშაო ელფოსტა',
        passwordLabel: 'პაროლი',
        confirmPasswordLabel: 'დაადასტურე პაროლი',
        submitLabel: 'რეგისტრაცია',
        submittingLabel: 'ანგარიშის შექმნა…',
        error:
          'რეგისტრაცია ვერ მოხერხდა. გადაამოწმე მონაცემები და სცადე თავიდან.',
      },
    },
  },
};
