"use client";

import { FC } from "react";
import { TzarFooter } from "@tzardom-ui/react";
import { useLocalization } from "@/providers/LocalizationProvider";

const getCurrentYear = () => new Date().getFullYear();

export const AppFooter: FC = () => {
  const { t } = useLocalization();
  const year = getCurrentYear();

  const copyright = t("footer.copyright").replace("{year}", `${year}`);

  return (
    <TzarFooter
      copyright={copyright}
      appName={t("footer.appName")}
      builtWith={t("footer.builtWith")}
      data-testid="app"
    />
  );
};
