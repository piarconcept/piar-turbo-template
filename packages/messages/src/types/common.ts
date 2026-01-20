/**
 * Common messages used across the application
 */
export interface CommonMessages {
  // Navigation
  nav: {
    home: string;
    about: string;
    programs: string;
    contact: string;
    login: string;
    logout: string;
  };
  
  // Actions
  actions: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    confirm: string;
    close: string;
    back: string;
    next: string;
    submit: string;
    search: string;
  };
  
  // Status
  status: {
    loading: string;
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  
  // General
  general: {
    yes: string;
    no: string;
    ok: string;
    notAvailable: string;
    required: string;
    optional: string;
  };

  // Footer & Layout
  home: string;
  aboutUs: string;
  contact: string;
  description: string;
  quickLinks: string;
  allRightsReserved: string;
  privacy: string;
  terms: string;
}
