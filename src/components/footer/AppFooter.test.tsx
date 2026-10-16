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

    const footer = screen.getByTestId("app-footer");

    expect(footer).toHaveTextContent(
      new RegExp(`©\\s*${year}\\s*lyubosumaz-projects`, "i"),
    );
    expect(footer).toHaveTextContent(/team capacity dashboard/i);
    expect(footer).toHaveTextContent(/built with next.js & tailwind css/i);
  });
});
