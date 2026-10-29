import { TzarButton } from '@tzardom-ui/react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Team } from '@/lib/domain/types';

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
  // Show edit and remove buttons next to each member when given.
  onEditMember?: (memberId: string) => void;
  onRemoveMember?: (memberId: string) => void;
};

export const TeamMembersSection = ({
  team,
  totalCapacity,
  texts,
  onEditMember,
  onRemoveMember,
}: TeamMembersSectionProps) => {
  const hasActions = Boolean(onEditMember || onRemoveMember);

  const renderActions = (memberId: string, memberName: string) => (
    <div className="flex justify-end gap-1">
      {onEditMember && (
        <TzarButton
          className="w-8 px-0"
          aria-label={`Edit ${memberName}`}
          onClick={() => onEditMember(memberId)}
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
        </TzarButton>
      )}
      {onRemoveMember && (
        <TzarButton
          className="w-8 px-0 text-danger hover:bg-danger-soft hover:text-danger focus-visible:ring-danger"
          aria-label={`Remove ${memberName}`}
          onClick={() => onRemoveMember(memberId)}
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        </TzarButton>
      )}
    </div>
  );

  if (team.members.length === 0) {
    return (
      <section className="space-y-3">
        <h2
          id="members-heading"
          data-testid="team-members-heading"
          className="text-sm font-semibold uppercase tracking-wide opacity-70"
        >
          {texts.heading}
        </h2>
        <p className="rounded-lg border border-dashed border-border-subtle p-4 text-sm text-muted">
          No members yet. Add the first one below.
        </p>
      </section>
    );
  }

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
              <div className="flex items-center gap-1">
                <p className="opacity-80">{member.role || '—'}</p>
                {hasActions && renderActions(member.id, member.name)}
              </div>
            </div>
            <p className="mt-1 text-[11px] opacity-80">
              <span className="font-semibold">{texts.skillsColumn}:</span>{' '}
              {member.skills.map((skill) => skill.name).join(', ') ||
                texts.noSkillsPlaceholder}
            </p>
            <p className="mt-1 text-[11px] opacity-80 text-right">
              <span className="font-semibold">
                {texts.capacityPerSprintColumn}:
              </span>{' '}
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
              {hasActions && (
                <th scope="col" className="w-20 px-2 py-2">
                  <span className="sr-only">Actions</span>
                </th>
              )}
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
                <td className="px-4 py-2 text-sm">{member.role || '—'}</td>
                <td className="px-4 py-2 text-xs opacity-80">
                  {member.skills.map((skill) => skill.name).join(', ') ||
                    texts.noSkillsPlaceholder}
                </td>
                <td className="px-4 py-2 text-right text-sm">
                  {member.capacityPerSprint}
                </td>
                {hasActions && (
                  <td className="px-2 py-1">
                    {renderActions(member.id, member.name)}
                  </td>
                )}
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
              {hasActions && <td />}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};
