import type { Messages } from './types';

export const ka: Messages = {
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
        helperText: 'გუნდები, რომლებსაც აქვთ მაინც ერთი მაღალი რისკის ინსაიტი.',
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
};
