import type { DashboardMessages } from '../types/dashboard';

export const dashboard: DashboardMessages = {
  title: 'Dashboard',
  subtitle: 'Overview of your backoffice workspace.',
  recentActivity: 'Recent activity',
  profile: {
    title: 'Profile',
    viewProfile: 'View profile and active session details.',
    email: 'Email',
    userId: 'User ID',
    role: 'Role',
    logout: 'Log out',
  },
  nav: {
    accounts: 'Accounts',
    contactSubmissions: 'Contact Submissions',
    dashboard: 'Dashboard',
    dynamicPages: 'Dynamic Pages',
    modules: 'Modules',
  },
  stats: {
    users: 'Users',
    content: 'Content',
    views: 'Views',
    conversion: 'Conversion',
  },
  search: {
    resultsFor: 'Results for',
    resultsLabel: 'results',
    prompt: 'Search accounts by account code, email or role.',
    noResultsFor: 'No results found for',
    adjustHint: 'Try another search term.',
    emptyTitle: 'Start searching',
    emptyDescription: 'Use the search bar above to find accounts in your backoffice.',
    loading: 'Loading search...',
  },
};
