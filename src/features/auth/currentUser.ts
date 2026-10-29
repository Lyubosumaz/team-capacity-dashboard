import { cache } from 'react';
import { firebaseConfig, isFirebaseConfigured } from '@/lib/firebase/config';
import { getSessionToken } from '@/lib/firebase/sessionToken';

export type CurrentUser = {
  uid: string;
  email: string | null;
};

// Asks Firebase Auth whose login token this is. Needs only the public API
// key. Returns null for expired or fake tokens and for deleted users.
export const lookUpAccount = async (
  idToken: string,
): Promise<CurrentUser | null> => {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    return null;
  }

  const body = (await response.json()) as {
    users?: { localId: string; email?: string }[];
  };
  const account = body.users?.[0];

  return account
    ? { uid: account.localId, email: account.email ?? null }
    : null;
};

// Login tokens last one hour. Firebase's account lookup still accepts expired
// ones, but Firestore doesn't, so check the expiry here. The token is a JWT:
// its middle part is JSON (base64url) with `exp`, in seconds.
const isExpired = (idToken: string) => {
  try {
    const payload = idToken.split('.')[1] ?? '';
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    // A minute early, so it can't run out halfway through loading a page.
    return exp * 1000 < Date.now() + 60_000;
  } catch {
    return true;
  }
};

// The logged-in user, from the login token in the session cookie, or null.
// cache(): several parts of a page can call it, but it checks only once per
// request.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  // Without Firebase set up, nobody can log in.
  if (!isFirebaseConfigured) {
    return null;
  }

  const idToken = await getSessionToken();

  // An expired token counts as logged out. The page then waits while the
  // browser saves a fresh one (see LoginRequired), and reloads with the data.
  if (!idToken || isExpired(idToken)) {
    return null;
  }

  return lookUpAccount(idToken);
});
