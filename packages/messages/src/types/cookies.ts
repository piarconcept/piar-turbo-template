export interface CookiesMessages {
  banner: {
    title: string;
    description: string;
    acceptAll: string;
    rejectAll: string;
    manage: string;
    policyLinkLabel: string;
  };
  dialog: {
    title: string;
    description: string;
    acceptAll: string;
    rejectAll: string;
    savePreferences: string;
    policyLinkLabel: string;
    categories: {
      necessary: {
        title: string;
        description: string;
        lockedLabel: string;
      };
      analytics: {
        title: string;
        description: string;
        lockedLabel: string;
      };
      marketing: {
        title: string;
        description: string;
        lockedLabel: string;
      };
    };
  };
}
