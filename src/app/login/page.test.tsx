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
  it("renders login heading and form", async () => {
    // LoginPage is an async Server Component (it awaits withFirebasePage),
    // and @testing-library/react's render() can't invoke an async component
    // itself — so resolve it first, then render the JSX it returns.
    const ui = await LoginPage({});

    render(<Providers>{ui}</Providers>);

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByTestId("login-submit")).toBeInTheDocument();
  });
});
