"use client";

import { useState, type FC } from "react";
import { ChevronDown } from "lucide-react";
import { useLocalization } from "@/providers/LocalizationProvider";

const LANGUAGES = [
  { code: "en" as const, short: "EN", label: "English" },
  { code: "bg" as const, short: "BG", label: "Bulgarian" },
  { code: "ka" as const, short: "KA", label: "Georgian" },
];

export const LanguageToggleButton: FC = () => {
  const { locale, setLocale } = useLocalization();
  const [open, setOpen] = useState(false);

  const current =
    LANGUAGES.find((lang) => lang.code === locale) ?? LANGUAGES[0];

  const handleSelect = (code: "en" | "bg" | "ka") => {
    setLocale(code);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-secondary hover:bg-main-soft hover:text-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:bg-main-soft"
      >
        <span>{current.short}</span>
        <ChevronDown className="h-3 w-3" aria-hidden="true" />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 z-10 mt-2 w-32 rounded-md border border-border-subtle bg-background py-1 text-xs shadow-md"
        >
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                role="option"
                aria-selected={locale === lang.code}
                onClick={() => handleSelect(lang.code)}
                className="flex w-full items-center justify-between px-2 py-1 text-left hover:bg-main-soft hover:text-secondary"
              >
                <span>{lang.short}</span>
                <span>{lang.label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
