import { fireEvent, render, screen } from "@testing-library/react";
import { TEST_ID_PREFIXES } from "@tzardom-ui/react";
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

const BRAND_ID = `${TEST_ID_PREFIXES.brand}-header`;
const THEME_TOGGLE_ID = `${TEST_ID_PREFIXES.themeToggle}-header`;
const LANGUAGE_SELECT_ID = `${TEST_ID_PREFIXES.languageSelect}-header`;
const LINK_ID = TEST_ID_PREFIXES.commonLink;
const USER_MENU_ID = `${TEST_ID_PREFIXES.userMenu}-header-mobile`;

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

    expect(screen.getByTestId(`${BRAND_ID}-title`)).toHaveTextContent(
      /team capacity dashboard/i,
    );
    expect(screen.getByTestId(`${BRAND_ID}-subtitle`)).toHaveTextContent(
      /plan capacity, workload, and delivery risk/i,
    );
  });

  it("links to the three primary pages in both navs", () => {
    renderHeader();

    for (const nav of ["header-nav", "header-nav-mobile"]) {
      expect(screen.getByTestId(`${LINK_ID}-${nav}-overview`)).toHaveAttribute(
        "href",
        "/",
      );
      expect(screen.getByTestId(`${LINK_ID}-${nav}-risk`)).toHaveAttribute(
        "href",
        "/risk",
      );
      expect(screen.getByTestId(`${LINK_ID}-${nav}-teams`)).toHaveAttribute(
        "href",
        "/teams",
      );
    }
    expect(
      screen.getByTestId(`${LINK_ID}-header-nav-overview`),
    ).toHaveTextContent(/overview/i);
    expect(
      screen.getAllByRole("navigation", { name: /primary navigation/i }),
    ).toHaveLength(2);
  });

  it("shows the login links and no user menu when logged out", () => {
    renderHeader();

    for (const login of ["header-login", "header-login-mobile"]) {
      const link = screen.getByTestId(`${LINK_ID}-${login}`);
      expect(link).toHaveAttribute("href", "/login");
      expect(link).toHaveTextContent(/log in/i);
    }
    expect(screen.queryByTestId(USER_MENU_ID)).toBeNull();
  });

  it("switches the page to dark with the theme toggle", () => {
    renderHeader();

    fireEvent.click(screen.getByTestId(THEME_TOGGLE_ID));

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("shows the current language and switches it", () => {
    renderHeader();
    const trigger = screen.getByTestId(`${LANGUAGE_SELECT_ID}-trigger`);

    expect(trigger).toHaveAccessibleName("Language: EN");

    fireEvent.click(trigger);
    fireEvent.click(screen.getByTestId(`${LANGUAGE_SELECT_ID}-option-bg`));

    expect(trigger).toHaveAccessibleName("Language: BG");
  });
});
