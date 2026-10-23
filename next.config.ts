import { existsSync } from 'node:fs';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Next.js only reads .env* files
if (existsSync('local.env')) {
  process.loadEnvFile('local.env');
}

const nextConfig: NextConfig = {};

const withNextIntl = createNextIntlPlugin('./src/shared/i18n/request.ts');

export default withNextIntl(nextConfig);
