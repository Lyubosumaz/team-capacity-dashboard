import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppHeader } from "./AppHeader";
import { Providers } from "../../providers/Providers";

vi.mock("next/link", () => {
  return {
    __esModule: true,
    default: ({ href, children, ...rest }: any) => (
      <a href={href} {...rest}>
        {children}
      </a>
    ),
  };
});

describe("AppHeader", () => {
  it("renders title, subtitle, and primary nav links", () => {
    render(
      <Providers>
        <AppHeader />
      </Providers>,
    );

    expect(screen.getByText(/team capacity dashboard/i)).toBeInTheDocument();
    expect(
      screen.getByText(/plan capacity, workload, and delivery risk/i),
    ).toBeInTheDocument();
    const overviewLinks = screen.getAllByTestId("nav-link-overview");
    const riskLinks = screen.getAllByTestId("nav-link-risk");
    const teamsLinks = screen.getAllByTestId("nav-link-teams");

    expect(overviewLinks.length).toBeGreaterThanOrEqual(1);
    expect(riskLinks.length).toBeGreaterThanOrEqual(1);
    expect(teamsLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the theme toggle button", () => {
    render(
      <Providers>
        <AppHeader />
      </Providers>,
    );

    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    const loginButtons = screen.getAllByTestId("login-button");
    expect(loginButtons.length).toBeGreaterThanOrEqual(1);
  });
});
