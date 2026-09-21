"use client";

import { FC, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { THEME_STORAGE_KEY } from "@/constants";

enum Theme {
  Light = "light",
  Dark = "dark",
}

export const ThemeToggleButton: FC = () => {
  const [theme, setTheme] = useState<Theme>(Theme.Light);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(
        THEME_STORAGE_KEY,
      ) as Theme | null;
      const initialTheme = stored ?? Theme.Light;
      document.documentElement.setAttribute("data-theme", initialTheme);
    } catch {
      document.documentElement.setAttribute("data-theme", Theme.Light);
      console.warn(
        "Failed to load theme from localStorage, falling back to default",
      );
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
      document.documentElement.setAttribute("data-theme", theme);
    } catch {
      console.warn("Failed to save theme to localStorage");
    }
  }, [theme]);

  const toggleTheme = () => {
    const currentThemeAttr = document.documentElement.getAttribute(
      "data-theme",
    ) as Theme | null;
    const effectiveTheme =
      currentThemeAttr === Theme.Light || currentThemeAttr === Theme.Dark
        ? currentThemeAttr
        : theme;

    const nextTheme: Theme =
      effectiveTheme === Theme.Light ? Theme.Dark : Theme.Light;
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-1.5 rounded-full p-2 text-xs font-medium text-secondary hover:bg-main-soft hover:text-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:bg-main-soft"
      data-testid="theme-toggle"
    >
      {theme === Theme.Dark ? (
        <Sun className="h-4.5 w-4.5" aria-hidden="true" />
      ) : (
        <Moon className="h-4.5 w-4.5" aria-hidden="true" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
