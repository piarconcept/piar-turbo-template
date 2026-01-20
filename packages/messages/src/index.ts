// Export types
export type { 
  Messages 
} from './types';

// Export constants
export { 
  SUPPORTED_LANGUAGES, 
  DEFAULT_LANGUAGE, 
  LANGUAGE_NAMES,
  type SupportedLanguage 
} from './constants';

// Re-export language-specific messages
import * as es from './es';
import * as ca from './ca';
import * as en from './en';

export { es, ca, en };


export const getTranslations = (locale: string) => {
    const translations = {
        es: es,
        ca: ca,
        en: en,
    };
    const translation = translations[locale as keyof typeof translations];

    if (!translation) {
        throw new Error('Locale not implemented');
    }

    return translation;
};