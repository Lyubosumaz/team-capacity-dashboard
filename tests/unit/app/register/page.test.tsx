import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Pretend Firebase is configured (firebase/auth is mocked in vitest.setup.ts).
vi.mock('@/lib/firebase/config', () => ({
  isFirebaseConfigured: true,
  firebaseConfig: {},
}));

// The server actions only save or remove a cookie; tests don't need them.
vi.mock('@/features/auth/session', () => ({
  saveSession: vi.fn(),
  deleteSession: vi.fn(),
}));

import { TestProviders } from '@tests/TestProviders';
import RegisterPage from '@/app/register/page';

describe('Register page', () => {
  it('renders register heading and form', () => {
    render(
      <TestProviders>
        <RegisterPage />
      </TestProviders>,
    );

    expect(screen.getByTestId('register-page')).toBeInTheDocument();
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
    expect(screen.getByTestId('register-submit')).toHaveAttribute(
      'type',
      'submit',
    );
    expect(screen.getByTestId('register-submit')).toHaveTextContent('Sign up');
    expect(screen.getByTestId('register-email')).toHaveAccessibleName(
      'Work email',
    );
    expect(screen.getByTestId('register-password')).toHaveAccessibleName(
      'Password',
    );
    expect(
      screen.getByTestId('register-confirm-password'),
    ).toHaveAccessibleName('Confirm password');
  });
});
