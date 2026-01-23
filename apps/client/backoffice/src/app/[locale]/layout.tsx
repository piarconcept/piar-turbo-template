import { type ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { Montserrat } from 'next/font/google';
import { SessionProvider } from '@/components/providers/session-provider';
import './globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const dynamicParams = false;

/**
 * Root Layout - Provides font, i18n, and session setup
 * Actual layout structure is handled by route groups:
 * - (public) - Public layout for authentication pages
 * - (dashboard) - Dashboard layout for private pages
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <SessionProvider>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

