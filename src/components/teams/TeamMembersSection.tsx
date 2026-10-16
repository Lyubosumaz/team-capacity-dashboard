import type { FC } from "react";

import type { Team } from "@/lib/domain/types";

type TeamMembersSectionTexts = {
  heading: string;
  nameColumn: string;
  roleColumn: string;
  skillsColumn: string;
  capacityPerSprintColumn: string;
  totalCapacityRow: string;
  keyBadge: string;
  noSkillsPlaceholder: string;
};

type TeamMembersSectionProps = {
  team: Team;
  totalCapacity: number;
  texts: TeamMembersSectionTexts;
};

export const TeamMembersSection: FC<TeamMembersSectionProps> = ({
  team,
  totalCapacity,
  texts,
}) => {
  return (
    <section className="space-y-3">
      <h2
        id="members-heading"
        data-testid="team-members-heading"
        className="text-sm font-semibold uppercase tracking-wide opacity-70"
      >
        {texts.heading}
      </h2>

      {/* Mobile: stacked cards */}
      <div className="space-y-3 md:hidden">
        {team.members.map((member) => (
          <div
            key={member.id}
            className="rounded-lg border border-border-subtle bg-background p-3 text-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-sm">
                {member.name}
                {member.isKeyPerson ? (
                  <span className="ml-1 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent">
                    {texts.keyBadge}
                  </span>
                ) : null}
              </p>
              <p className="opacity-80">{member.role}</p>
            </div>
            <p className="mt-1 text-[11px] opacity-80">
              <span className="font-semibold">{texts.skillsColumn}:</span>{" "}
              {member.skills.map((skill) => skill.name).join(", ") ||
                texts.noSkillsPlaceholder}
            </p>
            <p className="mt-1 text-[11px] opacity-80 text-right">
              <span className="font-semibold">
                {texts.capacityPerSprintColumn}:
              </span>{" "}
              {member.capacityPerSprint}
            </p>
          </div>
        ))}
        <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80 text-right">
          {texts.totalCapacityRow}: {totalCapacity}
        </p>
      </div>

      {/* Desktop / Tablet: table view */}
      <div className="hidden md:block overflow-hidden rounded-lg border border-border-subtle bg-background">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-accent-soft text-xs font-medium uppercase opacity-80">
            <tr>
              <th scope="col" className="px-4 py-2">
                {texts.nameColumn}
              </th>
              <th scope="col" className="px-4 py-2">
                {texts.roleColumn}
              </th>
              <th scope="col" className="px-4 py-2">
                {texts.skillsColumn}
              </th>
              <th scope="col" className="px-4 py-2 text-right">
                {texts.capacityPerSprintColumn}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {team.members.map((member) => (
              <tr key={member.id} className="align-top">
                <th scope="row" className="px-4 py-2 text-sm font-medium">
                  {member.name}
                  {member.isKeyPerson ? (
                    <span className="ml-1 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">
                      {texts.keyBadge}
                    </span>
                  ) : null}
                </th>
                <td className="px-4 py-2 text-sm">{member.role}</td>
                <td className="px-4 py-2 text-xs opacity-80">
                  {member.skills.map((skill) => skill.name).join(", ") ||
                    texts.noSkillsPlaceholder}
                </td>
                <td className="px-4 py-2 text-right text-sm">
                  {member.capacityPerSprint}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-accent-soft">
              <th
                scope="row"
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wide opacity-80"
              >
                {texts.totalCapacityRow}
              </th>
              <td className="px-4 py-2" colSpan={2} />
              <td className="px-4 py-2 text-right text-sm font-semibold">
                {totalCapacity}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};
