import type { Project, RiskInsight } from '@/lib/domain/types';

type TeamProjectsAndRisksSectionTexts = {
  heading: string;
  projectsHeading: string;
  projectsEmpty: string;
  risksHeading: string;
  risksEmpty: string;
};

type TeamProjectsAndRisksSectionProps = {
  projects: Project[];
  risks: RiskInsight[];
  texts: TeamProjectsAndRisksSectionTexts;
};

export const TeamProjectsAndRisksSection = ({
  projects,
  risks,
  texts,
}: TeamProjectsAndRisksSectionProps) => {
  return (
    <section className="space-y-3">
      <h2
        id="projects-heading"
        data-testid="team-projects-heading"
        className="text-sm font-semibold uppercase tracking-wide opacity-70"
      >
        {texts.heading}
      </h2>

      <div className="space-y-3">
        <div className="rounded-lg border border-border-subtle bg-background p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide opacity-80">
            {texts.projectsHeading}
          </h3>
          {projects.length === 0 ? (
            <p className="mt-2 text-xs opacity-80">{texts.projectsEmpty}</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {projects.map((project) => (
                <li key={project.id} className="text-sm">
                  <p className="font-medium">{project.name}</p>
                  {project.description ? (
                    <p className="text-xs opacity-80">{project.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-border-subtle bg-background p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide opacity-80">
            {texts.risksHeading}
          </h3>
          {risks.length === 0 ? (
            <p className="mt-2 text-xs opacity-80">{texts.risksEmpty}</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {risks.map((risk) => (
                <li
                  key={risk.id}
                  className="rounded-md bg-accent-soft px-3 py-2 text-xs text-accent"
                >
                  {risk.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};
