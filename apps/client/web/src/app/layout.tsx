import { type ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { Montserrat } from 'next/font/google';
import { Layout } from '@piar/layout';
import { CookieBanner } from '@piar/cookies-client';
import { Button } from '@piar/ui-components';
import { getTranslations } from '@piar/messages';
import Link from 'next/link';
import './globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const messages = getTranslations(locale);

  return (
    <html lang={locale}>
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <NextIntlClientProvider>
          <Layout
            config={{
              footer: {
                sections: [],
                copyright: '© 2024 Piar Inc.',
                socialLinks: [],
              },
              header: {
                navigation: [],
                logo: {
                  src: '/logo.png',
                  alt: 'Piar Logo',
                  href: '/',
                },
              },
              type: 'public',
            }}
            locale={locale}
          >
            {children}
            <CookieBanner
              messages={messages.cookies}
              policyLink={
                <Button asChild size="inline" variant="ghost">
                  <Link href="/legal/cookies">{messages.cookies.banner.policyLinkLabel}</Link>
                </Button>
              }
            />
          </Layout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
