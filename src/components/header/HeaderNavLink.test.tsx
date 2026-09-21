import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HeaderNav } from "./HeaderNavLink";
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

describe("HeaderNav", () => {
  it("renders all primary navigation links with correct labels and hrefs", () => {
    render(
      <Providers>
        <HeaderNav />
      </Providers>,
    );

    const overviewLink = screen.getByTestId("nav-link-overview");
    const riskLink = screen.getByTestId("nav-link-risk");
    const teamsLink = screen.getByTestId("nav-link-teams");

    expect(overviewLink).toHaveAttribute("href", "/");
    expect(riskLink).toHaveAttribute("href", "/risk");
    expect(teamsLink).toHaveAttribute("href", "/teams");
  });

  it("sets an accessible nav label", () => {
    render(
      <Providers>
        <HeaderNav />
      </Providers>,
    );

    expect(
      screen.getByRole("navigation", { name: /primary navigation/i }),
    ).toBeInTheDocument();
  });
});
