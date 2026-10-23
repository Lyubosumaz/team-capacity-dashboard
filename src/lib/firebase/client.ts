'use client';

import { type FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import {
  type Auth,
  browserLocalPersistence,
  initializeAuth,
} from 'firebase/auth';
import { firebaseConfig, isFirebaseConfigured } from './config';

const app: FirebaseApp | null = isFirebaseConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

// null without Firebase keys in local.env. Check it before using it.
// initializeAuth, not getAuth: getAuth also ships popup and redirect sign-in,
// which this app doesn't use.
export const auth: Auth | null = app
  ? initializeAuth(app, { persistence: browserLocalPersistence })
  : null;
