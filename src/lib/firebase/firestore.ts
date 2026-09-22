import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig, isFirebaseConfigured } from "./config";

const app: FirebaseApp | null = isFirebaseConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

// `db` is null when Firebase isn't configured. Every caller of this module
// only reaches it after checking `isFirebaseConfigured` (see the page
// components and API routes under src/app), so the `!` below is safe there
// and keeps this module import-safe on its own.
export const db: Firestore | null = app ? getFirestore(app) : null;
