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
    <header style={{ 
      backgroundColor: 'var(--primary-blue)', 
      color: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <nav style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link href="/" style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'white',
          textDecoration: 'none'
        }}>
          <span style={{ color: 'var(--primary-orange)' }}>Sticka</span>prop
        </Link>

        {/* Desktop Navigation */}
        <div style={{
          display: 'none',
          gap: '2rem',
          alignItems: 'center'
        }} className="desktop-nav">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              style={{
                color: 'white',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-orange)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'block',
            color: 'white',
            padding: '0.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
          className="mobile-menu-btn"
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
        <div style={{
          backgroundColor: 'var(--primary-blue)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '1rem 1.5rem'
        }} className="mobile-menu">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'block',
                color: 'white',
                padding: '0.75rem 0',
                fontWeight: 500,
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
