import { ComingSoonMessages } from './comingSoon';
import { CommonMessages } from './common';
import { AuthMessages } from './auth';
import { HomeMessages } from './home';
import { LegalMessages } from './legal';
import { CookiesMessages } from './cookies';
import { DashboardMessages } from './dashboard';
import { ModulesMessages } from './modules';

export type { AuthMessages } from './auth';
export type { HomeMessages } from './home';
export type { LegalMessages } from './legal';
export type { LegalTemplateMessages, LegalTemplateSectionMessages } from './legal-template';
export type { CookiesMessages } from './cookies';
export type { DashboardMessages } from './dashboard';
export type { ModulesMessages } from './modules';

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
  dashboard: DashboardMessages;
  modules: ModulesMessages;
}
