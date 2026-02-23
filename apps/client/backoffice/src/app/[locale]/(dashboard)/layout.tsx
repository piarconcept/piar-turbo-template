import { type ReactNode } from 'react';
import { redirect } from 'next/navigation';
import {
  Layout,
  dashboardHeaderConfig,
  dashboardAsideConfig,
  dashboardFooterConfig,
  AsideConfig,
} from '@piar/layout';
import { FileText, LayoutDashboard, Mail, Puzzle, User } from 'lucide-react';
import { getTranslations } from '@piar/messages';
import { auth } from '@/auth';

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

  const messages = getTranslations(locale);
  const t = messages.dashboard.nav;
  const dashboardNav: AsideConfig = {
    ...dashboardAsideConfig,
    navigation: [
      {
        title: 'Dashboard',
        routes: [
          {
            label: t.dashboard,
            href: `/${locale}/dashboard`,
            icon: <LayoutDashboard />,
          },
          {
            label: t.modules,
            href: `/${locale}/modules`,
            icon: <Puzzle />,
          },
        ],
      },
      {
        title: 'Management',
        routes: [
          {
            label: t.accounts,
            href: `/${locale}/accounts`,
            icon: <User />,
          },
          {
            label: t.contactSubmissions,
            href: `/${locale}/contact-submissions`,
            icon: <Mail />,
          },
          {
            label: t.dynamicPages,
            href: `/${locale}/dynamic-pages`,
            icon: <FileText />,
          },
        ],
      },
    ],
  };

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
