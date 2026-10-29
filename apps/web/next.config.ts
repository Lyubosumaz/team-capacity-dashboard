import { existsSync } from 'node:fs';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

if (existsSync('local.env')) {
  process.loadEnvFile('local.env');
}

const nextConfig: NextConfig = {
  redirects: async () => [
    { source: '/', destination: '/overview', permanent: false },
  ],
};

const withNextIntl = createNextIntlPlugin('./src/shared/i18n/request.ts');

export default withNextIntl(nextConfig);
