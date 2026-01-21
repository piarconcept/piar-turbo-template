// Main Layout Component
export { Layout as default, Layout } from './Layout';

// Layout Types
export { PublicLayout, DashboardLayout } from './layouts';

// Component Dispatchers
export { HeaderDispatcher } from './header';
export { AsideDispatcher } from './aside';
export { FooterDispatcher } from './footer';

// Individual Components
export { PublicHeader, DashboardHeader } from './header';
export { DashboardAside } from './aside';
export { PublicFooter, DashboardFooter } from './footer';

// Types and Interfaces
export type {
  LayoutType,
  RouteItem,
  NavigationSection,
  HeaderConfig,
  AsideConfig,
  FooterConfig,
  LayoutConfig,
  LayoutProps,
  HeaderDispatcherProps,
  AsideDispatcherProps,
  FooterDispatcherProps,
} from './types';

// Predefined Configurations
export {
  publicHeaderConfig,
  publicFooterConfig,
  dashboardHeaderConfig,
  dashboardAsideConfig,
  dashboardFooterConfig,
} from './config';
