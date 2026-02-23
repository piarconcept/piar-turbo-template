export interface DashboardMessages {
  title: string;
  subtitle: string;
  recentActivity: string;
  profile: {
    title: string;
    viewProfile: string;
    email: string;
    userId: string;
    role: string;
    logout: string;
  };
  nav: {
    accounts: string;
    contactSubmissions: string;
    dashboard: string;
    dynamicPages: string;
    modules: string;
  };
  stats: {
    users: string;
    content: string;
    views: string;
    conversion: string;
  };
  search: {
    resultsFor: string;
    resultsLabel: string;
    prompt: string;
    noResultsFor: string;
    adjustHint: string;
    emptyTitle: string;
    emptyDescription: string;
    loading: string;
  };
}
