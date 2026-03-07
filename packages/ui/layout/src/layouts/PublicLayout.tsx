import React from 'react';
import { HeaderDispatcher } from '../header';
import { FooterDispatcher } from '../footer';
import type { HeaderConfig, FooterConfig } from '../types';

export interface PublicLayoutProps {
  children: React.ReactNode;
  headerConfig: HeaderConfig;
  footerConfig: FooterConfig;
  locale?: string;
}

/**
 * PublicLayout - Layout for public-facing pages
 * Structure: Header + Main Content + Footer
 */
export function PublicLayout({
  children,
  headerConfig,
  footerConfig,
  locale = 'en',
}: PublicLayoutProps) {
  return (
    <div className="flex min-h-dvh min-w-0 flex-col overflow-x-hidden">
      <HeaderDispatcher config={headerConfig} layoutType="public" locale={locale} />

      <main className="flex-1 min-w-0 pt-16">{children}</main>

      <FooterDispatcher config={footerConfig} layoutType="public" locale={locale} />
    </div>
  );
}
