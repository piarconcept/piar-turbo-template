# Backoffice App (@piar/backoffice)

## Overview

The backoffice application uses **route groups** to separate authentication and private areas with different layouts.

## Structure

```
src/app/[locale]/
├── layout.tsx              # Root layout (font, i18n)
├── page.tsx                # Root page (redirects to /login)
├── (auth)/                 # 🔓 Public area - Authentication
│   ├── layout.tsx          # Uses public layout (same as web)
│   └── login/
│       └── page.tsx        # Login page
└── (dashboard)/            # 🔒 Private area - Admin dashboard
    ├── layout.tsx          # Uses dashboard layout (with sidebar)
    ├── page.tsx            # Dashboard home
    ├── users/
    │   └── page.tsx        # Users management
    ├── content/
    │   └── page.tsx        # Content management
    └── settings/
        └── page.tsx        # Settings
```

## Route Groups

### (auth) - Public Authentication Area

**Purpose**: Handles user authentication (login, register, forgot password, etc.)

**Layout**: Uses `public` layout type from `@piar/layout`
- Same visual design as the main website
- Maintains brand consistency
- No authentication required

**Routes**:
- `/login` - User login page
- Future: `/register`, `/forgot-password`, etc.

### (dashboard) - Private Admin Area

**Purpose**: Admin panel for managing users, content, and settings

**Layout**: Uses `dashboard` layout type from `@piar/layout`
- Collapsible sidebar navigation
- Compact header with search
- Minimal footer

**Routes**:
- `/dashboard` - Overview with stats and recent activity
- `/dashboard/users` - User management table
- `/dashboard/content` - Content management cards
- `/dashboard/settings` - Application settings

## Development

```bash
# Start dev server (port 3030)
pnpm --filter @piar/backoffice dev

# Build for production
pnpm turbo build --filter=@piar/backoffice

# Type check
pnpm --filter @piar/backoffice typecheck
```

## URLs

- Root: http://localhost:3030 (redirects to /login)
- Login: http://localhost:3030/login
- Dashboard: http://localhost:3030/dashboard

## Tech Stack

- **Next.js 16** with App Router
- **React 19**
- **TypeScript 5.9**
- **Tailwind CSS v4**
- **next-intl** for i18n
- **lucide-react** for icons
- **@piar/layout** for layouts

## Related Documentation

- Layout Package: `packages/ui/layout/README.md`
- BFF Architecture: `docs/features/bff-architecture.md`

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
