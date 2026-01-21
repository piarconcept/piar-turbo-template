import React from 'react';
import type { HeaderConfig } from '../types';

export interface PublicHeaderProps {
  config: HeaderConfig;
  locale?: string;
}

export function PublicHeader({ config, locale: _locale = 'en' }: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-[var(--color-primary-blue)] shadow-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        {config.logo && (
          <a href={config.logo.href} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-[var(--color-primary-orange)]" />
            <span className="text-xl font-bold text-white">{config.logo.alt}</span>
          </a>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {config.navigation.map((section, sectionIdx) => (
            <React.Fragment key={sectionIdx}>
              {section.routes.map((route) => (
                <a
                  key={route.href}
                  href={route.href}
                  className="text-sm font-medium text-white transition-colors hover:text-[var(--color-primary-orange)]"
                >
                  {route.label}
                </a>
              ))}
            </React.Fragment>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {config.actions?.showUserMenu && (
            <div className="flex items-center gap-2">
              <a
                href="/login"
                className="hidden md:inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Login
              </a>
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-md bg-[var(--color-primary-orange)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-orange)]/90"
              >
                Sign Up
              </a>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
