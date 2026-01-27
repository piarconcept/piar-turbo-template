import Link from 'next/link';
import { Button, Container, Text } from '@piar/ui-components';
import type { FooterConfig } from '../types';

export interface PublicFooterProps {
  config: FooterConfig;
  locale?: string;
}

export function PublicFooter({ config, locale: _locale = 'en' }: PublicFooterProps) {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <Container className="py-12" width="7xl" padding="md">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {config.sections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <Text
                as="h3"
                variant="caption"
                className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900"
              >
                {section.title}
              </Text>
              <ul className="space-y-2">
                {section.routes.map((route) => (
                  <li key={route.href}>
                    <Button
                      asChild
                      variant="ghost"
                      size="inline"
                      className="px-0 text-gray-600 hover:bg-transparent hover:text-[var(--color-secondary)]"
                    >
                      <Link href={route.href}>
                        <Text as="span" variant="bodySmall" className="text-gray-600">
                          {route.label}
                        </Text>
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links */}
        {config.socialLinks && config.socialLinks.length > 0 && (
          <div className="mt-12 flex items-center justify-center gap-6">
            {config.socialLinks.map(
              (social: { label: string; href: string; icon?: React.ReactNode }) => (
                <Button
                  key={social.href}
                  asChild
                  variant="ghost"
                  size="inline"
                  className="text-gray-600 hover:bg-transparent hover:text-[var(--color-secondary)]"
                  aria-label={social.label}
                >
                  <Link href={social.href} target="_blank" rel="noopener noreferrer">
                    {social.icon || (
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    )}
                  </Link>
                </Button>
              ),
            )}
          </div>
        )}

        {/* Copyright */}
        {config.copyright && (
          <div className="mt-8 border-t border-gray-200 pt-8 text-center">
            <Text as="p" variant="bodySmall" className="text-gray-600">
              {config.copyright}
            </Text>
          </div>
        )}
      </Container>
    </footer>
  );
}
