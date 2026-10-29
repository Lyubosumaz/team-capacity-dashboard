'use server';

import { cookies } from 'next/headers';
import { setDocument } from '@/lib/firebase/collections';
import { SESSION_COOKIE } from '@/lib/firebase/sessionToken';
import { lookUpAccount } from './currentUser';

const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60;

// Gives the server a copy of the browser's Firebase login token, in a cookie
// it reads on every page. The browser calls this after logging in and each
// time Firebase renews the token (about every hour).
export const saveSession = async (idToken: string) => {
  const cookieStore = await cookies();

  // Saving a cookie re-renders the page, so skip it when nothing changed.
  if (cookieStore.get(SESSION_COOKIE)?.value === idToken) {
    return;
  }

  cookieStore.set(SESSION_COOKIE, idToken, {
    // Scripts on the page can't read it, so they can't steal it.
    httpOnly: true,
    // HTTPS only, except on localhost while developing.
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: THIRTY_DAYS_IN_SECONDS,
  });

  // Keeps the user's profile in `users`, so others can add them to teams.
  const account = await lookUpAccount(idToken);

  if (account?.email) {
    await setDocument('users', account.uid, { email: account.email }, idToken)
      // The login still works without it; they just can't be picked yet.
      .catch((error) => console.error('Could not save the profile', error));
  }
};

export const deleteSession = async () => {
  const cookieStore = await cookies();

  if (cookieStore.has(SESSION_COOKIE)) {
    cookieStore.delete(SESSION_COOKIE);
  }
};
