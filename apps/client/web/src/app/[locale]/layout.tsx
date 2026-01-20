import { type ReactNode } from "react";
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

export const dynamicParams = false;

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
        <NextIntlClientProvider>
          <Layout>{children}</Layout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
