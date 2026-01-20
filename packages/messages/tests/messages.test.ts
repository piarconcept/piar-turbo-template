import { describe, it, expect } from 'vitest';
import * as es from '../src/es';
import * as ca from '../src/ca';
import * as en from '../src/en';
import type { Messages } from '../src/types';

describe('Messages Structure', () => {
  describe('Spanish (es) messages', () => {
    it('should export messages', () => {
      expect(es.messages).toBeDefined();
    });

    it('should have common messages', () => {
      expect(es.messages.common).toBeDefined();
      expect(es.messages.common.nav).toBeDefined();
      expect(es.messages.common.actions).toBeDefined();
      expect(es.messages.common.status).toBeDefined();
      expect(es.messages.common.general).toBeDefined();
    });

    it('should have comingSoon messages', () => {
      expect(es.messages.comingSoon).toBeDefined();
      expect(es.messages.comingSoon.title).toBeDefined();
    });

    it('should have valid navigation messages', () => {
      const { nav } = es.messages.common;
      expect(nav.home).toBe('Inicio');
      expect(nav.about).toBe('Sobre nosotros');
      expect(nav.contact).toBe('Contacto');
    });
  });

  describe('Catalan (ca) messages', () => {
    it('should export messages', () => {
      expect(ca.messages).toBeDefined();
    });

    it('should have common messages', () => {
      expect(ca.messages.common).toBeDefined();
      expect(ca.messages.common.nav).toBeDefined();
      expect(ca.messages.common.actions).toBeDefined();
      expect(ca.messages.common.status).toBeDefined();
      expect(ca.messages.common.general).toBeDefined();
    });

    it('should have comingSoon messages', () => {
      expect(ca.messages.comingSoon).toBeDefined();
      expect(ca.messages.comingSoon.title).toBeDefined();
    });

    it('should have valid navigation messages', () => {
      const { nav } = ca.messages.common;
      expect(nav.home).toBe('Inici');
      expect(nav.about).toBe('Sobre nosaltres');
      expect(nav.contact).toBe('Contacte');
    });
  });

  describe('English (en) messages', () => {
    it('should export messages', () => {
      expect(en.messages).toBeDefined();
    });

    it('should have common messages', () => {
      expect(en.messages.common).toBeDefined();
      expect(en.messages.common.nav).toBeDefined();
      expect(en.messages.common.actions).toBeDefined();
      expect(en.messages.common.status).toBeDefined();
      expect(en.messages.common.general).toBeDefined();
    });

    it('should have comingSoon messages', () => {
      expect(en.messages.comingSoon).toBeDefined();
      expect(en.messages.comingSoon.title).toBeDefined();
    });

    it('should have valid navigation messages', () => {
      const { nav } = en.messages.common;
      expect(nav.home).toBe('Home');
      expect(nav.about).toBe('About us');
      expect(nav.contact).toBe('Contact');
    });
  });

  describe('Messages consistency', () => {
    it('should have the same structure across all languages', () => {
      const esKeys = Object.keys(es.messages);
      const caKeys = Object.keys(ca.messages);
      const enKeys = Object.keys(en.messages);

      expect(esKeys).toEqual(caKeys);
      expect(esKeys).toEqual(enKeys);
    });

    it('should have the same common sub-keys across all languages', () => {
      const esCommonKeys = Object.keys(es.messages.common);
      const caCommonKeys = Object.keys(ca.messages.common);
      const enCommonKeys = Object.keys(en.messages.common);

      expect(esCommonKeys).toEqual(caCommonKeys);
      expect(esCommonKeys).toEqual(enCommonKeys);
    });

    it('should have all action keys in all languages', () => {
      const actionKeys = ['save', 'cancel', 'edit', 'delete', 'create', 'search'];

      actionKeys.forEach(() => {
        expect(es.messages.common.actions).toBeDefined();
        expect(ca.messages.common.actions).toBeDefined();
        expect(en.messages.common.actions).toBeDefined();
      });
    });

    it('should have all status keys in all languages', () => {
      const statusKeys = ['loading', 'success', 'error', 'warning', 'info'];

      statusKeys.forEach(() => {
        expect(es.messages.common.status).toBeDefined();
        expect(ca.messages.common.status).toBeDefined();
        expect(en.messages.common.status).toBeDefined();
      });
    });
  });

  describe('Type conformity', () => {
    it('should conform to Messages type', () => {
      const esMessages: Messages = es.messages;
      const caMessages: Messages = ca.messages;
      const enMessages: Messages = en.messages;

      expect(esMessages).toBeDefined();
      expect(caMessages).toBeDefined();
      expect(enMessages).toBeDefined();
    });
  });
});
