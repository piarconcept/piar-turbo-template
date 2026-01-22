import { type ReactNode } from 'react';
import { Layout, publicHeaderConfig, publicFooterConfig } from '@piar/layout';

/**
 * Auth Layout - Uses public layout for authentication pages
 * This maintains visual consistency with the main website
 */
export default async function AuthLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <Layout
      config={{
        type: 'public',
        header: publicHeaderConfig,
        footer: publicFooterConfig,
      }}
      locale={locale}
    >
      {children}
    </Layout>
  );
}
