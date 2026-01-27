import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
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
