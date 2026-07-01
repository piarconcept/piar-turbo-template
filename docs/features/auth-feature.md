# Auth Feature

## Purpose

The `auth` feature provides authentication for backoffice flows, including:

- Login with credentials
- Session refresh with refresh token
- Registration
- Forgot password (placeholder response)
- Admin role updates

It is integrated in `apps/api/backoffice-bff`.

## Package Structure

```text
packages/features/auth/
├── configuration/          # contracts and request/response types
├── infra/
│   ├── backend/            # AuthRepository implementation
│   └── client/             # HttpAuthRepository for Next.js clients
└── api/                    # NestJS controllers, use-cases, module wiring
```

## Main Endpoints

Base path: `/auth`

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/register`
- `POST /auth/forgot-password`
- `PATCH /auth/roles`

## Session Model

### Access token

- Signed JWT with `tokenType: 'access'`
- Expiration configured by `JWT_EXPIRES_IN` (default `1h`)

### Refresh token

- Signed JWT with `tokenType: 'refresh'`
- Expiration configured by `JWT_REFRESH_EXPIRES_IN` (default `30d`)
- Returned when `rememberMe` is true at login
- Used by `POST /auth/refresh`

### Refresh behavior

- Valid refresh token generates a new access token.
- Refresh may also rotate refresh token.
- Invalid refresh token returns auth error (`invalid_refresh_token`).

## Integration with Backoffice Client

`apps/client/backoffice/src/auth.ts` uses `@piar/auth-infra-client`:

- `login` on sign-in
- automatic token refresh in NextAuth `jwt` callback when access token expires
- session invalidation when refresh fails

## Important Business Rules (Current Implementation)

Even though they live in account feature use cases and repository behavior, they directly affect auth flows:

- The first registered account is forced to `admin`.
- The platform must keep at least one admin account.
- Self-demotion and self-delete are blocked from admin account management endpoints.

## Environment Variables

- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `JWT_REFRESH_EXPIRES_IN`
- `NEXT_PUBLIC_BACKOFFICE_BFF_URL` (client-side auth repository)
- `NEXTAUTH_SECRET`

## Wiring in Backoffice BFF

`AuthModule.register(...)` is imported in:

- `apps/api/backoffice-bff/src/app.module.ts`

with `AccountPort` bound to `AccountRepository`.

## Operational Notes

- `forgot-password` is currently a placeholder flow.
- Role update endpoint should stay admin-protected at the BFF/security layer.
- Keep auth DTOs and configuration package types aligned.

## Verification Commands

```bash
pnpm -C packages/features/auth/configuration typecheck && pnpm -C packages/features/auth/configuration build
pnpm -C packages/features/auth/infra/backend typecheck && pnpm -C packages/features/auth/infra/backend build
pnpm -C packages/features/auth/infra/client typecheck && pnpm -C packages/features/auth/infra/client build
pnpm -C packages/features/auth/api typecheck && pnpm -C packages/features/auth/api build
pnpm -C apps/api/backoffice-bff typecheck && pnpm -C apps/api/backoffice-bff build
pnpm -C apps/client/backoffice typecheck && pnpm -C apps/client/backoffice build
```

## Last Updated

7 June 2026 - Updated account business-rule ownership after feature package refactor.
