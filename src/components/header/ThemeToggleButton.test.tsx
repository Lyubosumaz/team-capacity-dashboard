import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { THEME_STORAGE_KEY } from "@/constants";
import { ThemeToggleButton } from "./ThemeToggleButton";

const getHtmlTheme = () => document.documentElement.getAttribute("data-theme");

describe("ThemeToggleButton", () => {
  beforeEach(() => {
    window.localStorage.removeItem(THEME_STORAGE_KEY);
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to light theme when no stored value", () => {
    render(<ThemeToggleButton />);

    const button = screen.getByTestId("theme-toggle");

    expect(getHtmlTheme()).toBe("light");
    expect(button).toBeInTheDocument();
  });

  it("renders when a stored theme value exists", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");

    render(<ThemeToggleButton />);

    const button = screen.getByTestId("theme-toggle");

    expect(button).toBeInTheDocument();
  });

  it("toggles theme and persists it", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "light");

    render(<ThemeToggleButton />);

    const button = screen.getByTestId("theme-toggle");

    fireEvent.click(button);

    expect(getHtmlTheme()).toBe("dark");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });
});
