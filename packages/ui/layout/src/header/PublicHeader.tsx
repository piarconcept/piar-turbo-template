'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button, Container, Text } from '@piar/ui-components';
import type { HeaderConfig } from '../types';

export interface PublicHeaderProps {
  config: HeaderConfig;
  locale?: string;
}

export function PublicHeader({ config, locale: _locale = 'en' }: PublicHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
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

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b border-white/10 bg-[var(--color-secondary)]/95 shadow-lg backdrop-blur transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <Container className="flex h-16 items-center justify-between" width="7xl" padding="md">
        {/* Logo */}
        {config.logo && (
          <Button
            asChild
            variant="ghost"
            size="inline"
            className="px-0 text-white hover:bg-white/10"
          >
            <Link href={config.logo.href} className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-[var(--color-primary)]/90 shadow-sm" />
              <Text as="span" variant="h5" className="text-white">
                {config.logo.alt}
              </Text>
            </Link>
          </Button>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
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
                  <Link href={route.href}>
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
    </header>
  );
}
