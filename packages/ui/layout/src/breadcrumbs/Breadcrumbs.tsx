'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Text } from '@piar/ui-components';
import type { AsideConfig } from '../types';

function humanizeSegment(seg: string) {
  if (!seg) return seg;
  const map: Record<string, string> = {
    new: 'New',
    edit: 'Edit',
  };
  if (map[seg]) return map[seg];

  return seg
    .split('-')
    .map((s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s))
    .join(' ');
}

function buildLabelLookup(asideConfig: AsideConfig) {
  const lookup = new Map<string, string>();

  for (const group of asideConfig.navigation ?? []) {
    for (const route of group.routes ?? []) {
      if (route.href && route.label) lookup.set(route.href, route.label);
    }
  }

  return lookup;
}

export interface BreadcrumbsProps {
  asideConfig: AsideConfig;
  locale?: string;
}

/**
 * Breadcrumbs for dashboard pages.
 *
 * - Uses asideConfig href/label for primary sections (clients, products, etc.)
 * - Falls back to humanized URL segments for deeper routes (e.g. /new)
 */
export function Breadcrumbs({ asideConfig, locale = 'en' }: BreadcrumbsProps) {
  const pathname = usePathname() || '';
  const labelLookup = buildLabelLookup(asideConfig);

  const segments = pathname.split('/').filter(Boolean);

  // Remove locale prefix if present
  const rest = segments[0] === locale ? segments.slice(1) : segments;

  // Nothing to show on dashboard root
  if (rest.length <= 0) return null;

  if (rest[0] === 'dashboard') {
    // If we're on the dashboard root, don't show breadcrumbs
    if (rest.length === 1) return null;
    // Remove 'dashboard' segment for breadcrumb construction
    rest.shift();
  }

  const crumbs: Array<{ href: string; label: string; current?: boolean }> = [];

  // Always include dashboard as the base (translated via aside config when present)
  const dashboardHref = `/${locale}/dashboard`;
  crumbs.push({
    href: dashboardHref,
    label: labelLookup.get(dashboardHref) ?? 'Dashboard',
  });

  let acc = `/${locale}`;
  for (const seg of rest) {
    acc += `/${seg}`;

    // Skip adding duplicate dashboard crumb
    if (acc === dashboardHref) continue;

    const label = labelLookup.get(acc) ?? humanizeSegment(seg);
    crumbs.push({ href: acc, label });
  }

  // Mark last as current
  if (crumbs.length) {
    const last = crumbs[crumbs.length - 1];
    if (last) last.current = true;
  }

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
        {crumbs.map((c, idx) => (
          <li key={c.href} className="flex items-center gap-2">
            {idx > 0 && <span className="text-gray-300">/</span>}
            {c.current ? (
              <Text as="span" variant="body" className="text-gray-900 font-medium">
                {c.label}
              </Text>
            ) : (
              <Link href={c.href} className="hover:text-gray-900">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
