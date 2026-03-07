import React from 'react';
import { HeaderDispatcher } from '../header';
import { AsideDispatcher } from '../aside';
import { FooterDispatcher } from '../footer';
import { LayoutProvider } from '../context/LayoutContext';
import { Breadcrumbs } from '../breadcrumbs';
import type { HeaderConfig, AsideConfig, FooterConfig } from '../types';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  headerConfig: HeaderConfig;
  asideConfig: AsideConfig;
  footerConfig: FooterConfig;
  locale?: string;
}

/**
 * DashboardLayout - Professional layout for dashboard/admin pages
 * Structure: Fixed Header + Fixed Sidebar + Scrollable Main Content + Footer
 *
 * Features:
 * - Fixed header at top (h-16)
 * - Fixed sidebar on left (collapsible on desktop, overlay on mobile)
 * - Main content area with proper scrolling
 * - Footer at bottom of content
 * - Responsive design with burger menu on mobile
 * - Centralized state management via LayoutContext
 */
export function DashboardLayout({
  children,
  headerConfig,
  asideConfig,
  footerConfig,
  locale = 'en',
}: DashboardLayoutProps) {
  return (
    <LayoutProvider>
      <div className="relative h-dvh min-h-[100svh] overflow-hidden bg-gray-50 pt-16">
        {/* Fixed Header - Always visible at top */}
        <HeaderDispatcher config={headerConfig} layoutType="dashboard" locale={locale} />

        {/* Main Container - Below header */}
        <div className="flex h-full min-w-0">
          {/* Fixed Sidebar - Scrollable if content overflows */}
          <AsideDispatcher config={asideConfig} layoutType="dashboard" locale={locale} />

          {/* Main Content Area - Scrollable, takes remaining space */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col transition-all duration-300 lg:pl-[var(--layout-aside-width,16rem)]">
            {/* Main Content */}
            <main className="flex-1 overflow-x-auto overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-7xl min-w-0">
                <Breadcrumbs asideConfig={asideConfig} locale={locale} />
                {children}
              </div>
            </main>

            {/* Footer - At bottom of content */}
            <FooterDispatcher config={footerConfig} layoutType="dashboard" locale={locale} />
          </div>
        </div>
      </div>
    </LayoutProvider>
  );
}
