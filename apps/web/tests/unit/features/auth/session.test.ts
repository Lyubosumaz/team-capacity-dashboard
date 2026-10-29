import { cookies } from 'next/headers';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { lookUpAccount } from '@/features/auth/currentUser';
import { deleteSession, saveSession } from '@/features/auth/session';
import { setDocument } from '@/lib/firebase/collections';
import { SESSION_COOKIE } from '@/lib/firebase/sessionToken';

vi.mock('next/headers', () => ({ cookies: vi.fn() }));
vi.mock('@/features/auth/currentUser', () => ({ lookUpAccount: vi.fn() }));
vi.mock('@/lib/firebase/collections', () => ({ setDocument: vi.fn() }));

beforeEach(() => {
  vi.mocked(lookUpAccount).mockResolvedValue({
    uid: 'ana',
    email: 'ana@example.com',
  });
  vi.mocked(setDocument).mockReset().mockResolvedValue();
});

// A fake cookie store that holds this session cookie, or none.
const fakeCookies = (sessionValue?: string) => {
  const store = {
    get: vi.fn((name: string) =>
      name === SESSION_COOKIE && sessionValue !== undefined
        ? { name, value: sessionValue }
        : undefined,
    ),
    has: vi.fn(
      (name: string) => name === SESSION_COOKIE && sessionValue !== undefined,
    ),
    set: vi.fn(),
    delete: vi.fn(),
  };
  vi.mocked(cookies).mockResolvedValue(
    store as unknown as Awaited<ReturnType<typeof cookies>>,
  );
  return store;
};

describe('saveSession', () => {
  it('keeps the login token in an httpOnly cookie', async () => {
    const store = fakeCookies();

    await saveSession('token-1');

    expect(store.set).toHaveBeenCalledWith(
      SESSION_COOKIE,
      'token-1',
      expect.objectContaining({ httpOnly: true, path: '/' }),
    );
  });

  it("saves the user's profile, so others can add them to teams", async () => {
    fakeCookies();

    await saveSession('token-1');

    expect(setDocument).toHaveBeenCalledWith(
      'users',
      'ana',
      { email: 'ana@example.com' },
      'token-1',
    );
  });

  it('does nothing when the cookie already has this token', async () => {
    const store = fakeCookies('token-1');

    await saveSession('token-1');

    expect(store.set).not.toHaveBeenCalled();
    expect(setDocument).not.toHaveBeenCalled();
  });
});

describe('deleteSession', () => {
  it('removes the session cookie', async () => {
    const store = fakeCookies('token-1');

    await deleteSession();

    expect(store.delete).toHaveBeenCalledWith(SESSION_COOKIE);
  });

  it('does nothing when nobody is logged in', async () => {
    const store = fakeCookies();

    await deleteSession();

    expect(store.delete).not.toHaveBeenCalled();
  });
});
