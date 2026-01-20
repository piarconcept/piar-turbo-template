import { NextIntlClientProvider } from "next-intl";
import { Montserrat } from 'next/font/google';
import { Layout } from '@piar/layout';
import './globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const locales = ['ca', 'es', 'en'] as const;
type Locale = typeof locales[number];

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const resolvedParams = typeof params?.then === 'function' ? await params : params;
  const locale = resolvedParams?.locale ?? 'en';

  return (
    <html lang={locale}>
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <NextIntlClientProvider>
          <Layout language={locale as Locale}>{children}</Layout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
