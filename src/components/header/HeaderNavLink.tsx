"use client";

import Link from "next/link";
import { FC } from "react";
import { useLocalization } from "@/providers/LocalizationProvider";

const navItems = [
  { href: "/", labelKey: "header.nav.overview", testId: "nav-link-overview" },
  { href: "/risk", labelKey: "header.nav.risk", testId: "nav-link-risk" },
  { href: "/teams", labelKey: "header.nav.teams", testId: "nav-link-teams" },
];

export const HeaderNav: FC = () => {
  const { t } = useLocalization();

  return (
    <nav
      className="flex gap-3 text-sm font-medium"
      aria-label="Primary navigation"
      data-testid="primary-nav"
    >
      {navItems.map((item, index) => (
        <Link
          key={`header-nav-link-${index}`}
          href={item.href}
          className="rounded-full px-3 py-1 text-secondary hover:bg-main-soft hover:text-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:bg-main-soft"
          data-testid={item.testId}
        >
          {t(item.labelKey)}
        </Link>
      ))}
    </nav>
  );
};
