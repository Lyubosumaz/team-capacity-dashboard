import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig, isFirebaseConfigured } from "./config";

const app: FirebaseApp | null = isFirebaseConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

// `db` is null when Firebase isn't configured, which keeps this module
// import-safe without a .env. Not exported: everything goes through `getDb()`.
const db: Firestore | null = app ? getFirestore(app) : null;

/**
 * Returns the Firestore instance, or throws a readable error if Firebase
 * isn't configured. Callers are expected to have checked first (pages via
 * `requireFirebase()`, API routes via their own env check), so hitting this
 * throw means a guard is missing.
 */
export const getDb = (): Firestore => {
  if (!db) {
    throw new Error(
      "Firestore used without Firebase configured. Guard the page with requireFirebase() (or check isFirebaseConfigured in API routes) before calling it.",
    );
  }

  return db;
};
