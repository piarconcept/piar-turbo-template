import { describe, it, expect } from 'vitest';
import type { Messages } from '../src/types';
import { CommonMessages } from '../src/types/common';
import { ComingSoonMessages } from '../src/types/comingSoon';

describe('Type definitions', () => {
  describe('CommonMessages interface', () => {
    it('should accept valid common messages structure', () => {
      const validCommon: CommonMessages = {
        nav: {
          home: 'Home',
          about: 'About',
          programs: 'Programs',
          contact: 'Contact',
          login: 'Login',
          logout: 'Logout',
        },
        actions: {
          save: 'Save',
          cancel: 'Cancel',
          delete: 'Delete',
          edit: 'Edit',
          create: 'Create',
          confirm: 'Confirm',
          close: 'Close',
          back: 'Back',
          next: 'Next',
          submit: 'Submit',
          search: 'Search',
        },
        status: {
          loading: 'Loading',
          success: 'Success',
          error: 'Error',
          warning: 'Warning',
          info: 'Info',
        },
        general: {
          yes: 'Yes',
          no: 'No',
          ok: 'OK',
          notAvailable: 'Not available',
          required: 'Required',
          optional: 'Optional',
        },
      };

      expect(validCommon.nav.home).toBe('Home');
      expect(validCommon.actions.save).toBe('Save');
      expect(validCommon.status.loading).toBe('Loading');
      expect(validCommon.general.yes).toBe('Yes');
    });
  });

  describe('ComingSoonMessages interface', () => {
    it('should accept valid coming soon messages structure', () => {
      const validComingSoon: ComingSoonMessages = {
        title: 'Coming Soon',
        subtitle: 'We are working on it',
        description: 'This feature will be available soon',
        notifyMe: '',
        learnMore: '',
        backHome: ''
      };

      expect(validComingSoon.title).toBe('Coming Soon');
      expect(validComingSoon.subtitle).toBe('We are working on it');
    });
  });

  describe('Messages interface', () => {
    it('should accept complete messages structure', () => {
      const validMessages: Messages = {
        common: {
          nav: {
            home: 'Home',
            about: 'About',
            programs: 'Programs',
            contact: 'Contact',
            login: 'Login',
            logout: 'Logout',
          },
          actions: {
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            create: 'Create',
            confirm: 'Confirm',
            close: 'Close',
            back: 'Back',
            next: 'Next',
            submit: 'Submit',
            search: 'Search',
          },
          status: {
            loading: 'Loading',
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Info',
          },
          general: {
            yes: 'Yes',
            no: 'No',
            ok: 'OK',
            notAvailable: 'Not available',
            required: 'Required',
            optional: 'Optional',
          },
        },
        comingSoon: {
          title: 'Coming Soon',
          subtitle: 'We are working on it',
          description: '',
          notifyMe: '',
          learnMore: '',
          backHome: ''
        },
      };

      expect(validMessages.common).toBeDefined();
      expect(validMessages.comingSoon).toBeDefined();
    });
  });
});
