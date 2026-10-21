import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import RootLayout from '@/app/layout';

vi.mock('@/shared/layout/AppHeader', () => ({
  AppHeader: () => <header>mock-header</header>,
}));

vi.mock('@/shared/layout/AppFooter', () => ({
  AppFooter: () => <footer>mock-footer</footer>,
}));

vi.mock('@/shared/providers/Providers', () => ({
  Providers: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('RootLayout', () => {
  it('renders header, main content, and footer', () => {
    const htmlString = renderToStaticMarkup(
      <RootLayout>
        <div>page-content</div>
      </RootLayout>,
    );

    expect(htmlString).toContain('mock-header');
    expect(htmlString).toContain('page-content');
    expect(htmlString).toContain('mock-footer');
    expect(htmlString).toContain('data-testid="main-content"');
    expect(htmlString).toContain('lang="en"');
  });
});
