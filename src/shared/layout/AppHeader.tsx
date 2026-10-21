'use client';

import {
  TzarBrand,
  TzarCommonLink,
  type TzarLanguage,
  TzarLanguageSelect,
  TzarThemeToggle,
  TzarUserMenu,
} from '@tzardom-ui/react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/AuthProvider';
import { useLocalization } from '@/shared/i18n/LocalizationProvider';
import type { Locale } from '@/shared/i18n/messages';

const NAV_ITEMS = [
  { href: '/', labelKey: 'header.nav.overview', name: 'overview' },
  { href: '/risk', labelKey: 'header.nav.risk', name: 'risk' },
  { href: '/teams', labelKey: 'header.nav.teams', name: 'teams' },
];

const LANGUAGES: TzarLanguage<Locale>[] = [
  { code: 'en', short: 'EN', label: 'English' },
  { code: 'bg', short: 'BG', label: 'Bulgarian' },
  { code: 'ka', short: 'KA', label: 'Georgian' },
];

export const AppHeader = () => {
  const { t, locale, setLocale } = useLocalization();
  const { user, logout } = useAuth();

  const renderNav = (area: string) => (
    <nav
      className="flex gap-3 text-sm font-medium"
      aria-label="Primary navigation"
      data-testid={`${area}-nav`}
    >
      {NAV_ITEMS.map((item) => (
        <TzarCommonLink
          key={item.href}
          as={Link}
          href={item.href}
          variant="ghost"
          data-testid={`${area}-nav-${item.name}-link`}
        >
          {t(item.labelKey)}
        </TzarCommonLink>
      ))}
    </nav>
  );

  return (
    <>
      <header
        className="border-b border-border-subtle bg-accent-soft backdrop-blur shadow-sm"
        data-testid="app-header"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
          <TzarBrand
            data-testid="header-brand"
            title={t('header.title')}
            subtitle={t('header.subtitle')}
          />

          <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
            <div className="hidden lg:block">{renderNav('header')}</div>
            <div className="flex items-center gap-2">
              <TzarThemeToggle data-testid="header-theme-toggle" />
              <TzarLanguageSelect
                data-testid="header-language-select"
                languages={LANGUAGES}
                value={locale}
                onChange={setLocale}
              />
              <div className="hidden lg:block">
                {!user && (
                  <TzarCommonLink
                    as={Link}
                    href="/login"
                    data-testid="header-login-link"
                  >
                    {t('header.login')}
                  </TzarCommonLink>
                )}
                {user?.email && (
                  <TzarUserMenu
                    data-testid="header-user-menu"
                    email={user.email}
                    accountHref="/user"
                    linkAs={Link}
                    onLogout={logout}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <div
        className="border-b border-border-subtle bg-accent-soft/60 shadow-sm lg:hidden"
        data-testid="mobile-header"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between py-2 px-6 gap-3">
          {renderNav('mobile')}
          <div className="flex items-center gap-2">
            {!user && (
              <TzarCommonLink
                as={Link}
                href="/login"
                data-testid="mobile-login-link"
              >
                {t('header.login')}
              </TzarCommonLink>
            )}
            {user?.email && (
              <TzarUserMenu
                data-testid="mobile-user-menu"
                email={user.email}
                accountHref="/user"
                linkAs={Link}
                onLogout={logout}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
