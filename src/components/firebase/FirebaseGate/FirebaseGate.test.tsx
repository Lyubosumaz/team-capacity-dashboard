import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FirebaseProvider } from "@/providers/FirebaseProvider";
import { FirebaseGate } from "./FirebaseGate";

const renderGate = (isConfigured: boolean) =>
  render(
    <FirebaseProvider isConfigured={isConfigured}>
      <FirebaseGate feature="Sign in">
        <p data-testid="gated-content">Login form</p>
      </FirebaseGate>
    </FirebaseProvider>,
  );

describe("FirebaseGate", () => {
  it("shows its children when Firebase is configured", () => {
    renderGate(true);

    expect(screen.getByTestId("gated-content")).toBeInTheDocument();
    expect(screen.queryByTestId("firebase-unavailable")).toBeNull();
  });

  it("shows the unavailable screen when Firebase isn't configured", () => {
    renderGate(false);

    expect(screen.queryByTestId("gated-content")).toBeNull();
    expect(screen.getByTestId("firebase-unavailable-header")).toHaveTextContent(
      "Sign in needs Firebase configured",
    );
  });
});
