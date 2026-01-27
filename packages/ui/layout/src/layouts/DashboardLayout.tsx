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
    <div className="flex min-h-screen flex-col">
      <HeaderDispatcher config={headerConfig} layoutType="dashboard" locale={locale} />

      <div className="flex flex-1">
        <AsideDispatcher config={asideConfig} layoutType="dashboard" locale={locale} />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
      </div>

      <FooterDispatcher config={footerConfig} layoutType="dashboard" locale={locale} />
    </div>
  );
}
