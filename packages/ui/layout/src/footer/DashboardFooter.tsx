import Link from 'next/link';
import { Button, Text } from '@piar/ui-components';
import type { FooterConfig } from '../types';

export interface DashboardFooterProps {
  config: FooterConfig;
  locale?: string;
}

export function DashboardFooter({ config, locale: _locale = 'en' }: DashboardFooterProps) {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Quick Links */}
          <nav className="flex flex-wrap items-center gap-4">
            {config.sections.map((section) =>
              section.routes.map((route) => (
                <Button
                  key={route.href}
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
              )),
            )}
          </nav>

          {/* Copyright */}
          {config.copyright && (
            <Text as="p" variant="bodySmall" className="text-gray-500">
              {config.copyright}
            </Text>
          )}
        </div>
      </div>
    </footer>
  );
}
