import { ComingSoonMessages } from './comingSoon';
import { CommonMessages } from './common';
import { AuthMessages } from './auth';
import { HomeMessages } from './home';
export type { AuthMessages } from './auth';
export type { HomeMessages } from './home';
/**
 * Complete message structure for the application
 */
export interface Messages {
  common: CommonMessages;
  comingSoon: ComingSoonMessages;
  auth: AuthMessages;
  home: HomeMessages;
}
