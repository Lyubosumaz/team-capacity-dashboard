import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCurrentUser } from '@/features/auth/currentUser';
import { getSessionToken } from '@/lib/firebase/sessionToken';

const firebase = vi.hoisted(() => ({ isConfigured: true }));

vi.mock('@/lib/firebase/config', () => ({
  firebaseConfig: { apiKey: 'test-api-key' },
  get isFirebaseConfigured() {
    return firebase.isConfigured;
  },
}));
vi.mock('@/lib/firebase/sessionToken', () => ({ getSessionToken: vi.fn() }));

const fetchMock = vi.fn();

// A login token (JWT) that expires in this many seconds.
const tokenExpiringIn = (seconds: number) => {
  const exp = Math.floor(Date.now() / 1000) + seconds;
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url');

  return `header.${payload}.signature`;
};

const VALID_TOKEN = tokenExpiringIn(3600);

// Pretends Firebase Auth knows whose login token it is, or doesn't.
const accountLookupReturns = (account?: {
  localId: string;
  email?: string;
}) => {
  fetchMock.mockResolvedValue({
    ok: account !== undefined,
    json: async () => ({ users: account ? [account] : [] }),
  });
};

beforeEach(() => {
  firebase.isConfigured = true;
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  vi.mocked(getSessionToken).mockResolvedValue(VALID_TOKEN);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getCurrentUser', () => {
  it('returns null when Firebase is not set up', async () => {
    firebase.isConfigured = false;

    expect(await getCurrentUser()).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns null without a login token', async () => {
    vi.mocked(getSessionToken).mockResolvedValue(null);

    expect(await getCurrentUser()).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns null for a token Firebase Auth does not know', async () => {
    accountLookupReturns(undefined);

    expect(await getCurrentUser()).toBeNull();
  });

  it('returns null for an expired token, without asking Firebase', async () => {
    vi.mocked(getSessionToken).mockResolvedValue(tokenExpiringIn(-60));

    expect(await getCurrentUser()).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns null for a token that is not a JWT', async () => {
    vi.mocked(getSessionToken).mockResolvedValue('not-a-token');

    expect(await getCurrentUser()).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns the user that Firebase Auth finds for the token', async () => {
    accountLookupReturns({ localId: 'user-1', email: 'ana@example.com' });

    expect(await getCurrentUser()).toEqual({
      uid: 'user-1',
      email: 'ana@example.com',
    });

    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toContain('accounts:lookup?key=test-api-key');
    expect(request.body).toBe(JSON.stringify({ idToken: VALID_TOKEN }));
  });
});
