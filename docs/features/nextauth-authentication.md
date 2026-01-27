# NextAuth Authentication Feature

## Purpose

Document the NextAuth.js implementation in the backoffice application for secure authentication and session management.

## Status

- [x] Completed - Initial implementation
- [x] Configuration files created
- [x] Login page with form
- [x] Session management
- [x] Route protection middleware
- [x] Logout functionality
- [ ] Pending - Testing with running BFF
- [ ] Pending - Production deployment

## Key Decisions

### Technology Choice

- **NextAuth.js v5.0.0-beta.25**: Chosen for Next.js 15 App Router compatibility
- **JWT Strategy**: Stateless sessions, no database required
- **Credentials Provider**: Email/password authentication via backoffice-bff
- **24-hour Session**: Balance between security and user experience

### Architecture Decisions

1. **BFF Integration**: Authentication delegated to backoffice-bff for centralized auth logic
2. **Combined Middleware**: Single middleware handles both i18n and auth
3. **Client Provider**: SessionProvider at root layout for useSession() hook access
4. **Public Routes**: Explicit whitelist of paths that don't require authentication
5. **TypeScript Extensions**: Custom types for session fields (id, role, accessToken)

## Technical Details

### Architecture

```
Client (Backoffice) → NextAuth → Backoffice BFF /auth/login
                ↓
           JWT Session (24h)
                ↓
         Protected Routes
```

### Authentication Flow

1. User visits protected route (e.g., `/dashboard`)
2. Middleware checks session
3. No session → redirect to `/login?callbackUrl=/dashboard`
4. User submits credentials
5. NextAuth calls BFF `/auth/login`
6. BFF validates and returns user + accessToken
7. NextAuth creates JWT session
8. User redirected to callbackUrl
9. Session persists in cookie for 24 hours

### File Structure

```
apps/client/backoffice/
├── src/
│   ├── auth.ts                          # NextAuth configuration
│   ├── middleware.ts                    # Route protection + i18n
│   ├── types/next-auth.d.ts            # TypeScript extensions
│   ├── app/api/auth/[...nextauth]/     # API route handler
│   ├── app/[locale]/(public)/(auth)/   # Login/register pages
│   ├── components/providers/           # SessionProvider
│   └── components/auth/                # Logout button
├── .env.example                         # Environment variables
├── NEXTAUTH.md                          # Detailed documentation
└── package.json                         # Dependencies
```

### Dependencies

```json
{
  "dependencies": {
    "next-auth": "^5.0.0-beta.25"
  }
}
```

### Environment Variables

```bash
NEXT_PUBLIC_BACKOFFICE_BFF_URL=http://localhost:5050
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3001
```

## Usage

### Client Component - useSession Hook

```typescript
'use client';
import { useSession } from 'next-auth/react';

export function MyComponent() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;

  return <div>Welcome {session.user.email}</div>;
}
```

### Server Component - auth() Function

```typescript
import { auth } from '@/auth';

export default async function MyPage() {
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;
  return <div>Welcome {session.user.email}</div>;
}
```

### Sign In

```typescript
import { signIn } from 'next-auth/react';

await signIn('credentials', {
  email: 'user@example.com',
  password: 'password',
  redirect: false,
});
```

### Sign Out

```typescript
import { signOut } from 'next-auth/react';

await signOut({ callbackUrl: '/login' });
```

### API Calls with Token

```typescript
const { data: session } = useSession();

const response = await fetch('/api/endpoint', {
  headers: {
    Authorization: `Bearer ${session?.accessToken}`,
  },
});
```

## Configuration

### Main Config (`src/auth.ts`)

- **Provider**: Credentials with email/password
- **Authorize**: Calls backoffice-bff `/auth/login`
- **JWT Callback**: Adds user data to token
- **Session Callback**: Exposes token data in session
- **Pages**: Custom sign-in at `/login`
- **Session**: JWT strategy, 24-hour maxAge

