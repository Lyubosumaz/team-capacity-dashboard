import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("GET /api/teams", () => {
  it("returns a list of teams", async () => {
    const response = await GET();
    const data = await response.json();

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });
});
