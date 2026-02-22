import { type ReactNode } from 'react';
import { redirect } from 'next/navigation';
import {
  Layout,
  dashboardHeaderConfig,
  dashboardAsideConfig,
  dashboardFooterConfig,
  AsideConfig,
} from '@piar/layout';
import { Home, Puzzle } from 'lucide-react';
import { auth } from '@/auth';

const createDashboardNav = (locale: string): AsideConfig => ({
  ...dashboardAsideConfig,
  navigation: [
    {
      title: 'Main',
      routes: [
        {
          label: 'Dashboard',
          href: `/${locale}/dashboard`,
          icon: <Home />,
        },
        {
          label: 'Modules',
          href: `/${locale}/modules`,
          icon: <Puzzle />,
        },
      ],
    },
  ],
});

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
        aside: createDashboardNav(locale),
        footer: dashboardFooterConfig,
      }}
      locale={locale}
    >
      {children}
    </Layout>
  );
}
