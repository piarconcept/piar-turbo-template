# Web BFF Application

## Purpose

`@piar/web-bff` is the public-site Backend-for-Frontend API.
It exposes web-safe endpoints for public interactions and content retrieval.

## Current Scope

Implemented modules:

- Health
- Public contact submissions
- Public dynamic page retrieval

## Technology

- NestJS 11
- TypeORM (PostgreSQL)
- Shared exception filters from `@piar/infra-backend-common-error`

## Main Wiring

Root module:

- `apps/api/web-bff/src/app.module.ts`

Core imports currently include:

- `TypeormModule.forRoot()`
- `WebContactSubmissionModule.register(...)`
- `WebDynamicPageModule.register(...)`
- `ContactSubmissionRepositoryProviderModule`
- `DynamicPageRepositoryProviderModule`

## Endpoint Map

### Health

- `GET /health`

### Public Contact Submissions (`/contact-submissions`)

- `POST /contact-submissions`

### Public Dynamic Pages (`/dynamic-pages`)

- `GET /dynamic-pages/slug/:slug`

Query parameters in dynamic page endpoint:

- `active` (default true)
- `public` (default true)
- `status` (default published)

## Notes on Data Filtering

Public dynamic page retrieval applies filtering for:

- active flag
- public visibility flag
- publication status

This keeps draft or private content out of public API responses by default.

## Environment Variables

Typical required values:

- `PORT`
- `DATABASE_URL`
- web CORS origin variable from app config

## Development Commands

```bash
pnpm -C apps/api/web-bff typecheck
pnpm -C apps/api/web-bff build
pnpm -C apps/api/web-bff dev
```

## Validation

```bash
pnpm -C packages/infra/backend/repositories typecheck && pnpm -C packages/infra/backend/repositories build
pnpm -C packages/features/contact/api typecheck && pnpm -C packages/features/contact/api build
pnpm -C packages/features/dynamic-page/api typecheck && pnpm -C packages/features/dynamic-page/api build
pnpm -C apps/api/web-bff typecheck && pnpm -C apps/api/web-bff build
```

## Last Updated

23 February 2026 - Updated from initial scaffold to current public modules.
