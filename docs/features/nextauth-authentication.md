# NextAuth Authentication (Backoffice)

## Purpose

Document the current NextAuth integration in `apps/client/backoffice`.

This setup authenticates against `backoffice-bff`, stores JWT session data, and refreshes expired access tokens using backend refresh tokens.

## Current Status

- Credentials sign-in integrated with `POST /auth/login`.
- Refresh token flow integrated with `POST /auth/refresh`.
- Route protection via middleware.
- Admin-only access for dashboard area.
- Profile page with session information and logout.

## Key Files

- `apps/client/backoffice/src/auth.ts`
- `apps/client/backoffice/src/middleware.ts`
- `apps/client/backoffice/src/types/next-auth.d.ts`
- `apps/client/backoffice/src/components/providers/session-provider.tsx`
- `apps/client/backoffice/src/app/[locale]/(public)/(auth)/login/page.tsx`
- `apps/client/backoffice/src/app/[locale]/(public)/(auth)/register/page.tsx`
- `apps/client/backoffice/src/app/[locale]/(dashboard)/profile/page.tsx`

## Auth Flow

1. User submits credentials in login page.
2. NextAuth credentials provider calls `HttpAuthRepository.login(...)`.
3. BFF returns account + auth session (`token`, `expiresAt`, optional refresh fields).
4. NextAuth stores token payload in JWT callback.
5. On each JWT callback, if access token is expired and refresh token exists:
   - call `HttpAuthRepository.refresh(...)`
   - replace access token and expiry
   - update refresh token data when provided
6. If refresh fails, session is invalidated.

## Middleware Rules

Implemented in `apps/client/backoffice/src/middleware.ts`:

- API routes (`/api/*`) bypass i18n/auth middleware.
- Public pages allowed without session:
  - `/`
  - `/login`
  - `/register`
  - `/forgot-password`
  - `/unauthorized`
- Protected routes require valid session.
- Dashboard routes additionally require `session.user.role === 'admin'`.

## Session Shape

Custom NextAuth types include:

- `session.user.id`
- `session.user.email`
- `session.user.role`
- `session.accessToken`

JWT token stores:

- `id`, `email`, `role`
- `accessToken`
- `refreshToken` (optional)
- `expiresAt` (ms)
- `refreshExpiresAt` (ms)

## Logout

Two logout paths are in use:

- profile page action (`signOut({ redirect: false })` + explicit redirect)
- shared logout button component (`signOut({ callbackUrl: '/login' })`)

Both are valid; prefer one strategy per page for consistency.

## Required Environment Variables

- `NEXT_PUBLIC_BACKOFFICE_BFF_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## Security Notes

- Access control is enforced both in middleware and server-side page/layout checks.
- Dashboard layout performs server-side role check before rendering private area.
- Refresh token must never be exposed in UI responses.

## Verification

```bash
pnpm -C apps/client/backoffice typecheck
pnpm -C apps/client/backoffice build
```

Manual checks:

- login success and redirect
- refresh after token expiry
- unauthorized redirect for non-admin
- logout clears session and redirects to login

## Last Updated

23 February 2026 - Updated with token refresh flow, middleware behavior, and profile route.
