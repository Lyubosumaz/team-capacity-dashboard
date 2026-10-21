import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/sprints/route";

describe("GET /api/sprints", () => {
  it("returns a list of sprints", async () => {
    const response = await GET();
    const data = await response.json();

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });
});
