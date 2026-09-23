import {
  collection,
  getDocs,
  type DocumentData,
  type Query,
} from "firebase/firestore";
import { getDb } from "./firestore";

// Callers must only invoke these after confirming `isFirebaseConfigured`
// (see firebase/config.ts); otherwise `getDb()` throws a descriptive error.
export const getCollectionWithId = async <T extends { id: string }>(
  name: string,
): Promise<T[]> => {
  const snapshot = await getDocs(collection(getDb(), name));

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<T, "id">;
    return {
      ...data,
      id: doc.id,
    } as T;
  });
};

export const getCollectionQueryWithId = async <T extends { id: string }>(
  q: Query<DocumentData>,
): Promise<T[]> => {
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<T, "id">;
    return {
      ...data,
      id: doc.id,
    } as T;
  });
};
