import { type ReactNode } from 'react';
import { Layout, dashboardHeaderConfig, dashboardAsideConfig, dashboardFooterConfig, AsideConfig } from '@piar/layout';
import { Home } from 'lucide-react';

// Extend dashboard aside config with minimal navigation
const dashboardNav: AsideConfig = {
  ...dashboardAsideConfig,
  navigation: [
    {
      title: 'Main',
      routes: [
        {
          label: 'Dashboard',
          href: '/dashboard',
          icon: <Home />,
        },
      ],
    },
  ],
};

/**
 * Dashboard Layout - Private area with sidebar navigation
 * Used for authenticated backoffice pages
 */
export default async function DashboardLayout({
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
        type: 'dashboard',
        header: dashboardHeaderConfig,
        aside: dashboardNav,
        footer: dashboardFooterConfig,
      }}
      locale={locale}
    >
      {children}
    </Layout>
  );
}
