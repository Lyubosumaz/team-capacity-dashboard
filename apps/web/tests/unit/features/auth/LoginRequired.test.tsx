import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useAuth } from '@/features/auth/AuthProvider';
import { LoginRequired } from '@/features/auth/LoginRequired';

vi.mock('@/features/auth/AuthProvider', () => ({ useAuth: vi.fn() }));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// Pretends the browser is (or isn't) still checking its login.
const renderWhileLoading = (loading: boolean) => {
  vi.mocked(useAuth).mockReturnValue({ user: null, loading, logout: vi.fn() });
  render(<LoginRequired />);
};

describe('LoginRequired', () => {
  it('waits while the browser checks its login', () => {
    renderWhileLoading(true);

    expect(screen.getByText('Checking your login…')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Log in to continue' }),
    ).toBeNull();
  });

  it('asks the visitor to log in', () => {
    renderWhileLoading(false);

    expect(
      screen.getByRole('heading', { name: 'You need to log in' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/log in with your work email to see this page\./i),
    ).toBeInTheDocument();
  });

  it('links to the login page', () => {
    renderWhileLoading(false);

    expect(
      screen.getByRole('link', { name: 'Log in to continue' }),
    ).toHaveAttribute('href', '/login');
  });

  it('links to sign up for people without an account', () => {
    renderWhileLoading(false);

    expect(screen.getByRole('link', { name: 'Sign up' })).toHaveAttribute(
      'href',
      '/register',
    );
  });
});
