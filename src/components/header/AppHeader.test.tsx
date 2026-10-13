import { fireEvent, render, screen } from "@testing-library/react";
import { tzrTestId } from "@tzardom-ui/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Providers } from "../../providers/Providers";
import { AppHeader } from "./AppHeader";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const renderHeader = () =>
  render(
    <Providers>
      <AppHeader />
    </Providers>,
  );

describe("AppHeader", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows the brand's title and subtitle", () => {
    renderHeader();

    expect(
      screen.getByTestId(tzrTestId("brand", "header", "title")),
    ).toHaveTextContent(/team capacity dashboard/i);
    expect(
      screen.getByTestId(tzrTestId("brand", "header", "subtitle")),
    ).toHaveTextContent(/plan capacity, workload, and delivery risk/i);
  });

  it("links to the three primary pages in both navs", () => {
    renderHeader();

    for (const nav of ["nav", "mobile-nav"]) {
      expect(
        screen.getByTestId(tzrTestId("commonLink", `${nav}-overview`)),
      ).toHaveAttribute("href", "/");
      expect(
        screen.getByTestId(tzrTestId("commonLink", `${nav}-risk`)),
      ).toHaveAttribute("href", "/risk");
      expect(
        screen.getByTestId(tzrTestId("commonLink", `${nav}-teams`)),
      ).toHaveAttribute("href", "/teams");
    }
    expect(
      screen.getByTestId(tzrTestId("commonLink", "nav-overview")),
    ).toHaveTextContent(/overview/i);
    expect(
      screen.getAllByRole("navigation", { name: /primary navigation/i }),
    ).toHaveLength(2);
  });

  it("shows the login links and no user menu when logged out", () => {
    renderHeader();

    for (const login of ["login", "mobile-login"]) {
      const link = screen.getByTestId(tzrTestId("commonLink", login));
      expect(link).toHaveAttribute("href", "/login");
      expect(link).toHaveTextContent(/log in/i);
    }
    expect(screen.queryByTestId(tzrTestId("userMenu", "mobile"))).toBeNull();
  });

  it("switches the page to dark with the theme toggle", () => {
    renderHeader();

    fireEvent.click(screen.getByTestId(tzrTestId("themeToggle", "header")));

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("shows the current language and switches it", () => {
    renderHeader();
    const trigger = screen.getByTestId(
      tzrTestId("languageSelect", "header", "trigger"),
    );

    expect(trigger).toHaveAccessibleName("Language: EN");

    fireEvent.click(trigger);
    fireEvent.click(
      screen.getByTestId(tzrTestId("languageSelect", "header", "option-bg")),
    );

    expect(trigger).toHaveAccessibleName("Language: BG");
  });
});
