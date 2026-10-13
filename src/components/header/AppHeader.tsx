"use client";

import type { FC } from "react";
import Link from "next/link";
import {
  TzarBrand,
  TzarCommonLink,
  TzarLanguageSelect,
  TzarThemeToggle,
  TzarUserMenu,
  type TzarLanguage,
} from "@tzardom-ui/react";
import type { Locale } from "@/lib/i18n/messages";
import { useAuth } from "@/providers/AuthProvider";
import { useLocalization } from "@/providers/LocalizationProvider";

const NAV_ITEMS = [
  { href: "/", labelKey: "header.nav.overview", testId: "overview" },
  { href: "/risk", labelKey: "header.nav.risk", testId: "risk" },
  { href: "/teams", labelKey: "header.nav.teams", testId: "teams" },
];

const LANGUAGES: TzarLanguage<Locale>[] = [
  { code: "en", short: "EN", label: "English" },
  { code: "bg", short: "BG", label: "Bulgarian" },
  { code: "ka", short: "KA", label: "Georgian" },
];

export const AppHeader: FC = () => {
  const { t, locale, setLocale } = useLocalization();
  const { user, logout } = useAuth();

  const renderNav = (testId: string) => (
    <nav
      className="flex gap-3 text-sm font-medium"
      aria-label="Primary navigation"
      data-testid={testId}
    >
      {NAV_ITEMS.map((item) => (
        <TzarCommonLink
          key={item.href}
          as={Link}
          href={item.href}
          variant="ghost"
          data-testid={`${testId}-${item.testId}`}
        >
          {t(item.labelKey)}
        </TzarCommonLink>
      ))}
    </nav>
  );

  return (
    <>
      <header
        className="border-b border-border-subtle bg-accent-soft backdrop-blur shadow-sm"
        data-testid="app-header"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
          <TzarBrand
            title={t("header.title")}
            subtitle={t("header.subtitle")}
            data-testid="header"
          />

          <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
            <div className="hidden md:block">{renderNav("nav")}</div>
            <div className="flex items-center gap-2">
              <TzarThemeToggle data-testid="header" />
              <TzarLanguageSelect
                languages={LANGUAGES}
                value={locale}
                onChange={setLocale}
                data-testid="header"
              />
              <div className="hidden md:block">
                {!user && (
                  <TzarCommonLink as={Link} href="/login" data-testid="login">
                    {t("header.login")}
                  </TzarCommonLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="border-b border-border-subtle bg-accent-soft/60 shadow-sm lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between py-2 px-6 gap-3">
          {renderNav("mobile-nav")}
          <div className="flex items-center gap-2">
            {!user && (
              <TzarCommonLink
                as={Link}
                href="/login"
                data-testid="mobile-login"
              >
                {t("header.login")}
              </TzarCommonLink>
            )}
            {user?.email && (
              <TzarUserMenu
                email={user.email}
                accountHref="/user"
                linkAs={Link}
                onLogout={logout}
                data-testid="mobile"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
