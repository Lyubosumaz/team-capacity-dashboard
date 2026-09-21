import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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
