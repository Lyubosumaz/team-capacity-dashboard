import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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
