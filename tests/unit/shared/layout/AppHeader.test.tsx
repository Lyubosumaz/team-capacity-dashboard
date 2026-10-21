import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppHeader } from '@/shared/layout/AppHeader';
import { Providers } from '@/shared/providers/Providers';

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const renderHeader = () =>
  render(
    <Providers>
      <AppHeader />
    </Providers>,
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
    renderHeader();

    for (const area of ['header', 'mobile']) {
      expect(screen.getByTestId(`${area}-nav-overview-link`)).toHaveAttribute(
        'href',
        '/',
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

  it('shows the current language and switches it', () => {
    renderHeader();
    const languageSelect = within(screen.getByTestId('header-language-select'));
    const trigger = languageSelect.getByRole('button', { name: /^language/i });

    expect(trigger).toHaveAccessibleName('Language: EN');

    fireEvent.click(trigger);
    fireEvent.click(languageSelect.getByRole('button', { name: /bulgarian/i }));

    expect(trigger).toHaveAccessibleName('Language: BG');
  });
});
