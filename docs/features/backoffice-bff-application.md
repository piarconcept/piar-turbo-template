# Backoffice BFF Application

## Purpose

`@piar/backoffice-bff` is the admin Backend-for-Frontend API.
It exposes admin-focused endpoints for authentication, account management, search, and content administration.

## Current Scope

Implemented modules:

- Health
- Auth
- Accounts
- Search (accounts collection)
- Contact submissions (admin)
- Dynamic pages (admin)

## Technology

- NestJS 11
- TypeORM (PostgreSQL)
- Shared exception filters from `@piar/infra-backend-common-error`
- Shared security from `@piar/infra-backend-common-security`

## Main Wiring

Root module:

- `apps/api/backoffice-bff/src/app.module.ts`

Core imports currently include:

- `TypeormModule.forRoot()`
- `AuthModule.register(...)`
- `AccountsModule.register(...)`
- `SearchModule.register(...)`
- `ContactSubmissionModule.register(...)`
- `DynamicPageModule.register(...)`

Repository provider modules:

- `AccountRepositoryProviderModule`
- `ContactSubmissionRepositoryProviderModule`
- `DynamicPageRepositoryProviderModule`

## Endpoint Map

### Health

- `GET /health`

### Auth (`/auth`)

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/register`
- `POST /auth/forgot-password`
- `PATCH /auth/roles`

### Accounts (`/accounts`) - Admin protected

- `GET /accounts`
- `GET /accounts/:id`
- `PATCH /accounts/:id`
- `DELETE /accounts/:id`

### Search (`/search`) - Admin protected

- `GET /search?q=...&locale=...&limitPerCollection=...`

### Contact Submissions (`/contact-submissions`) - Admin protected

- `GET /contact-submissions`
- `GET /contact-submissions/:id`
- `PATCH /contact-submissions/:id`
- `DELETE /contact-submissions/:id`

### Dynamic Pages (`/dynamic-pages`) - Admin protected

- `GET /dynamic-pages`
- `GET /dynamic-pages/:id`
- `GET /dynamic-pages/code/:pageCode`
- `GET /dynamic-pages/slug/:slug`
- `POST /dynamic-pages`
- `POST /dynamic-pages/normalize`
- `PATCH /dynamic-pages/:id`
- `DELETE /dynamic-pages/:id`

## Security Model

Admin endpoints use:

- `JwtAuthGuard`
- `AdminGuard`

Business-rule protections implemented in accounts feature use cases and repository layer:

- first account forced to `admin`
- cannot remove last admin
- cannot self-delete from admin account endpoints
- cannot self-demote from admin to user

## Data Access Guardrails

Backoffice list and search endpoints must stay bounded:

- Domain ports expose `list(query)` for paginated reads; they must not expose
  whole-table methods such as `getAll`.
- Accounts endpoint behavior lives in `@piar/accounts-api`; search endpoint
  behavior lives in `@piar/search-api`.
- `apps/api/backoffice-bff` should only register these feature modules and bind
  repository providers.
- Accounts, contact submissions, dynamic pages, and search must apply pagination,
  supported filters, and supported sorting in the TypeORM repository query.
- Search endpoints must request only the configured page/window they need from
  each collection.
- Business-rule existence checks should use `LIMIT 1` or `LIMIT 2` style queries
  when they only need to know whether records exist.

## Environment Variables

Typical required values:

- `PORT` (default backoffice-bff runtime target)
- `DATABASE_URL` (PostgreSQL)
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `JWT_REFRESH_EXPIRES_IN`
- backoffice CORS origin variables from app config

## Development Commands

```bash
pnpm -C apps/api/backoffice-bff typecheck
pnpm -C apps/api/backoffice-bff build
pnpm -C apps/api/backoffice-bff dev
```

## Validation

Before release, validate together with dependencies:

```bash
pnpm -C packages/infra/backend/repositories typecheck && pnpm -C packages/infra/backend/repositories build
pnpm -C packages/features/auth/api typecheck && pnpm -C packages/features/auth/api build
pnpm -C packages/features/accounts/api typecheck && pnpm -C packages/features/accounts/api build
pnpm -C packages/features/search/api typecheck && pnpm -C packages/features/search/api build
pnpm -C packages/features/contact/api typecheck && pnpm -C packages/features/contact/api build
pnpm -C packages/features/dynamic-page/api typecheck && pnpm -C packages/features/dynamic-page/api build
pnpm -C apps/api/backoffice-bff typecheck && pnpm -C apps/api/backoffice-bff build
```

## Last Updated

7 June 2026 - Documented accounts/search feature API package ownership.
