import {
  collection,
  getDocs,
  type DocumentData,
  type Query,
} from "firebase/firestore";
import { db } from "./firestore";

export const getCollectionWithId = async <T extends { id: string }>(
  name: string,
): Promise<T[]> => {
  const snapshot = await getDocs(collection(db, name));

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
