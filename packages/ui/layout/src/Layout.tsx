'use client';

import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import type { LayoutProps } from './types';

/**
 * Layout - Main layout component that dispatches to the correct layout type
 * 
 * @example
 * // Using with predefined configs
 * import { Layout, publicHeaderConfig, publicFooterConfig } from '@piar/layout';
 * 
 * function App() {
 *   return (
 *     <Layout
 *       config={{
 *         type: 'public',
 *         header: publicHeaderConfig,
 *         footer: publicFooterConfig
 *       }}
 *       locale="en"
 *     >
 *       <YourContent />
 *     </Layout>
 *   );
 * }
 * 
 * @example
 * // Dashboard layout
 * import { Layout, dashboardHeaderConfig, dashboardAsideConfig, dashboardFooterConfig } from '@piar/layout';
 * 
 * function Dashboard() {
 *   return (
 *     <Layout
 *       config={{
 *         type: 'dashboard',
 *         header: dashboardHeaderConfig,
 *         aside: dashboardAsideConfig,
 *         footer: dashboardFooterConfig
 *       }}
 *       locale="en"
 *     >
 *       <DashboardContent />
 *     </Layout>
 *   );
 * }
 */
export function Layout({ children, config, locale }: LayoutProps) {
  if (config.type === 'dashboard') {
    if (!config.aside) {
      throw new Error('Dashboard layout requires an aside configuration');
    }

    return (
      <DashboardLayout
        headerConfig={config.header}
        asideConfig={config.aside}
        footerConfig={config.footer}
        locale={locale}
      >
        {children}
      </DashboardLayout>
    );
  }

  // Default to public layout
  return (
    <PublicLayout
      headerConfig={config.header}
      footerConfig={config.footer}
      locale={locale}
    >
      {children}
    </PublicLayout>
  );
}

export default Layout;
