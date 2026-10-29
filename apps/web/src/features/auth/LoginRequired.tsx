'use client';

import { TzarCommonLink } from '@tzardom-ui/react';
import { LockKeyhole } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';

// Shown instead of a page with data when nobody is logged in.
// The text is the same on every page, so the card always looks the same.
export const LoginRequired = () => {
  const { loading } = useAuth();

  // The browser may still be sharing an existing login with the server.
  // When it does, the page reloads with the data by itself.
  if (loading) {
    return (
      <section
        data-testid="login-required-checking"
        className="flex w-full flex-1 items-center justify-center py-16 text-sm text-muted"
      >
        Checking your login…
      </section>
    );
  }

  return (
    <section
      data-testid="login-required"
      className="flex w-full flex-1 items-center justify-center py-16"
    >
      <div className="w-full max-w-sm rounded-xl border border-border-subtle bg-background p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
          <LockKeyhole className="h-7 w-7" aria-hidden="true" />
        </div>

        <h1 className="mt-5 text-xl font-semibold tracking-tight">
          You need to log in
        </h1>
        <p className="mt-3 text-sm text-muted">
          Log in with your work email to see this page. The dashboard shows
          your teams&apos; capacity, workload and delivery risks, so it&apos;s
          only open to signed-in members.
        </p>

        <TzarCommonLink
          as={Link}
          href="/login"
          variant="primary"
          className="mt-6 w-full py-2"
        >
          Log in to continue
        </TzarCommonLink>

        <p className="mt-4 text-xs text-muted">
          <span className="mr-1">No account yet?</span>
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
