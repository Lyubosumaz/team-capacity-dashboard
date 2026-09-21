"use client";

import type { FC } from "react";
import Link from "next/link";
import { useLocalization } from "@/providers/LocalizationProvider";
import { useAuth } from "@/providers/AuthProvider";

export const LoginButton: FC = () => {
  const { t } = useLocalization();
  const { user } = useAuth();

  if (user) {
    return null;
  }

  return (
    <Link
      href="/login"
      className="rounded-full border border-border-subtle bg-background px-3 py-1 text-xs font-medium text-secondary hover:bg-main-soft hover:text-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:bg-main-soft"
      data-testid="login-button"
    >
      {t("header.login")}
    </Link>
  );
};
