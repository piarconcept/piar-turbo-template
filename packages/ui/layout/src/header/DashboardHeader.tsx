import type { HeaderConfig } from '../types';

export interface DashboardHeaderProps {
  config: HeaderConfig;
  locale?: string;
}

export function DashboardHeader({ config, locale: _locale = 'en' }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        {config.logo && (
          <a href={config.logo.href} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-[var(--color-primary)]" />
            <span className="text-xl font-bold text-[var(--color-secondary)]">
              {config.logo.alt}
            </span>
          </a>
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
              <input
                type="search"
                placeholder="Search..."
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm placeholder:text-gray-500 focus:border-[var(--color-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary)]"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          {config.actions?.showNotifications && (
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100"
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
            </button>
          )}

          {/* User Menu */}
          {config.actions?.showUserMenu && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md p-2 text-gray-600 hover:bg-gray-100"
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
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
