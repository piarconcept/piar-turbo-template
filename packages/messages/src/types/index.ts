import { ComingSoonMessages } from './comingSoon';
import { CommonMessages } from './common';
import { AuthMessages } from './auth';
import { HomeMessages } from './home';
import { LegalMessages } from './legal';
import { CookiesMessages } from './cookies';

export type { AuthMessages } from './auth';
export type { HomeMessages } from './home';
export type { LegalMessages } from './legal';
export type { LegalTemplateMessages, LegalTemplateSectionMessages } from './legal-template';
export type { CookiesMessages } from './cookies';

/**
 * Complete message structure for the application
 */
export interface Messages {
  common: CommonMessages;
  comingSoon: ComingSoonMessages;
  auth: AuthMessages;
  home: HomeMessages;
  legal: LegalMessages;
  cookies: CookiesMessages;
}
