"use client";

import type { FC, FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useLocalization } from "@/providers/LocalizationProvider";
import { TzarButton, TzarPageHeader, TzarTextField } from "@tzardom-ui/react";
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
      await signInWithEmailAndPassword(auth!, email, password);
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
          data-testid="login-header"
          title={t("auth.login.title")}
          description={t("auth.login.description")}
        />

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border border-border-subtle bg-background p-4 shadow-sm"
          data-testid="login-form"
        >
          <TzarTextField
            data-testid="login-email"
            label={t("auth.login.emailLabel")}
            name="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <TzarTextField
            data-testid="login-password"
            label={t("auth.login.passwordLabel")}
            name="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {error ? (
            <p className="text-xs text-danger" data-testid="login-error">
              {error}
            </p>
          ) : null}

          <TzarButton
            data-testid="login-submit"
            variant="primary"
            size="md"
            className="w-full"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t("auth.login.submittingLabel")
              : t("auth.login.submitLabel")}
          </TzarButton>
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
