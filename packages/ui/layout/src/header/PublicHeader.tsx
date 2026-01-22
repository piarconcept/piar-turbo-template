import React from 'react';
import Link from 'next/link';
import { Button, Text } from '@piar/ui-components';
import type { HeaderConfig } from '../types';

export interface PublicHeaderProps {
  config: HeaderConfig;
  locale?: string;
}

export function PublicHeader({ config, locale: _locale = 'en' }: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-[var(--color-secondary)] shadow-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        {config.logo && (
          <Link href={config.logo.href} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-[var(--color-primary)]" />
            <Text variant="h3" className="text-white">{config.logo.alt}</Text>
          </Link>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {config.navigation.map((section, sectionIdx) => (
            <React.Fragment key={sectionIdx}>
              {section.routes.map((route) => (
                <Button
                  key={route.href}
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <Link
                    href={route.href}
                    className="text-white hover:text-[var(--color-primary)]"
                  >
                    {route.label}
                  </Link>
                </Button>
              ))}
            </React.Fragment>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {config.actions?.showUserMenu && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden md:inline-flex text-white hover:bg-white/10"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                variant="primary"
                size="sm"
                asChild
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:bg-white/10"
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
          </Button>
        </div>
      </div>
    </header>
  );
}
