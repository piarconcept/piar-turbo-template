import { type ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { Montserrat } from 'next/font/google';
import Link from 'next/link';
import { CookieBanner } from '@piar/cookies-client';
import { Button } from '@piar/ui-components';
import { getTranslations } from '@piar/messages';
import { SessionProvider } from '@/components/providers/session-provider';
import './globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

/**
 * Root Layout - Provides font, i18n, and session setup
 * Actual layout structure is handled by route groups:
 * - (public) - Public layout for authentication pages
 * - (dashboard) - Dashboard layout for private pages
 */
export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const messages = getTranslations(locale);

  return (
    <html lang={locale}>
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <SessionProvider>
          <NextIntlClientProvider>
            {children}
            <CookieBanner
              messages={messages.cookies}
              policyLink={
                <Button asChild size="inline" variant="ghost">
                  <Link href="/legal/cookies">{messages.cookies.banner.policyLinkLabel}</Link>
                </Button>
              }
            />
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
