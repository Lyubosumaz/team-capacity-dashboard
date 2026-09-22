import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// This test exercises the real login form, so it needs the page to believe
// Firebase is configured (firebase/auth itself is mocked in vitest.setup.ts,
// so nothing real is ever called).
vi.mock("@/lib/firebase/config", () => ({
  isFirebaseConfigured: true,
  firebaseConfig: {},
}));

import LoginPage from "./page";
import { Providers } from "@/providers/Providers";

describe("Login page", () => {
  it("renders login heading and form", () => {
    render(
      <Providers>
        <LoginPage />
      </Providers>,
    );

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByTestId("login-submit")).toBeInTheDocument();
  });
});
