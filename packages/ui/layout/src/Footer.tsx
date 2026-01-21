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
    <footer className="bg-[var(--color-primary-blue)] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-[var(--color-primary-orange)]">Sticka</span>prop
            </h3>
            <p className="text-sm leading-relaxed opacity-90">
              {messages.common.description || 'Programa esportiu extra curricular per a escoles de Barcelona'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold mb-4">
              {messages.common.quickLinks || 'Enllaços ràpids'}
            </h4>
            <ul className="list-none p-0 m-0 space-y-2">
              {[
                { name: messages.common.home, href: '/' },
                { name: messages.common.aboutUs, href: '/about' },
                { name: messages.common.contact, href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white text-sm no-underline opacity-90 transition-opacity hover:opacity-100"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base font-semibold mb-4">
              {messages.common.contact}
            </h4>
            <p className="text-sm leading-relaxed opacity-90">
              Catalonia Hoquei Club<br />
              Barcelona, Catalunya<br />
              info@piar.cat
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-wrap justify-between items-center gap-4 text-sm opacity-80">
          <p>© {currentYear} piar. {messages.common.allRightsReserved || 'Tots els drets reservats'}.</p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-white no-underline transition-opacity hover:opacity-100"
            >
              {messages.common.privacy || 'Privacitat'}
            </Link>
            <Link
              href="/terms"
              className="text-white no-underline transition-opacity hover:opacity-100"
            >
              {messages.common.terms || 'Termes'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
