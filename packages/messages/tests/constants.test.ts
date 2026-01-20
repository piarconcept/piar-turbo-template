import { describe, it, expect } from 'vitest';
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  LANGUAGE_NAMES,
  type SupportedLanguage,
} from '../src/constants';

describe('Constants', () => {
  describe('SUPPORTED_LANGUAGES', () => {
    it('should contain all supported languages', () => {
      expect(SUPPORTED_LANGUAGES).toEqual(['es', 'ca', 'en']);
    });

    it('should have a length of 3', () => {
      expect(SUPPORTED_LANGUAGES).toHaveLength(3);
    });
  });

  describe('DEFAULT_LANGUAGE', () => {
    it('should be Catalan (ca)', () => {
      expect(DEFAULT_LANGUAGE).toBe('ca');
    });

    it('should be included in SUPPORTED_LANGUAGES', () => {
      expect(SUPPORTED_LANGUAGES).toContain(DEFAULT_LANGUAGE);
    });
  });

  describe('LANGUAGE_NAMES', () => {
    it('should contain all language names', () => {
      expect(LANGUAGE_NAMES).toEqual({
        es: 'Español',
        ca: 'Català',
        en: 'English',
      });
    });

    it('should have entries for all supported languages', () => {
      SUPPORTED_LANGUAGES.forEach((lang) => {
        expect(LANGUAGE_NAMES[lang as SupportedLanguage]).toBeDefined();
      });
    });
  });
});
