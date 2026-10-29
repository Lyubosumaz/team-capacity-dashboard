import { cookies } from 'next/headers';
import { describe, expect, it, vi } from 'vitest';
import { getSessionToken, SESSION_COOKIE } from '@/lib/firebase/sessionToken';

vi.mock('next/headers', () => ({ cookies: vi.fn() }));

const sendCookie = (value?: string) => {
  vi.mocked(cookies).mockResolvedValue({
    get: (name: string) =>
      name === SESSION_COOKIE && value ? { name, value } : undefined,
  } as unknown as Awaited<ReturnType<typeof cookies>>);
};

describe('getSessionToken', () => {
  it('reads the login token from the session cookie', async () => {
    sendCookie('token-1');

    expect(await getSessionToken()).toBe('token-1');
  });

  it('returns null when nobody is logged in', async () => {
    sendCookie();

    expect(await getSessionToken()).toBeNull();
  });
});
