export type CookieCategory = 'necessary' | 'analytics' | 'marketing';

export interface CookiePreferences {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

export type CookieConsentStatus = 'accepted' | 'rejected' | 'custom';

export interface CookieConsentState {
  status: CookieConsentStatus;
  preferences: CookiePreferences;
  updatedAt: string;
}

export interface CookieBannerMessages {
  title: string;
  description: string;
  acceptAll: string;
  rejectAll: string;
  manage: string;
  policyLinkLabel: string;
}

export interface CookieDialogCategoryMessages {
  title: string;
  description: string;
  lockedLabel: string;
}

export interface CookieDialogMessages {
  title: string;
  description: string;
  acceptAll: string;
  rejectAll: string;
  savePreferences: string;
  policyLinkLabel: string;
  categories: {
    necessary: CookieDialogCategoryMessages;
    analytics: CookieDialogCategoryMessages;
    marketing: CookieDialogCategoryMessages;
  };
}

export interface CookieMessages {
  banner: CookieBannerMessages;
  dialog: CookieDialogMessages;
}
