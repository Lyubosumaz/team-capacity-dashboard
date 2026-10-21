import { describe, expect, it } from 'vitest';

import { GET } from '@/app/api/projects/route';

describe('GET /api/projects', () => {
  it('returns a list of projects', async () => {
    const response = await GET();
    const data = await response.json();

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });
});
