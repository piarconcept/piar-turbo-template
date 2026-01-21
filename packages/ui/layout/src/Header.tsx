'use client';

import Link from 'next/link';
import { useState } from 'react';
import * as messagesPackage from '@piar/messages';

export interface HeaderProps {
  language?: 'es' | 'ca' | 'en';
}

export function Header({ language = 'ca' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const messages = messagesPackage[language].messages;

  const navigation = [
    { name: messages.common.home, href: '/' },
    { name: messages.common.aboutUs, href: '/about' },
    { name: messages.common.contact, href: '/contact' },
  ];

  return (
    <header className="bg-[var(--color-primary-blue)] text-white sticky top-0 z-50 shadow-md">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white no-underline">
          <span className="text-[var(--color-primary-orange)]">Sticka</span>prop
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-white font-medium no-underline transition-colors hover:text-[var(--color-primary-orange)]"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="block md:hidden text-white p-2 bg-transparent border-none cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="bg-[var(--color-primary-blue)] border-t border-white/10 px-6 py-4 md:hidden">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white py-3 font-medium no-underline border-b border-white/10 last:border-b-0"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
