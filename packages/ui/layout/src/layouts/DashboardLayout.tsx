import React from 'react';
import { HeaderDispatcher } from '../header';
import { AsideDispatcher } from '../aside';
import { FooterDispatcher } from '../footer';
import type { HeaderConfig, AsideConfig, FooterConfig } from '../types';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  headerConfig: HeaderConfig;
  asideConfig: AsideConfig;
  footerConfig: FooterConfig;
  locale?: string;
}

/**
 * DashboardLayout - Layout for dashboard/admin pages
 * Structure: Header + (Aside + Main Content) + Footer
 */
export function DashboardLayout({
  children,
  headerConfig,
  asideConfig,
  footerConfig,
  locale = 'en',
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderDispatcher config={headerConfig} layoutType="dashboard" locale={locale} />

      <div className="flex pt-16">
        <AsideDispatcher config={asideConfig} layoutType="dashboard" locale={locale} />

        <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col pl-[var(--layout-aside-width,16rem)]">
          <main className="flex-1 px-6 py-6">{children}</main>
          <FooterDispatcher config={footerConfig} layoutType="dashboard" locale={locale} />
        </div>
      </div>
    </div>
  );
}
