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
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '@/features/auth/AuthProvider';
import type { CurrentUser } from '@/features/auth/currentUser';
import { setLocale } from '@/shared/i18n/actions';
import type { Locale } from '@/shared/i18n/messages/types';

const NAV_ITEMS = [
  { href: '/overview', labelKey: 'header.nav.overview', name: 'overview' },
  { href: '/risk', labelKey: 'header.nav.risk', name: 'risk' },
  { href: '/teams', labelKey: 'header.nav.teams', name: 'teams' },
];

const LANGUAGES: TzarLanguage<Locale>[] = [
  { code: 'en', short: 'EN', label: 'English' },
  { code: 'bg', short: 'BG', label: 'Bulgarian' },
  { code: 'ka', short: 'KA', label: 'Georgian' },
];

type AppHeaderProps = {
  // From the server's session check; null when nobody is logged in.
  user: CurrentUser | null;
};

export const AppHeader = ({ user }: AppHeaderProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const { logout } = useAuth();

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
            {user && (
              <div className="hidden lg:block">{renderNav('header')}</div>
            )}
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
          {user && renderNav('mobile')}
          <div className="ml-auto flex items-center gap-2">
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
