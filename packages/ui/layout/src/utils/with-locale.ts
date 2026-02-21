export function withLocale(href: string, locale?: string): string {
  if (!locale) return href;

  // External URLs
  if (/^https?:\/\//i.test(href)) return href;

  // Already localized
  if (href.startsWith(`/${locale}/`) || href === `/${locale}`) return href;

  // Only prefix absolute app routes
  if (href.startsWith('/')) return `/${locale}${href}`;

  return href;
}
