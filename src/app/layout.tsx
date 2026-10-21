import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import type { ReactNode } from 'react';
import { AppFooter } from '@/shared/layout/AppFooter';
import { AppHeader } from '@/shared/layout/AppHeader';
import { Providers } from '@/shared/providers/Providers';
import '@/styles/globals.css';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Team Capacity Dashboard',
  description:
    'Team capacity dashboard built with Next.js 16, React 19, TypeScript, Tailwind CSS, React Query, Recharts, Vitest, and Cypress.',
  icons: {
    icon: '/favicon.ico',
  },
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <Providers>
          <AppHeader />
          <main
            className="mx-auto flex w-full max-w-5xl flex-1 px-4 pb-8 pt-6 md:px-6"
            data-testid="main-content"
          >
            {children}
          </main>
          <AppFooter />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
