"use client";

import { FC } from "react";
import { Umbrella } from "lucide-react";
import { HeaderNav } from "./HeaderNavLink";
import { ThemeToggleButton } from "./ThemeToggleButton";
import { LanguageToggleButton } from "./LanguageToggleButton";
import { LoginButton } from "./LoginButton";
import { UserMenu } from "./UserMenu";
import { useLocalization } from "@/providers/LocalizationProvider";

export const AppHeader: FC = () => {
  const { t } = useLocalization();

  return (
    <>
      <header className="border-b border-border-subtle bg-accent-soft backdrop-blur shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <Umbrella className="h-8 w-8" aria-hidden="true" />

            <div className="flex flex-col leading-4">
              <span className="text-sm font-semibold tracking-tight text-foreground">
                {t("header.title")}
              </span>
              <span className="text-xs text-muted">{t("header.subtitle")}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
            <div className="hidden md:block">
              <HeaderNav />
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggleButton />
              <LanguageToggleButton />
              <div className="hidden md:block">
                <LoginButton />
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="border-b border-border-subtle bg-accent-soft/60 shadow-sm lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between py-2 px-6 gap-3">
          <HeaderNav />
          <div className="flex items-center gap-2">
            <LoginButton />
            <UserMenu />
          </div>
        </div>
      </div>
    </>
  );
};
