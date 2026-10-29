'use client';

import { TzarButton, TzarPageHeader, TzarTextField } from '@tzardom-ui/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { auth } from '@/lib/firebase/client';
import { saveSession } from './session';

export const LoginView = () => {
  const t = useTranslations();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!auth) {
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // Lets the server see the login too: pages check it before showing data.
      await saveSession(await credential.user.getIdToken());
      router.push('/overview');
    } catch (err) {
      console.error('Login failed', err);
      setError(t('auth.login.error'));
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
          title={t('auth.login.title')}
          description={t('auth.login.description')}
        />

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border border-border-subtle bg-background p-4 shadow-sm"
          data-testid="login-form"
        >
          <TzarTextField
            data-testid="login-email"
            label={t('auth.login.emailLabel')}
            name="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <TzarTextField
            data-testid="login-password"
            label={t('auth.login.passwordLabel')}
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
              ? t('auth.login.submittingLabel')
              : t('auth.login.submitLabel')}
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
