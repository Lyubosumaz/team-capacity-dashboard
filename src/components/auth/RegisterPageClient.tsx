"use client";

import type { FC, FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useLocalization } from "@/providers/LocalizationProvider";
import { TzarButton, TzarPageHeader, TzarTextField } from "@tzardom-ui/react";
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
      await createUserWithEmailAndPassword(auth!, email, password);
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
          data-testid="register-header"
          title={t("auth.register.title")}
          description={t("auth.register.description")}
        />

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border border-border-subtle bg-background p-4 shadow-sm"
          data-testid="register-form"
        >
          <TzarTextField
            data-testid="register-email"
            label={t("auth.register.emailLabel")}
            name="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <TzarTextField
            data-testid="register-password"
            label={t("auth.register.passwordLabel")}
            name="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <TzarTextField
            data-testid="register-confirm-password"
            label={t("auth.register.confirmPasswordLabel")}
            name="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

          {error ? (
            <p className="text-xs text-danger" data-testid="register-error">
              {error}
            </p>
          ) : null}

          <TzarButton
            data-testid="register-submit"
            variant="primary"
            size="md"
            className="w-full"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t("auth.register.submittingLabel")
              : t("auth.register.submitLabel")}
          </TzarButton>
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
