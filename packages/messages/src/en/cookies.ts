import type { CookiesMessages } from '../types/cookies';

export const cookies: CookiesMessages = {
  banner: {
    title: 'We use cookies',
    description:
      'We use essential cookies to make this site work. With your permission, we also use analytics and marketing cookies to improve your experience.',
    acceptAll: 'Accept all',
    rejectAll: 'Reject non-essential',
    manage: 'Manage preferences',
    policyLinkLabel: 'Cookies policy',
  },
  dialog: {
    title: 'Cookie preferences',
    description:
      'Choose which types of cookies you allow. You can change these settings at any time from the cookies policy page.',
    acceptAll: 'Accept all',
    rejectAll: 'Reject non-essential',
    savePreferences: 'Save preferences',
    policyLinkLabel: 'Cookies policy',
    categories: {
      necessary: {
        title: 'Essential cookies',
        description: 'Required for the website to function and cannot be disabled.',
        lockedLabel: 'Always on',
      },
      analytics: {
        title: 'Analytics cookies',
        description: 'Help us understand how the site is used to improve performance.',
        lockedLabel: 'Optional',
      },
      marketing: {
        title: 'Marketing cookies',
        description: 'Used to deliver relevant content and measure campaign performance.',
        lockedLabel: 'Optional',
      },
    },
  },
};
