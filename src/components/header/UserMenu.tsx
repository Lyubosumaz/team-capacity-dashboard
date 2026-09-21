"use client";

import type { FC, MouseEvent } from "react";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";

export const UserMenu: FC = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) {
    return null;
  }

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleLogout = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await logout();
    } finally {
      setOpen(false);
    }
  };

  const initial = (user.email ?? "U").charAt(0).toUpperCase();

  return (
    <div data-testid="user-menu">
      <button
        type="button"
        onClick={handleToggle}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-main-soft text-xs font-semibold text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
        aria-haspopup="menu"
        aria-expanded={open}
        data-testid="user-menu-toggle"
      >
        <span className="sr-only">Open user menu</span>
        {initial}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-40 rounded-md border border-border-subtle bg-background shadow-lg">
          <div
            className="px-3 py-2 text-xs text-muted truncate"
            data-testid="user-menu-email"
          >
            {user.email ?? "Account"}
          </div>
          <Link
            href="/user"
            className="block w-full px-3 py-2 text-left text-xs font-medium text-secondary hover:bg-main-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            data-testid="user-menu-account"
          >
            Account
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full px-3 py-2 text-left text-xs font-medium text-secondary hover:bg-main-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            data-testid="logout-button"
          >
            Log out
          </button>
        </div>
      ) : null}
    </div>
  );
};
