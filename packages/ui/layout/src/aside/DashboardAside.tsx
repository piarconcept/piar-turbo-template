'use client';

import { useState } from 'react';
import type { AsideConfig, NavigationSection, RouteItem } from '../types';

export interface DashboardAsideProps {
  config: AsideConfig;
  locale?: string;
}

export function DashboardAside({ config, locale: _locale = 'en' }: DashboardAsideProps) {
  const [isCollapsed, setIsCollapsed] = useState(config.defaultCollapsed || false);

  return (
    <aside
      className={`sticky top-16 h-[calc(100vh-4rem)] border-r border-gray-200 bg-white transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Collapse Toggle */}
        {config.collapsible && (
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex h-12 items-center justify-center border-b border-gray-200 hover:bg-gray-50"
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
          </button>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {config.navigation.map((section: NavigationSection, sectionIdx: number) => (
            <div key={sectionIdx} className={sectionIdx > 0 ? 'mt-8' : ''}>
              {section.title && !isCollapsed && (
                <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-1">
                {section.routes.map((route: RouteItem) => (
                  <li key={route.href}>
                    <a
                      href={route.href}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-[var(--color-primary-blue)]"
                      title={isCollapsed ? route.label : undefined}
                    >
                      {route.icon && (
                        <span className="flex h-5 w-5 items-center justify-center">
                          {route.icon}
                        </span>
                      )}
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{route.label}</span>
                          {route.badge && (
                            <span className="rounded-full bg-[var(--color-primary-orange)] px-2 py-0.5 text-xs font-semibold text-white">
                              {route.badge}
                            </span>
                          )}
                        </>
                      )}
                    </a>

                    {/* Nested routes */}
                    {route.children && route.children.length > 0 && !isCollapsed && (
                      <ul className="ml-8 mt-1 space-y-1 border-l border-gray-200 pl-3">
                        {route.children.map((child: RouteItem) => (
                          <li key={child.href}>
                            <a
                              href={child.href}
                              className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-[var(--color-primary-blue)]"
                            >
                              {child.label}
                              {child.badge && (
                                <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-xs font-semibold text-gray-700">
                                  {child.badge}
                                </span>
                              )}
                            </a>
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
              <div className="h-10 w-10 rounded-full bg-[var(--color-primary-orange)]" />
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-gray-900">John Doe</p>
                <p className="truncate text-xs text-gray-500">john@example.com</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
