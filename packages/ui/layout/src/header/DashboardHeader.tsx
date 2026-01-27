import Link from 'next/link';
import { Button, Input, Text } from '@piar/ui-components';
import type { HeaderConfig } from '../types';

export interface DashboardHeaderProps {
  config: HeaderConfig;
  locale?: string;
}

export function DashboardHeader({ config, locale: _locale = 'en' }: DashboardHeaderProps) {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        {config.logo && (
          <Button asChild variant="ghost" size="inline" className="px-0 hover:bg-transparent">
            <Link href={config.logo.href} className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-[var(--color-primary)]/90 shadow-sm" />
              <Text as="span" variant="h5" className="text-[var(--color-secondary)]">
                {config.logo.alt}
              </Text>
            </Link>
          </Button>
        )}

        {/* Search (if enabled) */}
        {config.actions?.showSearch && (
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
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
              <Input type="search" placeholder="Search..." className="pl-10" />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
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
              type="button"
              variant="ghost"
              size="sm"
              className="inline-flex items-center gap-2 text-gray-600 hover:bg-gray-100"
              aria-label="User menu"
            >
              <div className="h-8 w-8 rounded-full bg-[var(--color-primary)]" />
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
