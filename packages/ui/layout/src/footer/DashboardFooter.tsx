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
                <a
                  key={route.href}
                  href={route.href}
                  className="text-sm text-gray-600 transition-colors hover:text-[var(--color-secondary)]"
                >
                  {route.label}
                </a>
              )),
            )}
          </nav>

          {/* Copyright */}
          {config.copyright && <p className="text-sm text-gray-500">{config.copyright}</p>}
        </div>
      </div>
    </footer>
  );
}