### Middleware (`src/middleware.ts`)

- **Public Paths**: `/login`, `/register`, `/forgot-password`
- **Protected**: Everything else (except `/api/*`)
- **Flow**: Apply i18n → check auth → redirect if needed
- **Redirect**: Preserves `callbackUrl` for post-login navigation

### TypeScript Types (`src/types/next-auth.d.ts`)

Extended NextAuth modules:

- **User**: id, email, name, role, accessToken
- **Session**: user object + accessToken at root
- **JWT**: id, email, role, accessToken

## Pages & Components

### Login Page

- **Location**: `src/app/[locale]/(public)/(auth)/login/page.tsx`
- **Type**: Client component ('use client')
- **Features**:
  - Email and password inputs
  - Remember me checkbox
  - Forgot password link
  - Register link
  - Error handling
  - Loading state
  - Redirect to callbackUrl after successful login

### Dashboard Page

- **Location**: `src/app/[locale]/(dashboard)/home/page.tsx`
- **Type**: Client component
- **Features**:
  - Display user session info (email, name, role, id)
  - Logout button
  - Loading state while checking session

### Logout Button

- **Location**: `src/components/auth/logout-button.tsx`
- **Type**: Client component
- **Features**:
  - Calls signOut() with redirect to /login
  - Icon + text button
  - Uses @piar/ui-components Button

## Testing Checklist

Before testing:

- [ ] Backoffice BFF running on port 5050
- [ ] BFF `/auth/login` endpoint implemented
- [ ] Environment variables configured
- [ ] Dependencies installed (`pnpm install`)
- [ ] Messages package built (`pnpm turbo build --filter=@piar/messages`)

Test scenarios:

- [ ] Visit `/dashboard` without auth → redirects to `/login`
- [ ] Login with valid credentials → redirects to dashboard
- [ ] Login with invalid credentials → shows error
- [ ] Session persists on page refresh
- [ ] Dashboard shows correct user info
- [ ] Logout button works → clears session and redirects
- [ ] Try accessing protected route after logout → redirects to login
- [ ] Login with callbackUrl → redirects to original page after login

## Security Features

### Built-in

- ✅ CSRF protection (NextAuth default)
- ✅ HTTP-only cookies (JWT stored securely)
- ✅ Secure session handling
- ✅ Route-level protection
- ✅ Token-based API authentication

### To Implement

- [ ] Rate limiting on login endpoint
- [ ] Account lockout after failed attempts
- [ ] Session expiry warnings
- [ ] Token refresh mechanism
- [ ] Role-based access control (RBAC)
- [ ] Audit logging
- [ ] MFA support

## Translations

### Added to @piar/messages

Login page translations in English, Spanish, and Catalan:

- `auth.login.loading` - "Signing in..." / "Iniciando sesión..." / "Iniciant sessió..."
- `auth.login.error` - "Invalid email or password..." error messages

## Related Documentation

- [NEXTAUTH.md](../../apps/client/backoffice/NEXTAUTH.md) - Detailed implementation guide
- [Backoffice BFF](./backoffice-bff-application.md) - Backend API documentation
- [Error Handling System](./error-handling-system.md) - Error handling patterns
- [NextAuth.js v5 Docs](https://next-auth.js.org/) - Official documentation

## Notes

- **Beta Version**: Using NextAuth v5 beta for Next.js 15 App Router support
- **No Git Operations**: As requested by user, no git commits were made
- **BFF Dependency**: Authentication requires backoffice-bff to be running
- **Production Ready**: After testing, only need to change NEXTAUTH_SECRET for production

## Next Steps

1. Test authentication flow with running BFF
2. Verify session persistence and expiry
3. Test logout functionality
4. Implement password reset flow
5. Add registration flow
6. Implement token refresh mechanism
7. Add role-based route protection

## Last Updated

21 January 2026 - Initial NextAuth implementation completed
