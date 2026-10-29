import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'session';

// The logged-in user's Firebase login token (an "ID token"), which the
// browser saves in a cookie with saveSession(). Null when logged out.
export const getSessionToken = async (): Promise<string | null> =>
  (await cookies()).get(SESSION_COOKIE)?.value ?? null;
