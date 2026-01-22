import type { FooterConfig } from '../types';

export interface PublicFooterProps {
  config: FooterConfig;
  locale?: string;
}

export function PublicFooter({ config, locale: _locale = 'en' }: PublicFooterProps) {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {config.sections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.routes.map((route) => (
                  <li key={route.href}>
                    <a
                      href={route.href}
                      className="text-sm text-gray-600 transition-colors hover:text-[var(--color-secondary)]"
                    >
                      {route.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links */}
        {config.socialLinks && config.socialLinks.length > 0 && (
          <div className="mt-12 flex items-center justify-center gap-6">
            {config.socialLinks.map((social: { label: string; href: string; icon?: React.ReactNode }) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-[var(--color-secondary)]"
                aria-label={social.label}
              >
                {social.icon || (
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        )}

        {/* Copyright */}
        {config.copyright && (
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            {config.copyright}
          </div>
        )}
      </div>
    </footer>
  );
}
