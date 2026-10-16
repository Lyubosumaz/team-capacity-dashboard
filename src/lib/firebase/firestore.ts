import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig, isFirebaseConfigured } from "./config";

const app: FirebaseApp | null = isFirebaseConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

const db: Firestore | null = app ? getFirestore(app) : null;

// Throws if Firebase isn't configured: check with requireFirebase() first.
export const getDb = (): Firestore => {
  if (!db) {
    throw new Error(
      "Firestore used without Firebase configured. Guard the page with requireFirebase() (or check isFirebaseConfigured in API routes) before calling it.",
    );
  }

  return db;
};
