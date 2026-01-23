import { type ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Layout, dashboardHeaderConfig, dashboardAsideConfig, dashboardFooterConfig, AsideConfig } from '@piar/layout';
import { Home } from 'lucide-react';
import { auth } from '@/auth';

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
 * Only accessible to users with admin role
 */
export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  // Verify user has admin role (double-check server-side)
  if (!session || session.user?.role !== 'admin') {
    redirect(`/${locale}/unauthorized`);
  }

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
