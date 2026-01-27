import type { HeaderConfig, FooterConfig, AsideConfig } from '../types';

/**
 * Public Layout Configuration
 * For public-facing pages (landing, about, contact, etc.)
 */

export const publicHeaderConfig: HeaderConfig = {
  logo: {
    src: '/logo.svg',
    alt: 'PIAR',
    href: '/',
  },
  navigation: [
    {
      routes: [
        { label: 'home', href: '/' },
        { label: 'features', href: '/features' },
        { label: 'pricing', href: '/pricing' },
        { label: 'about', href: '/about' },
        { label: 'contact', href: '/contact' },
      ],
    },
  ],
  actions: {
    showSearch: false,
    showNotifications: false,
    showUserMenu: true,
  },
};

export const publicFooterConfig: FooterConfig = {
  sections: [
    {
      title: 'product',
      routes: [
        { label: 'features', href: '/features' },
        { label: 'pricing', href: '/pricing' },
        { label: 'security', href: '/security' },
      ],
    },
    {
      title: 'company',
      routes: [
        { label: 'about', href: '/about' },
        { label: 'blog', href: '/blog' },
        { label: 'careers', href: '/careers' },
      ],
    },
    {
      title: 'resources',
      routes: [
        { label: 'documentation', href: '/docs' },
        { label: 'help', href: '/help' },
        { label: 'contact', href: '/contact' },
      ],
    },
    {
      title: 'legal',
      routes: [
        { label: 'privacy', href: '/privacy' },
        { label: 'terms', href: '/terms' },
        { label: 'cookies', href: '/cookies' },
      ],
    },
  ],
  copyright: '© 2026 PIAR. All rights reserved.',
  //   social: [
  //     { label: 'Twitter', href: 'https://twitter.com/piar', icon: 'twitter' },
  //     { label: 'LinkedIn', href: 'https://linkedin.com/company/piar', icon: 'linkedin' },
  //     { label: 'GitHub', href: 'https://github.com/piar', icon: 'github' },
  //   ],
};

/**
 * Dashboard Layout Configuration
 * For authenticated dashboard/admin pages
 */

export const dashboardHeaderConfig: HeaderConfig = {
  logo: {
    src: '/logo.svg',
    alt: 'PIAR Dashboard',
    href: '/dashboard',
  },
  navigation: [
    {
      routes: [{ label: 'dashboard', href: '/dashboard' }],
    },
  ],
  actions: {
    showSearch: true,
    showNotifications: true,
    showUserMenu: true,
  },
};

export const dashboardAsideConfig: AsideConfig = {
  //   title: 'Dashboard',
  //   collapsed: false,
  collapsible: true,
  navigation: [
    {
      title: 'main',
      routes: [
        { label: 'overview', href: '/dashboard', icon: 'home' },
        { label: 'analytics', href: '/dashboard/analytics', icon: 'chart' },
      ],
    },
    {
      title: 'management',
      routes: [
        { label: 'users', href: '/dashboard/users', icon: 'users', badge: 'new' },
        { label: 'projects', href: '/dashboard/projects', icon: 'folder' },
        { label: 'settings', href: '/dashboard/settings', icon: 'settings' },
      ],
    },
    {
      title: 'support',
      routes: [
        { label: 'help', href: '/dashboard/help', icon: 'help' },
        { label: 'documentation', href: '/dashboard/docs', icon: 'book' },
      ],
    },
  ],
};

export const dashboardFooterConfig: FooterConfig = {
  sections: [
    {
      routes: [
        { label: 'help', href: '/dashboard/help' },
        { label: 'documentation', href: '/dashboard/docs' },
        { label: 'support', href: '/dashboard/support' },
      ],
    },
  ],
  copyright: '© 2026 PIAR Dashboard. All rights reserved.',
};
