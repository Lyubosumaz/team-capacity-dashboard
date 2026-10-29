import { describe, expect, it } from 'vitest';
import {
  fromFirestoreDocument,
  toFirestoreFields,
} from '@/lib/firebase/firestoreValues';

describe('fromFirestoreDocument', () => {
  it('turns typed Firestore values into plain values, with the ID', () => {
    const team = fromFirestoreDocument<{ id: string }>({
      name: 'projects/demo/databases/(default)/documents/teams/team-alpha',
      fields: {
        name: { stringValue: 'Alpha' },
        size: { integerValue: '3' },
        load: { doubleValue: 0.5 },
        active: { booleanValue: true },
        lead: { nullValue: null },
        members: {
          arrayValue: {
            values: [
              { mapValue: { fields: { name: { stringValue: 'Ana' } } } },
            ],
          },
        },
        tags: { arrayValue: {} },
      },
    });

    expect(team).toEqual({
      id: 'team-alpha',
      name: 'Alpha',
      size: 3,
      load: 0.5,
      active: true,
      lead: null,
      members: [{ name: 'Ana' }],
      tags: [],
    });
  });
});

describe('toFirestoreFields', () => {
  it('wraps plain values in Firestore types', () => {
    expect(
      toFirestoreFields({
        name: 'Alpha',
        size: 3,
        load: 0.5,
        active: false,
        members: [{ name: 'Ana' }],
      }),
    ).toEqual({
      name: { stringValue: 'Alpha' },
      size: { integerValue: '3' },
      load: { doubleValue: 0.5 },
      active: { booleanValue: false },
      members: {
        arrayValue: {
          values: [{ mapValue: { fields: { name: { stringValue: 'Ana' } } } }],
        },
      },
    });
  });

  it('leaves out undefined fields', () => {
    expect(
      toFirestoreFields({ name: 'Alpha', isKeyPerson: undefined }),
    ).toEqual({ name: { stringValue: 'Alpha' } });
  });
});
