'use client';

import { TzarButton, TzarTextField } from '@tzardom-ui/react';
import { type FormEvent, useState } from 'react';
import type { UserProfile } from '@/lib/domain/types';
import { addMember } from './actions';

type AddMemberFormProps = {
  teamId: string;
  // The accounts that aren't in the team yet.
  accounts: UserProfile[];
};

// Adds an account to the team. The page shows the new member by itself.
export const AddMemberForm = ({ teamId, accounts }: AddMemberFormProps) => {
  const [accountId, setAccountId] = useState('');
  const [role, setRole] = useState('');
  const [capacity, setCapacity] = useState('');
  const [isKeyPerson, setIsKeyPerson] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (accounts.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border-subtle p-4 text-xs text-muted">
        Everyone with an account is already in this team. New people show up
        here after they sign up and log in.
      </p>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const result = await addMember(teamId, accountId, {
        role,
        capacityPerSprint: Number(capacity),
        isKeyPerson,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      setAccountId('');
      setRole('');
      setCapacity('');
      setIsKeyPerson(false);
    } catch (err) {
      console.error('Error adding member', err);
      setError('Failed to add the member. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-labelledby="add-member-heading"
      className="space-y-3 rounded-lg border border-border-subtle bg-background p-4"
    >
      <h3 id="add-member-heading" className="text-sm font-semibold">
        Add a member
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1 sm:col-span-2">
          <span className="block text-xs font-medium uppercase tracking-wide opacity-70">
            Account
          </span>
          <select
            required
            value={accountId}
            onChange={(event) => setAccountId(event.target.value)}
            className="w-full rounded-md border border-border-subtle bg-background px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value="">Choose a person…</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.email}
              </option>
            ))}
          </select>
        </label>
        <TzarTextField
          label="Role"
          placeholder="e.g. Frontend developer"
          value={role}
          onChange={(event) => setRole(event.target.value)}
        />
        <TzarTextField
          label="Capacity per sprint"
          type="number"
          min={0}
          required
          value={capacity}
          onChange={(event) => setCapacity(event.target.value)}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isKeyPerson}
            onChange={(event) => setIsKeyPerson(event.target.checked)}
          />
          Key person
        </label>
      </div>

      {error ? <p className="text-xs text-danger">{error}</p> : null}

      <TzarButton type="submit" variant="primary" disabled={isSaving}>
        {isSaving ? 'Adding…' : 'Add member'}
      </TzarButton>
    </form>
  );
};
