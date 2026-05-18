# Template Baseline and Feature Migration Guide

## Purpose

This document is the practical baseline for extending the template after the recent integration work.
Use it when copying features from `piar-concept-platform` into this repository.

It answers:

- What is already integrated and working.
- What must be wired for a feature to be production-ready.
- Common mistakes found during migration and the correct implementation.

## Current Baseline (February 2026)

### Backoffice Client (`apps/client/backoffice`)

Implemented and accessible in dashboard:

- `/<locale>/dashboard`
- `/<locale>/accounts`
- `/<locale>/accounts/[id]`
- `/<locale>/search`
- `/<locale>/contact-submissions`
- `/<locale>/contact-submissions/[id]`
- `/<locale>/dynamic-pages`
- `/<locale>/dynamic-pages/new`
- `/<locale>/dynamic-pages/[id]`
- `/<locale>/profile`

Authentication pages:

- `/<locale>/login`
- `/<locale>/register`
- `/<locale>/forgot-password`
- `/<locale>/unauthorized`

### Backoffice BFF (`apps/api/backoffice-bff`)

Integrated modules:

- `HealthModule`
- `AuthModule`
- `AccountsModule`
- `SearchModule`
- `ContactSubmissionModule`
- `DynamicPageModule`

### Web BFF (`apps/api/web-bff`)

Integrated modules:

- `HealthModule`
- `WebContactSubmissionModule`
- `WebDynamicPageModule`

### Domain and Infra already aligned

- Domain entities:
  - `account`
  - `contact-submission`
  - `dynamic-page`
- Domain fields configs:
  - `accountEntityFieldsConfig`
  - `contactSubmissionEntityFieldsConfig`
  - `dynamicPageEntityFieldsConfig`
- Repositories (TypeORM):
  - `AccountRepository`
  - `ContactSubmissionRepository`
  - `DynamicPageRepository`

## Implemented API Surface

