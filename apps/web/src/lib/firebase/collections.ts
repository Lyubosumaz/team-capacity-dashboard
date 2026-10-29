import { firebaseConfig } from './config';
import {
  type FirestoreDocument,
  fromFirestoreDocument,
  toFirestoreFields,
} from './firestoreValues';
import { getSessionToken } from './sessionToken';

// Server only. Reads and writes Firestore through its REST API as the
// logged-in user, so the rules in firestore.rules decide what's allowed.
// No private key is needed: the user's own login token is enough.

const DOCUMENTS_URL = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

// Runs as the logged-in user from the session cookie, or as `asToken` when
// given (for the moment right after login, before the cookie is sent back).
const firestoreRequest = async (
  path: string,
  init: RequestInit = {},
  asToken?: string,
) => {
  const idToken = asToken ?? (await getSessionToken());

  return fetch(`${DOCUMENTS_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    },
    cache: 'no-store',
  });
};

const failed = async (response: Response) =>
  new Error(
    `Firestore request failed (${response.status}): ${await response.text()}`,
  );

// Every document in a collection, with its ID. Sorted by `orderBy` when
// given (documents without that field are left out).
export const getCollectionWithId = async <T extends { id: string }>(
  name: string,
  orderBy?: string,
): Promise<T[]> => {
  const items: T[] = [];
  let pageToken = '';

  // Firestore sends long collections in pages.
  do {
    const sort = orderBy ? `&orderBy=${encodeURIComponent(orderBy)}` : '';
    const page = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : '';
    const response = await firestoreRequest(
      `/${name}?pageSize=300${sort}${page}`,
    );

    if (!response.ok) {
      throw await failed(response);
    }

    const body = (await response.json()) as {
      documents?: FirestoreDocument[];
      nextPageToken?: string;
    };
    items.push(...(body.documents ?? []).map(fromFirestoreDocument<T>));
    pageToken = body.nextPageToken ?? '';
  } while (pageToken);

  return items;
};

// The documents in a collection whose `field` equals `value`.
export const getCollectionWhere = async <T extends { id: string }>(
  name: string,
  field: string,
  value: string,
): Promise<T[]> => {
  const response = await firestoreRequest(':runQuery', {
    method: 'POST',
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: name }],
        where: {
          fieldFilter: {
            field: { fieldPath: field },
            op: 'EQUAL',
            value: { stringValue: value },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    throw await failed(response);
  }

  // One result per document; a result without a document means "none found".
  const results = (await response.json()) as { document?: FirestoreDocument }[];

  return results
    .flatMap((result) => (result.document ? [result.document] : []))
    .map(fromFirestoreDocument<T>);
};

// One document with its ID, or null when it doesn't exist or the rules don't
// let this user read it (so other people's documents look like missing ones).
export const getDocWithId = async <T extends { id: string }>(
  name: string,
  id: string,
): Promise<T | null> => {
  const response = await firestoreRequest(`/${name}/${encodeURIComponent(id)}`);

  if (response.status === 404 || response.status === 403) {
    return null;
  }
  if (!response.ok) {
    throw await failed(response);
  }

  return fromFirestoreDocument<T>((await response.json()) as FirestoreDocument);
};

// Creates a document with this ID. Returns false, and changes nothing, when
// a document with this ID already exists.
export const createDocument = async (
  name: string,
  id: string,
  data: Record<string, unknown>,
): Promise<boolean> => {
  const response = await firestoreRequest(
    `/${name}?documentId=${encodeURIComponent(id)}`,
    {
      method: 'POST',
      body: JSON.stringify({ fields: toFirestoreFields(data) }),
    },
  );

  if (response.status === 409) {
    return false;
  }
  if (!response.ok) {
    throw await failed(response);
  }

  return true;
};

// Creates the document, or replaces it completely if it exists.
export const setDocument = async (
  name: string,
  id: string,
  data: Record<string, unknown>,
  asToken?: string,
): Promise<void> => {
  const response = await firestoreRequest(
    `/${name}/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ fields: toFirestoreFields(data) }),
    },
    asToken,
  );

  if (!response.ok) {
    throw await failed(response);
  }
};

// Changes only the given fields. Fails if the document doesn't exist.
export const updateDocument = async (
  name: string,
  id: string,
  data: Record<string, unknown>,
): Promise<void> => {
  const path = `/${name}/${encodeURIComponent(id)}`;
  const fieldsToChange = Object.keys(data)
    .map((field) => `updateMask.fieldPaths=${encodeURIComponent(field)}`)
    .join('&');
  const response = await firestoreRequest(
    `${path}?${fieldsToChange}&currentDocument.exists=true`,
    {
      method: 'PATCH',
      body: JSON.stringify({ fields: toFirestoreFields(data) }),
    },
  );

  if (!response.ok) {
    throw await failed(response);
  }
};

export const deleteDocument = async (
  name: string,
  id: string,
): Promise<void> => {
  const response = await firestoreRequest(
    `/${name}/${encodeURIComponent(id)}`,
    { method: 'DELETE' },
  );

  if (!response.ok) {
    throw await failed(response);
  }
};
