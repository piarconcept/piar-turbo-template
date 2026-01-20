'use client';

import Link from 'next/link';
import * as messagesPackage from '@piar/messages';

export interface FooterProps {
  language?: 'es' | 'ca' | 'en';
}

export function Footer({ language = 'ca' }: FooterProps) {
  const messages = messagesPackage[language].messages;
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: 'var(--primary-blue)',
      color: 'white',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '3rem 1.5rem 2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* About Section */}
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              marginBottom: '1rem'
            }}>
              <span style={{ color: 'var(--primary-orange)' }}>Sticka</span>prop
            </h3>
            <p style={{
              fontSize: '0.875rem',
              lineHeight: '1.6',
              opacity: 0.9
            }}>
              {messages.common.description || 'Programa esportiu extra curricular per a escoles de Barcelona'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '1rem'
            }}>
              {messages.common.quickLinks || 'Enllaços ràpids'}
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {[
                { name: messages.common.home, href: '/' },
                { name: messages.common.aboutUs, href: '/about' },
                { name: messages.common.contact, href: '/contact' },
              ].map((link) => (
                <li key={link.name} style={{ marginBottom: '0.5rem' }}>
                  <Link
                    href={link.href}
                    style={{
                      color: 'white',
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                      opacity: 0.9,
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '1rem'
            }}>
              {messages.common.contact}
            </h4>
            <p style={{
              fontSize: '0.875rem',
              lineHeight: '1.6',
              opacity: 0.9
            }}>
              Catalonia Hoquei Club<br />
              Barcelona, Catalunya<br />
              info@piar.cat
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.875rem',
          opacity: 0.8
        }}>
          <p>© {currentYear} piar. {messages.common.allRightsReserved || 'Tots els drets reservats'}.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link
              href="/privacy"
              style={{
                color: 'white',
                textDecoration: 'none',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
            >
              {messages.common.privacy || 'Privacitat'}
            </Link>
            <Link
              href="/terms"
              style={{
                color: 'white',
                textDecoration: 'none',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
            >
              {messages.common.terms || 'Termes'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
