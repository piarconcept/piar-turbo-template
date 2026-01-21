'use client';

import { DashboardAside } from './DashboardAside';
import type { AsideDispatcherProps } from '../types';

/**
 * AsideDispatcher - Renders aside only for dashboard layout
 */
export function AsideDispatcher({ config, layoutType, locale }: AsideDispatcherProps) {
  if (layoutType === 'dashboard' && config) {
    return <DashboardAside config={config} locale={locale} />;
  }

  return null;
}
