'use client';

import {
  TzarButton,
  TzarDialog,
  TzarPageHeader,
  TzarTextField,
} from '@tzardom-ui/react';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { FormEvent } from 'react';
import { useState } from 'react';
import type { Team, UserProfile } from '@/lib/domain/types';
import { addTeam, deleteTeam } from './actions';
import { TeamsList } from './TeamsList';

type TeamsViewProps = {
  // The user's own teams.
  teams: Team[];
  // Everyone who can be added to a team.
  accounts: UserProfile[];
};

export const TeamsView = ({ teams, accounts }: TeamsViewProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>(
    [],
  );
  const [teamIdPendingDelete, setTeamIdPendingDelete] = useState<string | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const t = useTranslations();

  const memberSuffixSingular = t('teams.list.membersSuffixSingular');
  const memberSuffixPlural = t('teams.list.membersSuffixPlural');
  const viewLabel = t('teams.list.viewLabel');

  const toggleAccount = (accountId: string) => {
    setSelectedAccountIds((ids) =>
      ids.includes(accountId)
        ? ids.filter((id) => id !== accountId)
        : [...ids, accountId],
    );
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeamIdPendingDelete(teamId);
  };

  const confirmDeleteTeam = async () => {
    if (!teamIdPendingDelete) return;

    try {
      const result = await deleteTeam(teamIdPendingDelete);

      if (result.error) {
        console.error('Failed to delete team:', result.error);
        return;
      }

      setTeamIdPendingDelete(null);
    } catch (error) {
      console.error('Error deleting team', error);
    }
  };

  return (
    <section className="flex w-full flex-col gap-4">
      <TzarPageHeader
        data-testid="teams-header"
        title={t('teams.overviewHeader.title')}
        description={t('teams.overviewHeader.description')}
      />

      <div className="flex justify-end">
        <TzarButton
          data-testid="teams-add-button"
          className="h-9"
          onClick={() => {
            setSubmitError(null);
            setNewTeamName('');
            setSelectedAccountIds([]);
            setIsAddModalOpen(true);
          }}
        >
          Add team
          <Plus className="h-4 w-4" aria-hidden="true" />
        </TzarButton>
      </div>

      <TzarDialog
        data-testid="teams-add-dialog"
        open={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setNewTeamName('');
          setSubmitError(null);
          setSelectedAccountIds([]);
        }}
        title="Add team"
        size="lg"
        confirmLabel={isSubmitting ? 'Adding...' : 'Add'}
        confirmDisabled={isSubmitting}
        form="add-team-form"
      >
        <form
          data-testid="teams-add-form"
          id="add-team-form"
          className="space-y-3"
          onSubmit={async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const trimmedName = newTeamName.trim();

            if (!trimmedName) {
              setSubmitError('Team name is required');
              return;
            }

            try {
              setIsSubmitting(true);
              setSubmitError(null);

              const result = await addTeam(trimmedName, selectedAccountIds);

              if (result.error) {
                setSubmitError(result.error);
                return;
              }

              setIsAddModalOpen(false);
              setNewTeamName('');
              setSubmitError(null);
              setSelectedAccountIds([]);
            } catch (error) {
              console.error('Error adding team', error);
              setSubmitError('Failed to add team. Please try again.');
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <TzarTextField
            data-testid="teams-add-name"
            label="Team name"
            value={newTeamName}
            onChange={(event) => setNewTeamName(event.target.value)}
            placeholder="Enter team name"
          />

          <fieldset className="space-y-2">
            <legend className="text-xs font-medium uppercase tracking-wide opacity-70">
              Members
            </legend>
            {accounts.length === 0 ? (
              <p className="text-xs text-muted">
                No accounts yet. People show up here after they log in.
              </p>
            ) : (
              <ul className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-border-subtle p-2">
                {accounts.map((account) => (
                  <li key={account.id}>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedAccountIds.includes(account.id)}
                        onChange={() => toggleAccount(account.id)}
                      />
                      {account.email}
                    </label>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-muted">
              You can set each member&apos;s role and capacity on the team
              page.
            </p>
          </fieldset>

          {submitError ? (
            <p data-testid="teams-add-error" className="text-xs text-danger">
              {submitError}
            </p>
          ) : null}
        </form>
      </TzarDialog>

      <TzarDialog
        data-testid="teams-delete-dialog"
        open={teamIdPendingDelete !== null}
        onClose={() => {
          setTeamIdPendingDelete(null);
        }}
        title="Delete team"
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={confirmDeleteTeam}
      >
        <p className="text-xs opacity-80">
          Are you sure you want to delete this team? This action cannot be
          undone.
        </p>
      </TzarDialog>

      <TeamsList
        teams={teams}
        memberSuffixSingular={memberSuffixSingular}
        memberSuffixPlural={memberSuffixPlural}
        viewLabel={viewLabel}
        onDeleteTeam={handleDeleteTeam}
      />
    </section>
  );
};
