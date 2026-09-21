import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppFooter } from "./AppFooter";
import { Providers } from "../../providers/Providers";

describe("AppFooter", () => {
  it("renders current year, app name, and tech stack", () => {
    render(
      <Providers>
        <AppFooter />
      </Providers>,
    );

    const year = new Date().getFullYear();

    expect(screen.getByTestId("app-footer")).toBeInTheDocument();

    expect(
      screen.getByText(new RegExp(`©\\s*${year}\\s*lyubosumaz-projects`, "i")),
    ).toBeInTheDocument();
    expect(screen.getByText(/team capacity dashboard/i)).toBeInTheDocument();
    expect(
      screen.getByText(/built with next.js & tailwind css/i),
    ).toBeInTheDocument();
  });
});
