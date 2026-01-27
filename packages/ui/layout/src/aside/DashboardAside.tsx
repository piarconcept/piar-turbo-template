'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Text } from '@piar/ui-components';
import type { AsideConfig, NavigationSection, RouteItem } from '../types';

export interface DashboardAsideProps {
  config: AsideConfig;
  locale?: string;
}

export function DashboardAside({ config, locale: _locale = 'en' }: DashboardAsideProps) {
  const [isCollapsed, setIsCollapsed] = useState(config.defaultCollapsed || false);
  const widthClass = isCollapsed ? 'w-16' : 'w-64';
  const widthValue = isCollapsed ? '4rem' : '16rem';

  useEffect(() => {
    document.documentElement.style.setProperty('--layout-aside-width', widthValue);
    return () => {
      document.documentElement.style.removeProperty('--layout-aside-width');
    };
  }, [widthValue]);

  return (
    <aside
      className={`fixed top-16 z-40 h-[calc(100vh-4rem)] border-r border-gray-200 bg-white transition-all duration-300 ${widthClass}`}
    >
      <div className="flex h-full flex-col">
        {/* Collapse Toggle */}
        {config.collapsible && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-12 w-full justify-center rounded-none border-b border-gray-200 hover:bg-gray-50"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={`h-5 w-5 text-gray-600 transition-transform ${
                isCollapsed ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Button>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {config.navigation.map((section: NavigationSection, sectionIdx: number) => (
            <div key={sectionIdx} className={sectionIdx > 0 ? 'mt-8' : ''}>
              {section.title && !isCollapsed && (
                <Text
                  as="h3"
                  variant="caption"
                  className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  {section.title}
                </Text>
              )}
              <ul className="space-y-1">
                {section.routes.map((route: RouteItem) => (
                  <li key={route.href}>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      fullWidth
                      className="justify-start px-3 text-gray-700 hover:bg-gray-100 hover:text-[var(--color-secondary)]"
                      title={isCollapsed ? route.label : undefined}
                    >
                      <Link href={route.href} className="flex items-center gap-3">
                        {route.icon && (
                          <span className="flex h-5 w-5 items-center justify-center">
                            {route.icon}
                          </span>
                        )}
                        {!isCollapsed && (
                          <>
                            <Text as="span" variant="label" className="flex-1 text-gray-700">
                              {route.label}
                            </Text>
                            {route.badge && (
                              <span className="rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-xs font-semibold text-white">
                                {route.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    </Button>

                    {/* Nested routes */}
                    {route.children && route.children.length > 0 && !isCollapsed && (
                      <ul className="ml-8 mt-1 space-y-1 border-l border-gray-200 pl-3">
                        {route.children.map((child: RouteItem) => (
                          <li key={child.href}>
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              fullWidth
                              className="justify-start px-3 text-gray-600 hover:bg-gray-100 hover:text-[var(--color-secondary)]"
                            >
                              <Link href={child.href} className="flex items-center gap-2">
                                <Text as="span" variant="bodySmall" className="text-gray-600">
                                  {child.label}
                                </Text>
                                {child.badge && (
                                  <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-xs font-semibold text-gray-700">
                                    {child.badge}
                                  </span>
                                )}
                              </Link>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Info (Bottom) */}
        {!isCollapsed && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[var(--color-primary)]" />
              <div className="flex-1 overflow-hidden">
                <Text as="p" variant="label" className="truncate text-gray-900">
                  John Doe
                </Text>
                <Text as="p" variant="caption" className="truncate text-gray-500">
                  john@example.com
                </Text>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
