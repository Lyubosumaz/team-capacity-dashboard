'use client';

import { type FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { type Auth, getAuth } from 'firebase/auth';
import { firebaseConfig, isFirebaseConfigured } from './config';

const app: FirebaseApp | null = isFirebaseConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

// null without Firebase keys in local.env. Check it before using it.
export const auth: Auth | null = app ? getAuth(app) : null;
