import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { requireFirebase } from "./requireFirebase";

const firebase = vi.hoisted(() => ({ isConfigured: false }));

vi.mock("@/lib/firebase/config", () => ({
  get isFirebaseConfigured() {
    return firebase.isConfigured;
  },
}));

describe("requireFirebase", () => {
  it("returns nothing when Firebase is configured", () => {
    firebase.isConfigured = true;

    expect(requireFirebase("Teams")).toBeNull();
  });

  it("returns the unavailable screen when Firebase isn't configured", () => {
    firebase.isConfigured = false;

    render(requireFirebase("Teams"));

    expect(screen.getByTestId("firebase-unavailable-header")).toHaveTextContent(
      "Teams needs Firebase configured",
    );
  });
});
