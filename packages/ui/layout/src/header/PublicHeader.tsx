'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button, Container, Text } from '@piar/ui-components';
import type { HeaderConfig } from '../types';
import { withLocale } from '../utils/with-locale';

export interface PublicHeaderProps {
  config: HeaderConfig;
  locale?: string;
}

export function PublicHeader({ config, locale = 'en' }: PublicHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        if (Math.abs(delta) > 8) {
          setIsVisible(delta < 0 || currentY < 16);
          lastScrollY.current = currentY;
        }

        ticking.current = false;
      });
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMobileMenuOpen]);

  const mobileRoutes = config.navigation.flatMap((section) => section.routes);

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b border-white/10 bg-[var(--color-secondary)]/95 shadow-lg backdrop-blur transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <Container
        className="flex h-16 min-w-0 items-center justify-between gap-3"
        width="7xl"
        padding="md"
      >
        {/* Logo */}
        {config.logo && (
          <Button
            asChild
            variant="ghost"
            size="inline"
            className="px-0 text-white hover:bg-white/10"
          >
            <Link
              href={withLocale(config.logo.href, locale)}
              className="flex min-w-0 items-center gap-2"
            >
              <div className="h-9 w-9 rounded-lg bg-[var(--color-primary)]/90 shadow-sm" />
              <Text as="span" variant="h5" className="truncate text-white">
                {config.logo.alt}
              </Text>
            </Link>
          </Button>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden min-w-0 items-center gap-2 lg:flex">
          {config.navigation.map((section, sectionIdx) => (
            <React.Fragment key={sectionIdx}>
              {section.routes.map((route) => (
                <Button
                  key={route.href}
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href={withLocale(route.href, locale)}>
                    <Text as="span" variant="label" className="text-white">
                      {route.label}
                    </Text>
                  </Link>
                </Button>
              ))}
            </React.Fragment>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {config.actions?.showUserMenu && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden lg:inline-flex text-white hover:bg-white/10"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="primary" size="sm" asChild>
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
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((current) => !current)}
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
        </div>
      </Container>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <button
            type="button"
            className="fixed inset-0 top-16 z-40 bg-black/50"
            aria-label="Close menu"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <nav className="absolute left-0 top-16 z-50 w-full border-b border-white/10 bg-[var(--color-secondary)]/95 px-4 py-4 backdrop-blur">
            <div className="flex flex-col gap-2">
              {mobileRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={withLocale(route.href, locale)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {route.label}
                </Link>
              ))}

              {config.actions?.showUserMenu && (
                <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
                  <Link
                    href="/login"
                    className="rounded-lg border border-white/20 px-3 py-2 text-center text-sm font-medium text-white hover:bg-white/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-lg bg-[var(--color-primary)] px-3 py-2 text-center text-sm font-medium text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
