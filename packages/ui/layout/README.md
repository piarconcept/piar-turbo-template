# @piar/layout

Professional layout system with dispatcher pattern for React applications. Provides type-safe, configuration-driven layouts for both public and dashboard interfaces.

## Features

- ✅ **Two layout types**: Public and Dashboard
- ✅ **Type-safe configuration**: Full TypeScript support
- ✅ **Dispatcher pattern**: Component selection based on layout type
- ✅ **Tailwind CSS v4**: Modern utility-first styling
- ✅ **Predefined configurations**: Ready-to-use configs included
- ✅ **Flexible architecture**: Easy to customize and extend
- ✅ **Responsive design**: Mobile-first approach

## Architecture

```
src/
├── types/              # TypeScript types and interfaces
├── config/             # Predefined route configurations
├── header/             # Header components + dispatcher
├── aside/              # Sidebar components + dispatcher
├── footer/             # Footer components + dispatcher
├── layouts/            # PublicLayout & DashboardLayout
├── Layout.tsx          # Main dispatcher component
└── index.ts            # Package exports
```

## Usage

### Public Layout

```tsx
import { Layout, publicHeaderConfig, publicFooterConfig } from '@piar/layout';

function App() {
  return (
    <Layout
      config={{
        type: 'public',
        header: publicHeaderConfig,
        footer: publicFooterConfig,
      }}
    >
      <YourContent />
    </Layout>
  );
}
```

### Dashboard Layout

```tsx
import {
  Layout,
  dashboardHeaderConfig,
  dashboardAsideConfig,
  dashboardFooterConfig,
} from '@piar/layout';

function Dashboard() {
  return (
    <Layout
      config={{
        type: 'dashboard',
        header: dashboardHeaderConfig,
        aside: dashboardAsideConfig,
        footer: dashboardFooterConfig,
      }}
    >
      <DashboardContent />
    </Layout>
  );
}
```

## Components

### Layout Types

- **PublicLayout**: Header + Main Content + Footer
- **DashboardLayout**: Header + (Sidebar + Main Content) + Footer

### Header Components

- **PublicHeader**: Navigation bar with logo, links, user actions
- **DashboardHeader**: Compact header with search, notifications
- **HeaderDispatcher**: Selects header based on layout type

### Aside Components

- **DashboardAside**: Collapsible sidebar with navigation sections
- **AsideDispatcher**: Renders aside only for dashboard

### Footer Components

- **PublicFooter**: Multi-column footer with sections, social links
- **DashboardFooter**: Minimal footer with quick links
- **FooterDispatcher**: Selects footer based on layout type

## Configuration

All configurations are type-safe and fully customizable:

```typescript
import type { LayoutConfig } from '@piar/layout';

const customConfig: LayoutConfig = {
  type: 'public',
  header: {
    logo: { href: '/', alt: 'Company' },
    navigation: [
      {
        title: 'Main',
        routes: [
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
        ],
      },
    ],
    actions: { showUserMenu: true },
  },
  footer: {
    sections: [...],
    copyright: '© 2026 Company',
  },
};
```

## Development

```bash
# Build
pnpm --filter @piar/layout build

# Watch mode
pnpm --filter @piar/layout dev

# Type check
pnpm --filter @piar/layout typecheck
```

## Dependencies

- `react` (peer dependency)
- `@piar/ui-config` - Tailwind CSS v4 configuration

---

**Last Updated:** January 21, 2026
