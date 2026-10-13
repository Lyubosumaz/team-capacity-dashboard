"use client";

import type { FC, FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useLocalization } from "@/providers/LocalizationProvider";
import { TzarPageHeader } from "@tzardom-ui/react";
import { auth } from "@/lib/firebase/client";

export const LoginPageClient: FC = () => {
  const { t } = useLocalization();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth!, email, password); // page.tsx only renders this when Firebase is configured
      router.push("/");
    } catch (err) {
      console.error("Login failed", err);
      setError(t("auth.login.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="flex w-full flex-col gap-6 items-center justify-center py-10"
      data-testid="login-page"
    >
      <div className="w-full max-w-sm">
        <TzarPageHeader
          data-testid="login"
          title={t("auth.login.title")}
          description={t("auth.login.description")}
        />

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border border-border-subtle bg-background p-4 shadow-sm"
          data-testid="login-form"
        >
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-xs font-medium uppercase tracking-wide opacity-70"
            >
              {t("auth.login.emailLabel")}
            </label>
            <input
              id="email"
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
              htmlFor="password"
              className="block text-xs font-medium uppercase tracking-wide opacity-70"
            >
              {t("auth.login.passwordLabel")}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-border-subtle bg-background px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>

          {error ? (
            <p className="text-xs text-danger" data-testid="login-error">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-secondary-soft hover:bg-accent/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            disabled={isSubmitting}
            data-testid="login-submit"
          >
            {isSubmitting
              ? t("auth.login.submittingLabel")
              : t("auth.login.submitLabel")}
          </button>
        </form>

        <p className="mt-3 text-xs text-muted text-center">
          <span className="mr-1">Don&apos;t have an account?</span>
          <Link
            href="/register"
            className="font-medium text-accent hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
};
