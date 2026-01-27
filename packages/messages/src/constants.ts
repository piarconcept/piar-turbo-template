/**
 * Supported languages in the application
 */
export const SUPPORTED_LANGUAGES = ['es', 'ca', 'en'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Default language
 */
export const DEFAULT_LANGUAGE: SupportedLanguage = 'ca';

/**
 * Language names
 */
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  es: 'Español',
  ca: 'Català',
  en: 'English',
};
