import type { LegalMessages } from '../types/legal';

export const legal: LegalMessages = {
  index: {
    title: 'Legal',
    description: 'Essential legal documents for this product.',
    privacyLabel: 'Privacy Policy',
    privacyDescription: 'How we handle personal data.',
    termsLabel: 'Terms of Service',
    termsDescription: 'Usage rules and responsibilities.',
    cookiesLabel: 'Cookie Policy',
    cookiesDescription: 'Cookies and tracking details.',
  },
  privacy: {
    title: 'Privacy Policy',
    intro: 'This is a placeholder privacy policy. Replace with your official privacy notice.',
    updatedAt: 'Last updated: January 27, 2026',
    sections: [
      {
        title: 'Information We Collect',
        body: ['Describe the categories of personal data collected and how they are used.'],
        bullets: ['Contact information', 'Account data', 'Usage analytics'],
      },
      {
        title: 'How We Use Information',
        body: ['Explain the legal basis and purposes for processing user data.'],
      },
      {
        title: 'Your Rights',
        body: ['Explain how users can access, update, or delete their data.'],
      },
    ],
    contact: {
      label: 'Privacy contact',
      emailLabel: 'Email',
      addressLabel: 'Address',
    },
    footerNote: 'Replace this content with your official privacy policy.',
    backToLegalLabel: 'Back to legal',
  },
  terms: {
    title: 'Terms of Service',
    intro: 'This is a placeholder terms of service page. Replace with your official terms.',
    updatedAt: 'Last updated: January 27, 2026',
    sections: [
      {
        title: 'Usage Rules',
        body: ['Summarize acceptable use and prohibited behavior.'],
      },
      {
        title: 'Accounts and Security',
        body: ['Define responsibilities for account credentials and access.'],
      },
      {
        title: 'Liability',
        body: ['Clarify limitations of liability and disclaimers.'],
      },
    ],
    contact: {
      label: 'Terms contact',
      emailLabel: 'Email',
      addressLabel: 'Address',
    },
    footerNote: 'Replace this content with your official terms of service.',
    backToLegalLabel: 'Back to legal',
  },
  cookies: {
    title: 'Cookie Policy',
    intro: 'This is a placeholder cookie policy. Replace with your official cookie details.',
    updatedAt: 'Last updated: January 27, 2026',
    sections: [
      {
        title: 'What Are Cookies?',
        body: ['Explain what cookies are and how they are used.'],
      },
      {
        title: 'How We Use Cookies',
        body: ['Describe essential, analytics, and marketing cookies.'],
        bullets: ['Essential cookies', 'Analytics cookies', 'Marketing cookies'],
      },
      {
        title: 'Managing Preferences',
        body: ['Explain how users can control cookie settings.'],
      },
    ],
    contact: {
      label: 'Cookie contact',
      emailLabel: 'Email',
      addressLabel: 'Address',
    },
    footerNote: 'Replace this content with your official cookie policy.',
    backToLegalLabel: 'Back to legal',
  },
};
