import { PublicFooter } from './PublicFooter';
import { DashboardFooter } from './DashboardFooter';
import type { FooterDispatcherProps } from '../types';

/**
 * FooterDispatcher - Selects which footer to render based on layout type
 */
export function FooterDispatcher({ config, layoutType, locale }: FooterDispatcherProps) {
  switch (layoutType) {
    case 'public':
      return <PublicFooter config={config} locale={locale} />;
    case 'dashboard':
      return <DashboardFooter config={config} locale={locale} />;
    default:
      return <PublicFooter config={config} locale={locale} />;
  }
}
