import { describe, it, expect } from 'vitest';
import * as messagesPackage from '../src/index';

describe('Package exports', () => {
  describe('Main index exports', () => {
    it('should export SUPPORTED_LANGUAGES', () => {
      expect(messagesPackage.SUPPORTED_LANGUAGES).toBeDefined();
      expect(messagesPackage.SUPPORTED_LANGUAGES).toEqual(['es', 'ca', 'en']);
    });

    it('should export DEFAULT_LANGUAGE', () => {
      expect(messagesPackage.DEFAULT_LANGUAGE).toBe('ca');
    });

    it('should export LANGUAGE_NAMES', () => {
      expect(messagesPackage.LANGUAGE_NAMES).toBeDefined();
      expect(messagesPackage.LANGUAGE_NAMES.es).toBe('Español');
      expect(messagesPackage.LANGUAGE_NAMES.ca).toBe('Català');
      expect(messagesPackage.LANGUAGE_NAMES.en).toBe('English');
    });

    it('should export Spanish messages', () => {
      expect(messagesPackage.es).toBeDefined();
      expect(messagesPackage.es.messages).toBeDefined();
    });

    it('should export Catalan messages', () => {
      expect(messagesPackage.ca).toBeDefined();
      expect(messagesPackage.ca.messages).toBeDefined();
    });

    it('should export English messages', () => {
      expect(messagesPackage.en).toBeDefined();
      expect(messagesPackage.en.messages).toBeDefined();
    });
  });

  describe('Language-specific exports', () => {
    it('should access Spanish messages correctly', () => {
      const { es } = messagesPackage;
      expect(es.messages.common.nav.home).toBe('Inicio');
    });

    it('should access Catalan messages correctly', () => {
      const { ca } = messagesPackage;
      expect(ca.messages.common.nav.home).toBe('Inici');
    });

    it('should access English messages correctly', () => {
      const { en } = messagesPackage;
      expect(en.messages.common.nav.home).toBe('Home');
    });
  });

  describe('Package structure', () => {
    it('should have all necessary exports', () => {
      const exports = Object.keys(messagesPackage);
      
      expect(exports).toContain('SUPPORTED_LANGUAGES');
      expect(exports).toContain('DEFAULT_LANGUAGE');
      expect(exports).toContain('LANGUAGE_NAMES');
      expect(exports).toContain('es');
      expect(exports).toContain('ca');
      expect(exports).toContain('en');
    });
  });
});
