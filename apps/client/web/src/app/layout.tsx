import { type ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { Montserrat } from 'next/font/google';
import { Layout } from '@piar/layout';
import './globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();

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
          </Layout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
