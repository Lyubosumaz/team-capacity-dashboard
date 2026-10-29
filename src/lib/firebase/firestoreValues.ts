// Firestore's REST API wraps every value with its type, e.g.
// { stringValue: 'Alex' } or { integerValue: '30' }. These helpers turn
// those into plain JavaScript values and back.

export type FirestoreValue = {
  nullValue?: null;
  booleanValue?: boolean;
  integerValue?: string;
  doubleValue?: number;
  timestampValue?: string;
  stringValue?: string;
  referenceValue?: string;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: FirestoreFields };
};

export type FirestoreFields = Record<string, FirestoreValue>;

export type FirestoreDocument = {
  // Full path, e.g. ".../databases/(default)/documents/teams/team-alpha".
  name: string;
  fields?: FirestoreFields;
};

export const fromFirestoreValue = (value: FirestoreValue): unknown => {
  if ('stringValue' in value) return value.stringValue;
  // Integers come as text, because JSON numbers can't hold every 64-bit one.
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('referenceValue' in value) return value.referenceValue;
  if ('arrayValue' in value) {
    return (value.arrayValue?.values ?? []).map(fromFirestoreValue);
  }
  if ('mapValue' in value) return fromFirestoreFields(value.mapValue?.fields);
  return null;
};

export const fromFirestoreFields = (
  fields: FirestoreFields = {},
): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      fromFirestoreValue(value),
    ]),
  );

// A document's fields plus its ID (the last part of its name).
export const fromFirestoreDocument = <T extends { id: string }>(
  document: FirestoreDocument,
): T => {
  const id = decodeURIComponent(document.name.split('/').pop() ?? '');

  return { ...fromFirestoreFields(document.fields), id } as T;
};

export const toFirestoreValue = (value: unknown): FirestoreValue => {
  if (value === null) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }
  if (typeof value === 'object') {
    return {
      mapValue: { fields: toFirestoreFields(value as Record<string, unknown>) },
    };
  }
  throw new Error(`Firestore can't store a ${typeof value}`);
};

// Fields that are undefined are left out, like the Firebase SDKs do.
export const toFirestoreFields = (
  data: Record<string, unknown>,
): FirestoreFields =>
  Object.fromEntries(
    Object.entries(data)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, toFirestoreValue(value)]),
  );
