"use client";

import { FC } from "react";
import { useLocalization } from "@/providers/LocalizationProvider";

const getCurrentYear = () => new Date().getFullYear();

export const AppFooter: FC = () => {
  const { t } = useLocalization();
  const year = getCurrentYear();

  const copyright = t("footer.copyright").replace("{year}", `${year}`);

  return (
    <footer
      className="mt-auto border-t border-border-subtle bg-background/80"
      data-testid="app-footer"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 text-xs text-muted md:px-6">
        <p>{copyright}</p>
        <p className="font-medium text-secondary">{t("footer.appName")}</p>
        <p className="text-secondary/70">{t("footer.builtWith")}</p>
      </div>
    </footer>
  );
};
