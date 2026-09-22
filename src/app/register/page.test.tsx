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
  it("renders register heading and form", async () => {
    // RegisterPage is an async Server Component (it awaits withFirebasePage),
    // and @testing-library/react's render() can't invoke an async component
    // itself — so resolve it first, then render the JSX it returns.
    const ui = await RegisterPage({});

    render(<Providers>{ui}</Providers>);

    expect(screen.getByTestId("register-page")).toBeInTheDocument();
    expect(screen.getByTestId("register-form")).toBeInTheDocument();
    expect(screen.getByTestId("register-submit")).toBeInTheDocument();
  });
});
