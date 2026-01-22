import type { HomeMessages } from '../types/home';

export const home: HomeMessages = {
  title: 'Backoffice control center',
  subtitle: 'Manage users, permissions, and reporting from one secure place.',
  signIn: 'Sign in',
  requestAccess: 'Request access',
  features: {
    title: 'Everything you need to run operations',
    users: {
      title: 'User management',
      description: 'Invite, onboard, and control roles with full visibility.',
    },
    analytics: {
      title: 'Performance analytics',
      description: 'Track activity and results with clear, actionable dashboards.',
    },
    settings: {
      title: 'Organization settings',
      description: 'Configure access, security, and integrations in minutes.',
    },
  },
  cta: {
    title: 'Ready to request access?',
    description: 'Create your account and we will review it quickly.',
    button: 'Start request',
  },
};
