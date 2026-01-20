import { ComingSoonMessages } from './comingSoon';
import { CommonMessages } from './common';
/**
 * Complete message structure for the application
 */
export interface Messages {
  common: CommonMessages;
  comingSoon: ComingSoonMessages;
  [key: string]: any; // Add index signature for next-intl compatibility
}
