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
- **next-intl** for i18n (multi-language support)
- **NextAuth.js v5** for authentication
- **lucide-react** for icons
- **@piar/layout** for layouts
- **@piar/ui-components** for shared components

## Authentication

This app uses **NextAuth.js v5** for authentication with JWT sessions.

**Key Features:**

- ✅ Credentials provider (email/password)
- ✅ JWT sessions (24-hour duration)
- ✅ Route protection via middleware
- ✅ Session persistence
- ✅ Integration with backoffice-bff

**Quick Start:**

1. Copy `.env.example` to `.env.local`
2. Configure environment variables (see below)
3. Start backoffice-bff on port 5050
4. Start this app and visit `/login`

**Documentation:** See [docs/features/nextauth-authentication.md](../../../docs/features/nextauth-authentication.md) for complete implementation details.

## Environment Variables

Required in `.env.local`:

```bash
# Backoffice BFF URL
NEXT_PUBLIC_BACKOFFICE_BFF_URL=http://localhost:5050

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3001
```

## Related Documentation

- **Authentication**: [docs/features/nextauth-authentication.md](../../../docs/features/nextauth-authentication.md)
- Layout Package: [packages/ui/layout/README.md](../../../packages/ui/layout/README.md)
- BFF Architecture: [docs/features/bff-architecture.md](../../../docs/features/bff-architecture.md)
- Backoffice BFF: [docs/features/backoffice-bff-application.md](../../../docs/features/backoffice-bff-application.md)

---

**Built with ❤️ by [Piar Concept](https://piarconcept.com)**
