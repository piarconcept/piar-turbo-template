/**
 * Layout Types and Interfaces
 * Defines all type definitions for the layout system
 */

/**
 * Type of layout to render
 */
export type LayoutType = 'public' | 'dashboard';

/**
 * Route item structure
 */
export interface RouteItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: RouteItem[];
}

/**
 * Navigation section structure
 */
export interface NavigationSection {
  title?: string;
  routes: RouteItem[];
}

/**
 * Header configuration
 */
export interface HeaderConfig {
  logo?: {
    src: string;
    alt: string;
    href: string;
  };
  navigation: NavigationSection[];
  actions?: {
    showSearch?: boolean;
    showNotifications?: boolean;
    showUserMenu?: boolean;
  };
}

/**
 * Aside/Sidebar configuration
 */
export interface AsideConfig {
  navigation: NavigationSection[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

/**
 * Footer configuration
 */
export interface FooterConfig {
  sections: NavigationSection[];
  copyright?: string;
  socialLinks?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  }[];
}

/**
 * Complete layout configuration
 */
export interface LayoutConfig {
  type: LayoutType;
  header: HeaderConfig;
  aside?: AsideConfig;
  footer: FooterConfig;
}

/**
 * Layout component props
 */
export interface LayoutProps {
  children: React.ReactNode;
  config: LayoutConfig;
  locale?: string;
}

/**
 * Header dispatcher props
 */
export interface HeaderDispatcherProps {
  layoutType: LayoutType;
  config: HeaderConfig;
  locale?: string;
}

/**
 * Aside dispatcher props
 */
export interface AsideDispatcherProps {
  layoutType: LayoutType;
  config?: AsideConfig;
  locale?: string;
}

/**
 * Footer dispatcher props
 */
export interface FooterDispatcherProps {
  layoutType: LayoutType;
  config: FooterConfig;
  locale?: string;
}
