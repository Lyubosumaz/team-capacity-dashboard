import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createDocument,
  getCollectionWhere,
  getCollectionWithId,
  getDocWithId,
  setDocument,
} from '@/lib/firebase/collections';

vi.mock('@/lib/firebase/config', () => ({
  firebaseConfig: { projectId: 'demo' },
}));
vi.mock('@/lib/firebase/sessionToken', () => ({
  getSessionToken: async () => 'token-1',
}));

const DOCS = 'projects/demo/databases/(default)/documents';
const fetchMock = vi.fn();

// Pretends Firestore answers the next request with this status and body.
const firestoreAnswers = (status: number, body: unknown = {}) => {
  fetchMock.mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  });
};

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getCollectionWithId', () => {
  it('reads a collection as the logged-in user', async () => {
    firestoreAnswers(200, {
      documents: [
        {
          name: `${DOCS}/teams/team-alpha`,
          fields: { name: { stringValue: 'Alpha' } },
        },
      ],
    });

    expect(await getCollectionWithId('teams')).toEqual([
      { id: 'team-alpha', name: 'Alpha' },
    ]);

    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toContain(`/${DOCS}/teams?pageSize=300`);
    expect(request.headers.Authorization).toBe('Bearer token-1');
  });

  it('follows the pages of a long collection', async () => {
    firestoreAnswers(200, {
      documents: [{ name: `${DOCS}/teams/a` }],
      nextPageToken: 'page-2',
    });
    firestoreAnswers(200, { documents: [{ name: `${DOCS}/teams/b` }] });

    expect(await getCollectionWithId('teams')).toEqual([
      { id: 'a' },
      { id: 'b' },
    ]);
    expect(fetchMock.mock.calls[1][0]).toContain('pageToken=page-2');
  });

  it('fails when Firestore refuses', async () => {
    firestoreAnswers(403, { error: 'PERMISSION_DENIED' });

    await expect(getCollectionWithId('teams')).rejects.toThrow('403');
  });
});

describe('getCollectionWhere', () => {
  it('returns only the documents found', async () => {
    firestoreAnswers(200, [
      { document: { name: `${DOCS}/projects/p1` } },
      { readTime: '2026-10-29T12:00:00Z' },
    ]);

    expect(await getCollectionWhere('projects', 'teamId', 'team-a')).toEqual([
      { id: 'p1' },
    ]);
  });
});

describe('getDocWithId', () => {
  it('returns null for a missing document', async () => {
    firestoreAnswers(404);

    expect(await getDocWithId('teams', 'missing')).toBeNull();
  });

  it("returns null for someone else's document", async () => {
    firestoreAnswers(403);

    expect(await getDocWithId('teams', 'not-mine')).toBeNull();
  });
});

describe('createDocument', () => {
  it('creates the document', async () => {
    firestoreAnswers(200, { name: `${DOCS}/teams/new-team` });

    expect(await createDocument('teams', 'new-team', { name: 'New' })).toBe(
      true,
    );
    expect(fetchMock.mock.calls[0][0]).toContain('documentId=new-team');
  });

  it('returns false when the ID is already taken', async () => {
    firestoreAnswers(409);

    expect(await createDocument('teams', 'team-alpha', { name: 'A' })).toBe(
      false,
    );
  });
});

describe('setDocument', () => {
  it('can run as a given login token instead of the cookie', async () => {
    firestoreAnswers(200);

    await setDocument('users', 'ana', { email: 'ana@example.com' }, 'token-2');

    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toContain(`/${DOCS}/users/ana`);
    expect(request.method).toBe('PATCH');
    expect(request.headers.Authorization).toBe('Bearer token-2');
  });
});
