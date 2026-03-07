'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Text } from '@piar/ui-components';
import { useLayout } from '../context/LayoutContext';
import type { HeaderConfig } from '../types';

export interface DashboardHeaderProps {
  config: HeaderConfig;
  locale?: string;
}

export function DashboardHeader({ config, locale: _locale = 'en' }: DashboardHeaderProps) {
  const { isSidebarCollapsed, toggleSidebar, toggleSidebarCollapse } = useLayout();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${_locale}/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="flex h-16 min-w-0 items-center justify-between gap-3 px-4 sm:px-6">
        {/* Left section: Menu buttons + Logo */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile: Burger Menu */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden text-gray-600 hover:bg-gray-100 p-2"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>

          <div className="hidden lg:flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleSidebarCollapse}
              className="hidden lg:block lg:flex text-gray-600 hover:bg-gray-100 p-2"
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg
                className={`h-5 w-5 transition-transform duration-300 ${
                  isSidebarCollapsed ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </Button>
          </div>

          {/* Logo */}
          {config.logo && (
            <Button asChild variant="ghost" size="inline" className="px-0 hover:bg-transparent">
              <Link href={config.logo.href} className="flex min-w-0 items-center gap-2">
                <Text
                  as="span"
                  variant="h5"
                  className="hidden truncate text-[var(--color-secondary)] sm:inline"
                >
                  {config.logo.alt}
                </Text>
              </Link>
            </Button>
          )}
        </div>

        {/* Search (if enabled) */}
        {config.actions?.showSearch && (
          <form onSubmit={handleSearch} className="mx-4 hidden min-w-0 flex-1 max-w-xl lg:flex">
            <div className="relative w-full">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        )}

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {/* Notifications */}
          {config.actions?.showNotifications && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="relative text-gray-600 hover:bg-gray-100"
              aria-label="Notifications"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>
          )}

          {/* User Menu */}
          {config.actions?.showUserMenu && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="inline-flex items-center gap-2 text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <Link href={`/${_locale}/profile`} aria-label="User profile">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white shadow-sm">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
