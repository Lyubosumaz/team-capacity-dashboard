import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("GET /api/risk", () => {
  it("returns risk bundle with rules, insights, and events", async () => {
    const response = await GET();
    const data = await response.json();

    expect(Array.isArray(data.rules)).toBe(true);
    expect(Array.isArray(data.insights)).toBe(true);
    expect(Array.isArray(data.events)).toBe(true);
  });
});
