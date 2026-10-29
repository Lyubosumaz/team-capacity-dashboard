import { fireEvent, render, screen, within } from '@testing-library/react';
import { TestProviders } from '@tests/TestProviders';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CurrentUser } from '@/features/auth/currentUser';
import { setLocale } from '@/shared/i18n/actions';
import { AppHeader } from '@/shared/layout/AppHeader';

// The server action only saves a cookie; check that the header calls it.
vi.mock('@/shared/i18n/actions', () => ({ setLocale: vi.fn() }));

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const LOGGED_IN: CurrentUser = {
  uid: 'user-1',
  email: 'ana@example.com',
};

const renderHeader = (user: CurrentUser | null = null) =>
  render(
    <TestProviders>
      <AppHeader user={user} />
    </TestProviders>,
  );

describe('AppHeader', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows the brand's title and subtitle", () => {
    renderHeader();
    const brand = screen.getByTestId('header-brand');

    expect(brand).toHaveTextContent(/team capacity dashboard/i);
    expect(brand).toHaveTextContent(
      /plan capacity, workload, and delivery risk/i,
    );
  });

  it('links to the three primary pages in both navs', () => {
    renderHeader(LOGGED_IN);

    for (const area of ['header', 'mobile']) {
      expect(screen.getByTestId(`${area}-nav-overview-link`)).toHaveAttribute(
        'href',
        '/overview',
      );
      expect(screen.getByTestId(`${area}-nav-risk-link`)).toHaveAttribute(
        'href',
        '/risk',
      );
      expect(screen.getByTestId(`${area}-nav-teams-link`)).toHaveAttribute(
        'href',
        '/teams',
      );
    }
    expect(screen.getByTestId('header-nav-overview-link')).toHaveTextContent(
      /overview/i,
    );
  });

  it('hides the menu when logged out', () => {
    renderHeader();

    expect(screen.queryByTestId('header-nav')).toBeNull();
    expect(screen.queryByTestId('mobile-nav')).toBeNull();
  });

  it('shows the user menu and no login links when logged in', () => {
    renderHeader(LOGGED_IN);

    expect(screen.getByTestId('header-user-menu')).toBeInTheDocument();
    expect(screen.queryByTestId('header-login-link')).toBeNull();
    expect(screen.queryByTestId('mobile-login-link')).toBeNull();
  });

  it('shows the login links and no user menu when logged out', () => {
    renderHeader();

    for (const id of ['header-login-link', 'mobile-login-link']) {
      const link = screen.getByTestId(id);
      expect(link).toHaveAttribute('href', '/login');
      expect(link).toHaveTextContent(/log in/i);
    }
    expect(screen.queryByTestId('header-user-menu')).toBeNull();
    expect(screen.queryByTestId('mobile-user-menu')).toBeNull();
  });

  it('switches the page to dark with the theme toggle', () => {
    renderHeader();

    fireEvent.click(screen.getByTestId('header-theme-toggle'));

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('shows the current language and saves the picked one', () => {
    renderHeader();
    const languageSelect = within(screen.getByTestId('header-language-select'));
    const trigger = languageSelect.getByRole('button', { name: /^language/i });

    expect(trigger).toHaveAccessibleName('Language: EN');

    fireEvent.click(trigger);
    fireEvent.click(languageSelect.getByRole('button', { name: /bulgarian/i }));

    expect(setLocale).toHaveBeenCalledWith('bg');
  });
});
