import type { LegalTemplateMessages } from './legal-template';

/**
 * Legal page messages (privacy, terms, cookies) using the legal template structure.
 */
export interface LegalMessages {
  index: {
    title: string;
    description: string;
    privacyLabel: string;
    privacyDescription: string;
    termsLabel: string;
    termsDescription: string;
    cookiesLabel: string;
    cookiesDescription: string;
  };
  privacy: LegalTemplateMessages;
  terms: LegalTemplateMessages;
  cookies: LegalTemplateMessages;
}
