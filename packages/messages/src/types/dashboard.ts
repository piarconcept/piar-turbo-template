export interface DashboardMessages {
  title: string;
  subtitle: string;
  recentActivity: string;
  stats: {
    users: string;
    content: string;
    views: string;
    conversion: string;
  };
}
