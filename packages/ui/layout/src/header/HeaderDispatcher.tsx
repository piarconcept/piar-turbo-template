import { PublicHeader } from './PublicHeader';
import { DashboardHeader } from './DashboardHeader';
import type { HeaderDispatcherProps } from '../types';

/**
 * HeaderDispatcher - Selects which header to render based on layout type
 */
export function HeaderDispatcher({ config, layoutType, locale }: HeaderDispatcherProps) {
  switch (layoutType) {
    case 'public':
      return <PublicHeader config={config} locale={locale} />;
    case 'dashboard':
      return <DashboardHeader config={config} locale={locale} />;
    default:
      return <PublicHeader config={config} locale={locale} />;
  }
}
