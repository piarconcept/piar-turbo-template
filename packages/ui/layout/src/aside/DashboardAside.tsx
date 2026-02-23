'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Text } from '@piar/ui-components';
import { useLayout } from '../context/LayoutContext';
import type { AsideConfig, NavigationSection, RouteItem } from '../types';

export interface DashboardAsideProps {
  config: AsideConfig;
  locale?: string;
}

/**
 * DashboardAside - Professional sidebar navigation for dashboard
 *
 * Features:
 * - Fixed position sidebar (desktop), overlay (mobile)
 * - Collapsible with smooth transitions controlled from header
 * - Active route highlighting
 * - Nested navigation support
 * - Scrollable navigation area
 * - Click outside to close on mobile
 */
export function DashboardAside({ config, locale: _locale = 'en' }: DashboardAsideProps) {
  const pathname = usePathname();
  const { isSidebarOpen, isSidebarCollapsed, closeSidebar } = useLayout();

  const widthClass = isSidebarCollapsed ? 'w-16' : 'w-64';
  const widthValue = isSidebarCollapsed ? '4rem' : '16rem';

  // Update CSS variable for main content padding (desktop only)
  useEffect(() => {
    document.documentElement.style.setProperty('--layout-aside-width', widthValue);
    return () => {
      document.documentElement.style.removeProperty('--layout-aside-width');
    };
  }, [widthValue]);

  // Check if route is active
  const isActiveRoute = (href: string) => {
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  // Close sidebar when route changes on mobile
  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  return (
    <>
      {/* Overlay - Mobile only */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] border-r border-gray-200 bg-white shadow-lg transition-all duration-300
          lg:z-40 lg:shadow-sm
          ${widthClass}
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Navigation - Scrollable */}
          <nav className="flex-1 overflow-y-auto p-3">
            {config.navigation.map((section: NavigationSection, sectionIdx: number) => (
              <div key={sectionIdx} className={sectionIdx > 0 ? 'mt-6' : ''}>
                {/* Section Title */}
                {section.title && !isSidebarCollapsed && (
                  <Text
                    as="h3"
                    variant="caption"
                    className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    {section.title}
                  </Text>
                )}

                {/* Section Routes */}
                <ul className="space-y-1">
                  {section.routes.map((route: RouteItem) => {
                    const isActive = isActiveRoute(route.href);

                    return (
                      <li key={route.href}>
                        <Link
                          href={route.href}
                          className={`
                          group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all
                          ${
                            isActive
                              ? 'bg-[var(--color-secondary)] text-white shadow-sm'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-[var(--color-secondary)]'
                          }
                          ${isSidebarCollapsed ? 'justify-center' : ''}
                        `}
                          title={isSidebarCollapsed ? route.label : undefined}
                        >
                          {/* Icon */}
                          {route.icon && (
                            <span
                              className={`
                            flex h-5 w-5 items-center justify-center transition-transform
                            ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-[var(--color-secondary)]'}
                          `}
                            >
                              {route.icon}
                            </span>
                          )}

                          {/* Label & Badge */}
                          {!isSidebarCollapsed && (
                            <>
                              <span className="flex-1">{route.label}</span>
                              {route.badge && (
                                <span
                                  className={`
                                rounded-full px-2 py-0.5 text-xs font-semibold
                                ${
                                  isActive
                                    ? 'bg-white/20 text-white'
                                    : 'bg-[var(--color-primary)] text-white'
                                }
                              `}
                                >
                                  {route.badge}
                                </span>
                              )}
                            </>
                          )}
                        </Link>

                        {/* Nested routes */}
                        {route.children && route.children.length > 0 && !isSidebarCollapsed && (
                          <ul className="ml-8 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
                            {route.children.map((child: RouteItem) => {
                              const isChildActive = isActiveRoute(child.href);

                              return (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    className={`
                                    flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all
                                    ${
                                      isChildActive
                                        ? 'font-medium text-[var(--color-primary)]'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-[var(--color-secondary)]'
                                    }
                                  `}
                                  >
                                    <span className="flex-1">{child.label}</span>
                                    {child.badge && (
                                      <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-xs font-semibold text-gray-700">
                                        {child.badge}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
