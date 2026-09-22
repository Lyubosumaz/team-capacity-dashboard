"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { firebaseConfig, isFirebaseConfigured } from "./config";

const app: FirebaseApp | null = isFirebaseConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

// `auth` is null when Firebase isn't configured (e.g. no .env locally).
// Consumers (AuthProvider, login/register) must handle that instead of
// calling into it directly, so a missing .env never throws at import time.
export const auth: Auth | null = app ? getAuth(app) : null;
