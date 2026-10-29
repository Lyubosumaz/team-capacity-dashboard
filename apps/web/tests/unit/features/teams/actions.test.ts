import { revalidatePath } from 'next/cache';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCurrentUser } from '@/features/auth/currentUser';
import {
  addMember,
  addTeam,
  deleteTeam,
  removeMember,
  renameTeam,
  updateMember,
} from '@/features/teams/actions';
import type { Team } from '@/lib/domain/types';
import {
  createDocument,
  deleteDocument,
  getCollectionWhere,
  getCollectionWithId,
  getDocWithId,
  updateDocument,
} from '@/lib/firebase/collections';

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('@/features/auth/currentUser', () => ({ getCurrentUser: vi.fn() }));
vi.mock('@/lib/firebase/collections', () => ({
  getCollectionWhere: vi.fn(),
  getCollectionWithId: vi.fn(),
  getDocWithId: vi.fn(),
  createDocument: vi.fn(),
  updateDocument: vi.fn(),
  deleteDocument: vi.fn(),
}));

const ANA = { uid: 'ana', email: 'ana@example.com' };

const anasTeam: Team = {
  id: 'team-1',
  name: 'Frontend',
  ownerId: 'ana',
  members: [
    {
      id: 'm1',
      name: 'Alex',
      role: 'Developer',
      skills: [],
      capacityPerSprint: 10,
    },
  ],
};

const bensTeam: Team = { ...anasTeam, id: 'team-2', ownerId: 'ben' };

const MARIA = { id: 'maria', email: 'maria@example.com' };

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getCurrentUser).mockResolvedValue(ANA);
  vi.mocked(getCollectionWhere).mockResolvedValue([anasTeam]);
  vi.mocked(getCollectionWithId).mockResolvedValue([MARIA]);
  vi.mocked(getDocWithId).mockImplementation(
    async (_collection, id) =>
      [anasTeam, bensTeam, MARIA].find((doc) => doc.id === id) ?? null,
  );
  vi.mocked(createDocument).mockResolvedValue(true);
});

describe('team actions for visitors who are not logged in', () => {
  it('refuse to change anything', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    const notLoggedIn = { error: 'Please log in again.' };
    expect(await addTeam('Backend', [])).toEqual(notLoggedIn);
    expect(await deleteTeam('team-1')).toEqual(notLoggedIn);

    expect(createDocument).not.toHaveBeenCalled();
    expect(deleteDocument).not.toHaveBeenCalled();
  });
});

describe('addTeam', () => {
  it('needs a name', async () => {
    expect(await addTeam('   ', [])).toEqual({
      error: 'Team name is required.',
    });
    expect(createDocument).not.toHaveBeenCalled();
  });

  it('creates a team owned by the user', async () => {
    expect(await addTeam('  Backend ', [])).toEqual({});

    expect(getCollectionWhere).toHaveBeenCalledWith('teams', 'ownerId', 'ana');
    expect(createDocument).toHaveBeenCalledWith('teams', expect.any(String), {
      name: 'Backend',
      ownerId: 'ana',
      members: [],
    });
    expect(revalidatePath).toHaveBeenCalled();
  });

  it('adds the chosen accounts as members', async () => {
    await addTeam('Backend', ['maria']);

    expect(createDocument).toHaveBeenCalledWith(
      'teams',
      expect.any(String),
      expect.objectContaining({
        members: [
          {
            id: 'maria',
            name: 'maria@example.com',
            role: '',
            skills: [],
            capacityPerSprint: 0,
            isKeyPerson: false,
          },
        ],
      }),
    );
  });

  it('refuses a name the user already has', async () => {
    expect(await addTeam('frontend', [])).toEqual({
      error: 'You already have a team called "frontend".',
    });
    expect(createDocument).not.toHaveBeenCalled();
  });
});

describe('renameTeam', () => {
  it("renames the user's own team", async () => {
    expect(await renameTeam('team-1', ' Web ')).toEqual({});

    expect(updateDocument).toHaveBeenCalledWith('teams', 'team-1', {
      name: 'Web',
    });
  });

  it("refuses someone else's team", async () => {
    expect(await renameTeam('team-2', 'Web')).toEqual({
      error: 'You can only change your own teams.',
    });
    expect(updateDocument).not.toHaveBeenCalled();
  });
});

describe('deleteTeam', () => {
  it("deletes the user's own team", async () => {
    expect(await deleteTeam('team-1')).toEqual({});

    expect(deleteDocument).toHaveBeenCalledWith('teams', 'team-1');
  });

  it("refuses someone else's team", async () => {
    expect(await deleteTeam('team-2')).toEqual({
      error: 'You can only change your own teams.',
    });
    expect(deleteDocument).not.toHaveBeenCalled();
  });
});

describe('addMember', () => {
  const details = {
    role: ' Designer ',
    capacityPerSprint: 8,
    isKeyPerson: true,
  };

  it('adds the account to the end of the team', async () => {
    expect(await addMember('team-1', 'maria', details)).toEqual({});

    expect(updateDocument).toHaveBeenCalledWith('teams', 'team-1', {
      members: [
        ...anasTeam.members,
        {
          id: 'maria',
          name: 'maria@example.com',
          role: 'Designer',
          skills: [],
          capacityPerSprint: 8,
          isKeyPerson: true,
        },
      ],
    });
  });

  it('checks the form', async () => {
    expect(await addMember('team-1', '', details)).toEqual({
      error: 'Choose an account.',
    });
    expect(
      await addMember('team-1', 'maria', { ...details, capacityPerSprint: -1 }),
    ).toEqual({ error: 'Capacity must be a number of 0 or more.' });
    expect(updateDocument).not.toHaveBeenCalled();
  });

  it('refuses someone who is already in the team', async () => {
    expect(await addMember('team-1', 'm1', details)).toEqual({
      error: 'This person is already in the team.',
    });
  });

  it("refuses someone else's team", async () => {
    expect(await addMember('team-2', 'maria', details)).toEqual({
      error: 'You can only change your own teams.',
    });
  });
});

describe('updateMember', () => {
  it("saves the member's role and capacity", async () => {
    expect(
      await updateMember('team-1', 'm1', {
        role: ' Lead ',
        capacityPerSprint: 12,
        isKeyPerson: true,
      }),
    ).toEqual({});

    expect(updateDocument).toHaveBeenCalledWith('teams', 'team-1', {
      members: [
        {
          ...anasTeam.members[0],
          role: 'Lead',
          capacityPerSprint: 12,
          isKeyPerson: true,
        },
      ],
    });
  });
});

describe('removeMember', () => {
  it('removes the member', async () => {
    expect(await removeMember('team-1', 'm1')).toEqual({});

    expect(updateDocument).toHaveBeenCalledWith('teams', 'team-1', {
      members: [],
    });
  });
});
