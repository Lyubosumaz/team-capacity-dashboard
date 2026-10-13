"use client";

import type { FC, FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useLocalization } from "@/providers/LocalizationProvider";
import { TzarPageHeader } from "@tzardom-ui/react";
import { auth } from "@/lib/firebase/client";

export const RegisterPageClient: FC = () => {
  const { t } = useLocalization();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t("auth.register.error"));
      return;
    }

    setIsSubmitting(true);

    try {
      await createUserWithEmailAndPassword(auth!, email, password); // page.tsx only renders this when Firebase is configured
      router.push("/");
    } catch (err) {
      console.error("Registration failed", err);
      setError(t("auth.register.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="flex w-full flex-col gap-6 items-center justify-center py-10"
      data-testid="register-page"
    >
      <div className="w-full max-w-sm">
        <TzarPageHeader
          data-testid="register"
          title={t("auth.register.title")}
          description={t("auth.register.description")}
        />

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border border-border-subtle bg-background p-4 shadow-sm"
          data-testid="register-form"
        >
          <div className="space-y-1">
            <label
              htmlFor="register-email"
              className="block text-xs font-medium uppercase tracking-wide opacity-70"
            >
              {t("auth.register.emailLabel")}
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-border-subtle bg-background px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="register-password"
              className="block text-xs font-medium uppercase tracking-wide opacity-70"
            >
              {t("auth.register.passwordLabel")}
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-border-subtle bg-background px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="register-confirm-password"
              className="block text-xs font-medium uppercase tracking-wide opacity-70"
            >
              {t("auth.register.confirmPasswordLabel")}
            </label>
            <input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-md border border-border-subtle bg-background px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>

          {error ? (
            <p className="text-xs text-danger" data-testid="register-error">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-secondary-soft hover:bg-accent/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            disabled={isSubmitting}
            data-testid="register-submit"
          >
            {isSubmitting
              ? t("auth.register.submittingLabel")
              : t("auth.register.submitLabel")}
          </button>
        </form>

        <p className="mt-3 text-xs text-muted text-center">
          <span className="mr-1">Already have an account?</span>
          <Link
            href="/login"
            className="font-medium text-accent hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
};
