import { getRequestConfig } from 'next-intl/server';
import {
    es, ca, en, SUPPORTED_LANGUAGES, SupportedLanguage
} from '@piar/messages';

export const locales = SUPPORTED_LANGUAGES;
export const defaultLocale: SupportedLanguage = 'ca';


function pickLocale(request: Request): SupportedLanguage {
    const cookie = request.headers?.get('cookie') || '';
    const m = cookie.match(/NEXT_LOCALE=(\w+)/);
    const fromCookie = m?.[1] as SupportedLanguage | undefined;

    if (fromCookie && (locales as readonly string[]).includes(fromCookie)) return fromCookie;

    const accept = request.headers?.get('accept-language') || '';
    if (accept.toLowerCase().startsWith('en')) return 'en';
    return defaultLocale;
}

export default getRequestConfig(async (req) => {
    const {
        requestLocale,
    } = req;
    const resolvedLocale: SupportedLanguage = await requestLocale.then((rl): SupportedLanguage => {
        if (rl && (locales as readonly string[]).includes(rl)) return rl as SupportedLanguage;
        return pickLocale(req as unknown as Request);
    });
    const locale = resolvedLocale;

    const messages = {
        ca: ca.messages,
        es: es.messages,
        en: en.messages,
    }[locale];

    return { locale, messages };
});