import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// This test exercises the real register form, so it needs the page to
// believe Firebase is configured (firebase/auth itself is mocked in
// vitest.setup.ts, so nothing real is ever called).
vi.mock("@/lib/firebase/config", () => ({
  isFirebaseConfigured: true,
  firebaseConfig: {},
}));

import RegisterPage from "./page";
import { Providers } from "@/providers/Providers";

describe("Register page", () => {
  it("renders register heading and form", () => {
    render(
      <Providers>
        <RegisterPage />
      </Providers>,
    );

    expect(screen.getByTestId("register-page")).toBeInTheDocument();
    expect(screen.getByTestId("register-form")).toBeInTheDocument();
    expect(screen.getByTestId("register-submit")).toBeInTheDocument();
  });
});
