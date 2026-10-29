'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/features/auth/currentUser';
import type { Member, Team, UserProfile } from '@/lib/domain/types';
import {
  createDocument,
  deleteDocument,
  getCollectionWhere,
  getCollectionWithId,
  getDocWithId,
  updateDocument,
} from '@/lib/firebase/collections';

// What every action returns: an error to show, or {} when it worked.
export type TeamActionResult = { error?: string };

// A member's details that can be set on the team page.
export type MemberDetails = Pick<
  Member,
  'role' | 'capacityPerSprint' | 'isKeyPerson'
>;

const NOT_LOGGED_IN: TeamActionResult = { error: 'Please log in again.' };
const NOT_YOUR_TEAM: TeamActionResult = {
  error: 'You can only change your own teams.',
};
const NAME_REQUIRED: TeamActionResult = { error: 'Team name is required.' };
const BAD_CAPACITY: TeamActionResult = {
  error: 'Capacity must be a number of 0 or more.',
};

const isValidCapacity = (capacity: number) =>
  Number.isFinite(capacity) && capacity >= 0;

// The teams the user created. The Firestore rules allow nothing else.
const getOwnTeams = (userId: string) =>
  getCollectionWhere<Team>('teams', 'ownerId', userId);

// The team, if it exists and belongs to the user.
const getOwnTeam = async (userId: string, teamId: string) => {
  const team = await getDocWithId<Team>('teams', teamId);

  return team?.ownerId === userId ? team : null;
};

// A new member from an account. Role and capacity are set on the team page.
const toMember = (account: UserProfile, details?: MemberDetails): Member => ({
  id: account.id,
  name: account.email,
  role: details?.role.trim() ?? '',
  skills: [],
  capacityPerSprint: details?.capacityPerSprint ?? 0,
  isKeyPerson: details?.isKeyPerson ?? false,
});

// Team names and counts show on several pages, so refresh all of them.
const refreshPages = () => revalidatePath('/', 'layout');

export const addTeam = async (
  name: string,
  memberAccountIds: string[],
): Promise<TeamActionResult> => {
  const user = await getCurrentUser();

  if (!user) {
    return NOT_LOGGED_IN;
  }

  const trimmedName = name.trim();

  if (!trimmedName) {
    return NAME_REQUIRED;
  }

  const ownTeams = await getOwnTeams(user.uid);
  const isTaken = ownTeams.some(
    (team) => team.name.toLowerCase() === trimmedName.toLowerCase(),
  );

  if (isTaken) {
    return { error: `You already have a team called "${trimmedName}".` };
  }

  const accounts = await getCollectionWithId<UserProfile>('users');
  const members = accounts
    .filter((account) => memberAccountIds.includes(account.id))
    .map((account) => toMember(account));

  // A random ID, so different users can have teams with the same name.
  await createDocument('teams', randomUUID(), {
    name: trimmedName,
    ownerId: user.uid,
    members,
  });

  refreshPages();
  return {};
};

export const renameTeam = async (
  teamId: string,
  name: string,
): Promise<TeamActionResult> => {
  const user = await getCurrentUser();

  if (!user) {
    return NOT_LOGGED_IN;
  }

  const trimmedName = name.trim();

  if (!trimmedName) {
    return NAME_REQUIRED;
  }

  if (!(await getOwnTeam(user.uid, teamId))) {
    return NOT_YOUR_TEAM;
  }

  await updateDocument('teams', teamId, { name: trimmedName });

  refreshPages();
  return {};
};

export const deleteTeam = async (
  teamId: string,
): Promise<TeamActionResult> => {
  const user = await getCurrentUser();

  if (!user) {
    return NOT_LOGGED_IN;
  }

  if (!(await getOwnTeam(user.uid, teamId))) {
    return NOT_YOUR_TEAM;
  }

  await deleteDocument('teams', teamId);

  refreshPages();
  return {};
};

export const addMember = async (
  teamId: string,
  accountId: string,
  details: MemberDetails,
): Promise<TeamActionResult> => {
  const user = await getCurrentUser();

  if (!user) {
    return NOT_LOGGED_IN;
  }

  if (!accountId) {
    return { error: 'Choose an account.' };
  }
  if (!isValidCapacity(details.capacityPerSprint)) {
    return BAD_CAPACITY;
  }

  const team = await getOwnTeam(user.uid, teamId);

  if (!team) {
    return NOT_YOUR_TEAM;
  }
  if (team.members.some((member) => member.id === accountId)) {
    return { error: 'This person is already in the team.' };
  }

  const account = await getDocWithId<UserProfile>('users', accountId);

  if (!account) {
    return { error: 'This account no longer exists.' };
  }

  await updateDocument('teams', teamId, {
    members: [...team.members, toMember(account, details)],
  });

  refreshPages();
  return {};
};

export const updateMember = async (
  teamId: string,
  memberId: string,
  details: MemberDetails,
): Promise<TeamActionResult> => {
  const user = await getCurrentUser();

  if (!user) {
    return NOT_LOGGED_IN;
  }

  if (!isValidCapacity(details.capacityPerSprint)) {
    return BAD_CAPACITY;
  }

  const team = await getOwnTeam(user.uid, teamId);

  if (!team) {
    return NOT_YOUR_TEAM;
  }

  await updateDocument('teams', teamId, {
    members: team.members.map((member) =>
      member.id === memberId
        ? {
            ...member,
            role: details.role.trim(),
            capacityPerSprint: details.capacityPerSprint,
            isKeyPerson: details.isKeyPerson ?? false,
          }
        : member,
    ),
  });

  refreshPages();
  return {};
};

export const removeMember = async (
  teamId: string,
  memberId: string,
): Promise<TeamActionResult> => {
  const user = await getCurrentUser();

  if (!user) {
    return NOT_LOGGED_IN;
  }

  const team = await getOwnTeam(user.uid, teamId);

  if (!team) {
    return NOT_YOUR_TEAM;
  }

  await updateDocument('teams', teamId, {
    members: team.members.filter((member) => member.id !== memberId),
  });

  refreshPages();
  return {};
};
