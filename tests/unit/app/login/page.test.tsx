import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Pretend Firebase is configured (firebase/auth is mocked in vitest.setup.ts).
vi.mock("@/lib/firebase/config", () => ({
  isFirebaseConfigured: true,
  firebaseConfig: {},
}));

import LoginPage from "@/app/login/page";
import { Providers } from "@/shared/providers/Providers";

describe("Login page", () => {
  it("renders login heading and form", () => {
    render(
      <Providers>
        <LoginPage />
      </Providers>,
    );

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByTestId("login-submit")).toHaveAttribute(
      "type",
      "submit",
    );
    expect(screen.getByTestId("login-submit")).toHaveTextContent("Log in");
    expect(screen.getByTestId("login-email")).toHaveAccessibleName(
      "Work email",
    );
    expect(screen.getByTestId("login-password")).toHaveAccessibleName(
      "Password",
    );
  });
});
