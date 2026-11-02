import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import headers from './src/app/headers';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  headers,
  reactStrictMode: true,
  transpilePackages: [
    '@piar/layout',
    '@piar/messages',
    '@piar/coming-soon',
    '@piar/health-client',
    '@piar/health-configuration',
    '@piar/domain-fields',
    '@piar/domain-models',
    '@piar/ui-config',
    '@piar/ui-components',
  ],
};

export default withNextIntl(nextConfig);
