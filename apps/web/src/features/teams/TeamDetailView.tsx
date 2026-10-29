'use client';

import { TzarButton, TzarDialog, TzarTextField } from '@tzardom-ui/react';
import { useTranslations } from 'next-intl';
import type { FormEvent } from 'react';
import { useState } from 'react';
import type {
  Project,
  RiskInsight,
  Sprint,
  Team,
  UserProfile,
} from '@/lib/domain/types';
import { ChartsSection } from '@/shared/widgets/ChartsSection';
import { removeMember, renameTeam, updateMember } from './actions';
import { AddMemberForm } from './AddMemberForm';
import { TeamMembersSection } from './TeamMembersSection';
import { TeamProjectsAndRisksSection } from './TeamProjectsAndRisksSection';

type TeamDetailViewProps = {
  team: Team;
  projects: Project[];
  risks: RiskInsight[];
  sprints: Sprint[];
  totalCapacity: number;
  // Everyone who has an account, for adding members.
  accounts: UserProfile[];
};

export const TeamDetailView = ({
  team,
  projects,
  risks,
  sprints,
  totalCapacity,
  accounts,
}: TeamDetailViewProps) => {
  const t = useTranslations();
  const [teamName, setTeamName] = useState(team.name);
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [editNameValue, setEditNameValue] = useState(team.name);
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [editNameError, setEditNameError] = useState<string | null>(null);
  const [memberIdPendingRemoval, setMemberIdPendingRemoval] = useState<
    string | null
  >(null);
  const [removeMemberError, setRemoveMemberError] = useState<string | null>(
    null,
  );

  const memberPendingRemoval = team.members.find(
    (member) => member.id === memberIdPendingRemoval,
  );

  // The member whose role and capacity are being edited, and the form values.
  const [memberIdBeingEdited, setMemberIdBeingEdited] = useState<
    string | null
  >(null);
  const [editRole, setEditRole] = useState('');
  const [editCapacity, setEditCapacity] = useState('');
  const [editIsKeyPerson, setEditIsKeyPerson] = useState(false);
  const [editMemberError, setEditMemberError] = useState<string | null>(null);
  const [isSavingMember, setIsSavingMember] = useState(false);

  const memberBeingEdited = team.members.find(
    (member) => member.id === memberIdBeingEdited,
  );

  const startEditingMember = (memberId: string) => {
    const member = team.members.find(({ id }) => id === memberId);

    if (!member) return;

    setEditRole(member.role);
    setEditCapacity(String(member.capacityPerSprint));
    setEditIsKeyPerson(member.isKeyPerson ?? false);
    setEditMemberError(null);
    setMemberIdBeingEdited(memberId);
  };

  const saveMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!memberIdBeingEdited) return;

    try {
      setIsSavingMember(true);
      setEditMemberError(null);

      const result = await updateMember(team.id, memberIdBeingEdited, {
        role: editRole,
        capacityPerSprint: Number(editCapacity),
        isKeyPerson: editIsKeyPerson,
      });

      if (result.error) {
        setEditMemberError(result.error);
        return;
      }

      setMemberIdBeingEdited(null);
    } catch (error) {
      console.error('Error updating member', error);
      setEditMemberError('Failed to save the member. Please try again.');
    } finally {
      setIsSavingMember(false);
    }
  };

  // Accounts that can still be added: the ones not in the team yet.
  const memberIds = new Set(team.members.map((member) => member.id));
  const availableAccounts = accounts.filter(
    (account) => !memberIds.has(account.id),
  );

  const confirmRemoveMember = async () => {
    if (!memberIdPendingRemoval) return;

    try {
      const result = await removeMember(team.id, memberIdPendingRemoval);

      if (result.error) {
        setRemoveMemberError(result.error);
        return;
      }

      setMemberIdPendingRemoval(null);
    } catch (error) {
      console.error('Error removing member', error);
      setRemoveMemberError('Failed to remove the member. Please try again.');
    }
  };

  const membersTexts = {
    heading: t('teams.detail.membersSection.heading'),
    nameColumn: t('teams.detail.membersSection.nameColumn'),
    roleColumn: t('teams.detail.membersSection.roleColumn'),
    skillsColumn: t('teams.detail.membersSection.skillsColumn'),
    capacityPerSprintColumn: t(
      'teams.detail.membersSection.capacityPerSprintColumn',
    ),
    totalCapacityRow: t('teams.detail.membersSection.totalCapacityRow'),
    keyBadge: t('teams.detail.membersSection.keyBadge'),
    noSkillsPlaceholder: t('teams.detail.membersSection.noSkillsPlaceholder'),
  };

  const projectsAndRisksTexts = {
    heading: t('teams.detail.projectsAndRisksSection.heading'),
    projectsHeading: t('teams.detail.projectsAndRisksSection.projectsHeading'),
    projectsEmpty: t('teams.detail.projectsAndRisksSection.projectsEmpty'),
    risksHeading: t('teams.detail.projectsAndRisksSection.risksHeading'),
    risksEmpty: t('teams.detail.projectsAndRisksSection.risksEmpty'),
  };

  const chartsTexts = {
    heading: t('teams.detail.chartsSection.heading'),
    description: t('teams.detail.chartsSection.description'),
    noData: t('teams.detail.chartsSection.noData'),
    capacityOverTimeTitle: t(
      'teams.detail.chartsSection.capacityOverTimeTitle',
    ),
    workloadVsCapacityTitle: t(
      'teams.detail.chartsSection.workloadVsCapacityTitle',
    ),
    currentSprintFallback: t(
      'teams.detail.chartsSection.currentSprintFallback',
    ),
  };

  return (
    <section className="flex w-full flex-col gap-6">
      <header className="space-y-2 pb-10">
        <div className="flex items-center justify-between gap-3">
          <h1
            data-testid="team-detail-name"
            className="text-2xl font-semibold tracking-tight"
          >
            {teamName}
          </h1>
          <TzarButton
            data-testid="team-detail-edit-button"
            onClick={() => {
              setEditNameError(null);
              setEditNameValue(teamName);
              setIsEditNameModalOpen(true);
            }}
          >
            Edit name
          </TzarButton>
        </div>
        <p className="max-w-2xl text-sm opacity-80">
          {t('teams.detail.pageDescription')}
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
        <div className="space-y-4">
          <TeamMembersSection
            team={team}
            totalCapacity={totalCapacity}
            texts={membersTexts}
            onEditMember={startEditingMember}
            onRemoveMember={(memberId) => {
              setRemoveMemberError(null);
              setMemberIdPendingRemoval(memberId);
            }}
          />
          <AddMemberForm teamId={team.id} accounts={availableAccounts} />
        </div>

        <TeamProjectsAndRisksSection
          projects={projects}
          risks={risks}
          texts={projectsAndRisksTexts}
        />
      </div>

      <ChartsSection
        team={team}
        sprints={sprints}
        projects={projects}
        texts={chartsTexts}
      />

      <TzarDialog
        data-testid="team-detail-edit-member-dialog"
        open={memberIdBeingEdited !== null}
        onClose={() => setMemberIdBeingEdited(null)}
        title={`Edit ${memberBeingEdited?.name ?? 'member'}`}
        confirmLabel={isSavingMember ? 'Saving...' : 'Save'}
        confirmDisabled={isSavingMember}
        form="edit-member-form"
      >
        <form id="edit-member-form" className="space-y-3" onSubmit={saveMember}>
          <TzarTextField
            label="Role"
            placeholder="e.g. Frontend developer"
            value={editRole}
            onChange={(event) => setEditRole(event.target.value)}
          />
          <TzarTextField
            label="Capacity per sprint"
            type="number"
            min={0}
            required
            value={editCapacity}
            onChange={(event) => setEditCapacity(event.target.value)}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={editIsKeyPerson}
              onChange={(event) => setEditIsKeyPerson(event.target.checked)}
            />
            Key person
          </label>
          {editMemberError ? (
            <p className="text-xs text-danger">{editMemberError}</p>
          ) : null}
        </form>
      </TzarDialog>

      <TzarDialog
        data-testid="team-detail-remove-member-dialog"
        open={memberIdPendingRemoval !== null}
        onClose={() => setMemberIdPendingRemoval(null)}
        title="Remove member"
        confirmLabel="Remove"
        confirmVariant="danger"
        onConfirm={confirmRemoveMember}
      >
        <p className="text-xs opacity-80">
          Remove {memberPendingRemoval?.name ?? 'this member'} from the team?
        </p>
        {removeMemberError ? (
          <p className="mt-2 text-xs text-danger">{removeMemberError}</p>
        ) : null}
      </TzarDialog>

      <TzarDialog
        data-testid="team-detail-edit-dialog"
        open={isEditNameModalOpen}
        onClose={() => {
          setIsEditNameModalOpen(false);
          setEditNameError(null);
          setEditNameValue(teamName);
        }}
        title="Edit team name"
        confirmLabel={isUpdatingName ? 'Saving...' : 'Save'}
        confirmDisabled={isUpdatingName}
        form="edit-team-name-form"
      >
        <form
          data-testid="team-detail-edit-form"
          id="edit-team-name-form"
          className="space-y-3"
          onSubmit={async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const trimmedName = editNameValue.trim();

            if (!trimmedName) {
              setEditNameError('Team name is required');
              return;
            }

            try {
              setIsUpdatingName(true);
              setEditNameError(null);

              const result = await renameTeam(team.id, trimmedName);

              if (result.error) {
                setEditNameError(result.error);
                return;
              }

              setTeamName(trimmedName);
              setIsEditNameModalOpen(false);
            } catch (error) {
              console.error('Error updating team name', error);
              setEditNameError('Failed to update team name. Please try again.');
            } finally {
              setIsUpdatingName(false);
            }
          }}
        >
          <TzarTextField
            data-testid="team-detail-name-input"
            label="Team name"
            value={editNameValue}
            onChange={(event) => setEditNameValue(event.target.value)}
          />

          {editNameError ? (
            <p
              data-testid="team-detail-edit-error"
              className="text-xs text-danger"
            >
              {editNameError}
            </p>
          ) : null}
        </form>
      </TzarDialog>
    </section>
  );
};