### Auth (`/auth`)

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/register`
- `POST /auth/forgot-password`
- `PATCH /auth/roles`

### Accounts (`/accounts`) - Admin only

- `GET /accounts`
- `GET /accounts/:id`
- `PATCH /accounts/:id`
- `DELETE /accounts/:id`

### Backoffice Search (`/search`) - Admin only

- `GET /search?q=...`

Current scope:

- Searches only in `accounts` collection.

### Contact Submissions

Backoffice (admin):

- `GET /contact-submissions`
- `GET /contact-submissions/:id`
- `PATCH /contact-submissions/:id`
- `DELETE /contact-submissions/:id`

Web (public):

- `POST /contact-submissions`

### Dynamic Pages

Backoffice (admin):

- `GET /dynamic-pages`
- `GET /dynamic-pages/:id`
- `GET /dynamic-pages/code/:pageCode`
- `GET /dynamic-pages/slug/:slug`
- `POST /dynamic-pages`
- `POST /dynamic-pages/normalize`
- `PATCH /dynamic-pages/:id`
- `DELETE /dynamic-pages/:id`

Web (public):

- `GET /dynamic-pages/slug/:slug`

## Critical Business Rules Already Enforced

### Accounts and roles

- The first created account is always `admin`.
- The system must always keep at least one admin account.
- An admin cannot delete their own account from backoffice admin endpoints.
- An admin cannot demote their own role from admin to user.

### Session model

- Access token + refresh token flow is implemented.
- NextAuth refreshes access tokens via `POST /auth/refresh` when expired.
- If refresh fails, session is invalidated and user must authenticate again.

## Standard Feature Implementation Pattern

Plan non-trivial migrations as waves before copying code. Use `docs/features/waves-workflow.md` and `docs/waves/README.md` to split ownership, integration, QA, and cleanup.

For each new business feature, implement in this order:

1. Domain model and port

- Add entity and port in `packages/domain/models/src/entities/{feature}`.
- Export from `packages/domain/models/src/entities/index.ts`.

2. Dynamic field config

- Add config in `packages/domain/fields/src/entities/{feature}-entity.config.ts`.
- Export from `packages/domain/fields/src/index.ts`.

3. TypeORM repository

- Add `orm.entity.ts`, `factory.ts`, `repository.ts`, `provider.module.ts` in:
  - `packages/infra/backend/repositories/src/{feature}`.
- Export from `packages/infra/backend/repositories/src/index.ts`.
- Add subpath export in `packages/infra/backend/repositories/package.json` if needed.

4. Feature packages

- `packages/features/{feature}/configuration`
- `packages/features/{feature}/infra/backend`
- `packages/features/{feature}/api`
- Optional: `packages/features/{feature}/infra/client`

5. BFF wiring

- Register module in `apps/api/backoffice-bff/src/app.module.ts` and/or `apps/api/web-bff/src/app.module.ts`.
- Inject proper port binding using repository class.

6. Backoffice pages

- Add list/detail/create pages under:
  - `apps/client/backoffice/src/app/[locale]/(dashboard)/{feature}`.
- Use `DynamicTable` + `DynamicForm` with shared hooks.

7. i18n

- Add/update translation keys in:
  - `packages/messages/src/types/*.ts`
  - `packages/messages/src/en/*.ts`
  - `packages/messages/src/es/*.ts`
  - `packages/messages/src/ca/*.ts`

8. Documentation

- Update relevant docs in `docs/features`.
- Update wave docs in `docs/waves` when the migration used staged or multi-agent execution.
- Update `docs/README.md` and `docs/AI-context.md` when adding new docs.

## Common Migration Mistakes and Correct Approach

### Mistake 1: Copy feature code without exports

Symptom:

- Imports resolve in source but fail in template.

Correct approach:

- Always update `index.ts` exports for domain, fields, repositories, and feature package entrypoints.

### Mistake 2: UI shows raw translation keys

Symptom:

- Labels like `fields.dynamicPage.slug.label` rendered as text.

Correct approach:

- Add message keys in `types` and all locales before wiring pages.
- Rebuild `@piar/messages` after changing message types.

### Mistake 3: Using unsupported field component types in DynamicForm

Symptom:

- Custom field blocks do not render.

Correct approach:

- Use currently supported field types/components.
- For complex nested structures, use `FieldType.JSON` with `json-editor` until a custom renderer is added.

### Mistake 4: Workspace packages added but lockfile not refreshed

Symptom:

- Module resolution errors from BFF/client apps.

Correct approach:

- Run `pnpm install --lockfile-only` after dependency graph changes.
- Then run targeted build/typecheck.

### Mistake 5: Breaking admin invariants

Symptom:

- Last admin can be removed or self-demoted.

Correct approach:

- Keep checks at repository/service level.
- Enforce at both API and repository side when possible.

### Mistake 6: Loading whole tables for admin lists or search

Symptom:

- A controller, use case, adapter, or repository calls a whole-collection method
  and then filters, sorts, searches, or paginates in memory.

Correct approach:

- Domain ports must expose `list(query)` for collection reads.
- TypeORM repositories must apply `skip`, `take`, search, filters, and sorting
  in SQL using allowlisted columns.
- Search endpoints should request only the limited result window they need.
- Existence checks should use bounded queries instead of full counts when they
  only need to know whether any or multiple records exist.
- Do not add new `getAll` methods to controllers, use cases, adapters, ports, or
  repositories.

## Validation Checklist (Required)

Run after each feature migration:

```bash
pnpm -C packages/domain/models typecheck && pnpm -C packages/domain/models build
pnpm -C packages/domain/fields typecheck && pnpm -C packages/domain/fields build
pnpm -C packages/infra/backend/repositories typecheck && pnpm -C packages/infra/backend/repositories build

pnpm -C packages/features/{feature}/configuration typecheck && pnpm -C packages/features/{feature}/configuration build
pnpm -C packages/features/{feature}/infra/backend typecheck && pnpm -C packages/features/{feature}/infra/backend build
pnpm -C packages/features/{feature}/api typecheck && pnpm -C packages/features/{feature}/api build

pnpm -C packages/messages typecheck && pnpm -C packages/messages build

pnpm -C apps/api/backoffice-bff typecheck && pnpm -C apps/api/backoffice-bff build
pnpm -C apps/api/web-bff typecheck && pnpm -C apps/api/web-bff build
pnpm -C apps/client/backoffice typecheck && pnpm -C apps/client/backoffice build
```

Before final handoff:

```bash
pnpm clean
```

## Source-to-Template Copy Rules

When copying from `piar-concept-platform`:

- Copy source code only.
- Do not copy `node_modules`, `build`, `dist`, `.turbo`, `.next`, `out`, `coverage`.
- Adapt imports and app wiring, do not assume plug-and-play.
- Prioritize matching contracts (ports, DTOs, entity props) over line-by-line code parity.

## Definition of Done for a Feature

A feature is done only if all are true:

- Endpoints compile and run in the correct BFF.
- Repository is persistent (TypeORM) and not mock/in-memory.
- Backoffice pages work with real API calls.
- i18n labels are complete for EN/ES/CA.
- Typecheck and build pass for packages and apps.
- Documentation updated.
- Wave QA or equivalent integration review completed for non-trivial migrations.
- `pnpm clean` passes or any blocker is documented.

## Last Updated

8 May 2026 - Added bounded collection-query rules for list and search endpoints.
