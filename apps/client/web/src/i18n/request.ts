import { getRequestConfig } from 'next-intl/server';
import * as messagesPackage from '@piar/messages';

// Supported locales
export const locales = ['ca', 'es', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ca';

function pickLocale(request: Request): Locale {
  const cookie = request.headers.get('cookie') || '';
  const m = cookie.match(/NEXT_LOCALE=(\w+)/);
  const fromCookie = m?.[1] as Locale | undefined;

  if (fromCookie && (locales as readonly string[]).includes(fromCookie)) return fromCookie;

  const accept = request.headers.get('accept-language') || '';
  if (accept.toLowerCase().startsWith('en')) return 'en';
  return defaultLocale;
}

export default getRequestConfig(async (req) => {
  const {
    requestLocale,
  } = req;
  const resolvedLocale: Locale = await requestLocale.then((rl): Locale => {
    if (rl && (locales as readonly string[]).includes(rl)) return rl as Locale;
    return pickLocale(req as unknown as Request);
  });
  const locale = resolvedLocale;

  return {
    locale,
    messages: {
      es: messagesPackage.es.messages,
      ca: messagesPackage.ca.messages,
      en: messagesPackage.en.messages,
    }
  };
});