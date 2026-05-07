# Feature Creation Guide

## Purpose

This guide defines the current standard to add a feature in this template.
It reflects the architecture already implemented in:

- Auth + refresh sessions
- Accounts admin module
- Backoffice search (accounts)
- Contact submissions
- Dynamic pages

## Required Reading Before Starting

- `docs/features/template-baseline-and-feature-migration.md`
- `docs/features/waves-workflow.md`
- `docs/features/bff-architecture.md`
- `docs/features/domain-models.md`
- `docs/features/domain-fields.md`

## Architecture Pattern

A feature is composed of these layers:

```text
domain-models entity/port
  -> domain-fields config
  -> infra-backend-repositories (TypeORM)
  -> features/{feature}/configuration
  -> features/{feature}/infra/backend
  -> features/{feature}/api
  -> apps/api/{bff}/app.module.ts wiring
  -> apps/client/backoffice pages (if admin feature)
  -> messages (en/es/ca + types)
```

Optional client package:

- Add `features/{feature}/infra/client` only when you need a reusable client SDK in multiple apps.

## Wave-First Planning

Before implementing a non-trivial feature, create or update a wave plan under `docs/waves/`.

Use `docs/features/waves-workflow.md` for the default wave shape:

- scope and ownership,
- contracts and shared domain work,
- backend/API wiring,
- client surfaces,
- tests/docs,
- final cleanup with `pnpm clean`.

Tiny linear fixes can skip wave docs, but feature work should not start as an unbounded chat prompt.

## Step-by-Step

### 1. Create domain entity and port

Path:

- `packages/domain/models/src/entities/{feature}/`

Minimum files:

- `{feature}.entity.ts`
- `{feature}.port.ts`
- `index.ts`

Then export from:

- `packages/domain/models/src/entities/index.ts`

### 2. Create dynamic field config

Path:

- `packages/domain/fields/src/entities/{feature}-entity.config.ts`

Then export from:

- `packages/domain/fields/src/index.ts`

Guideline:

- Use field types already supported by `@piar/infra-client-dynamic-form`.
- For nested content, prefer `FieldType.JSON` with `ui.component = 'json-editor'`.

### 3. Create TypeORM repository package block

Path:

- `packages/infra/backend/repositories/src/{feature}/`

Minimum files:

- `orm.entity.ts`
- `factory.ts`
- `repository.ts`
- `provider.module.ts`
- `index.ts`

Then export from:

- `packages/infra/backend/repositories/src/index.ts`
- `packages/infra/backend/repositories/package.json` (subpath exports if needed)

### 4. Create feature packages

Path:

- `packages/features/{feature}/configuration`
- `packages/features/{feature}/infra/backend`
- `packages/features/{feature}/api`

API package should include:

- DTOs
- Use cases
- Controllers
- Module with `register()` and DI bindings

### 5. Wire feature into BFF(s)

Update:

- `apps/api/backoffice-bff/src/app.module.ts`
- `apps/api/web-bff/src/app.module.ts`

Rules:

- Bind port tokens to concrete repository classes.
- Add repository provider modules to imports.
- Protect admin endpoints using `JwtAuthGuard` + `AdminGuard`.

### 6. Add backoffice UI pages (if needed)

Path:

- `apps/client/backoffice/src/app/[locale]/(dashboard)/{feature}/...`

Standard implementation:

- List page: `DynamicTable`
- Create/edit page: `DynamicForm`
- Data access: app-level hooks (`useDynamicTableResource`, `useDynamicFormResource`)

### 7. Add translation keys

Always update:

- `packages/messages/src/types/*.ts`
- `packages/messages/src/en/*.ts`
- `packages/messages/src/es/*.ts`
- `packages/messages/src/ca/*.ts`

Then build messages package:

```bash
pnpm -C packages/messages build
```

### 8. Update documentation

- Add or update feature docs under `docs/features/`.
- Add or update wave docs under `docs/waves/` when the feature was planned or executed as waves.
- If a new doc is created, update indexes:
  - `docs/README.md`
  - `docs/AI-context.md`

## Quality Gates

Run this minimum set before finishing:

```bash
pnpm -C packages/domain/models typecheck && pnpm -C packages/domain/models build
pnpm -C packages/domain/fields typecheck && pnpm -C packages/domain/fields build
pnpm -C packages/infra/backend/repositories typecheck && pnpm -C packages/infra/backend/repositories build
pnpm -C packages/features/{feature}/configuration typecheck && pnpm -C packages/features/{feature}/configuration build
pnpm -C packages/features/{feature}/infra/backend typecheck && pnpm -C packages/features/{feature}/infra/backend build
pnpm -C packages/features/{feature}/api typecheck && pnpm -C packages/features/{feature}/api build
pnpm -C apps/api/backoffice-bff typecheck && pnpm -C apps/api/backoffice-bff build
pnpm -C apps/api/web-bff typecheck && pnpm -C apps/api/web-bff build
pnpm -C apps/client/backoffice typecheck && pnpm -C apps/client/backoffice build
```

Before final handoff, run:

```bash
pnpm clean
```

## Common Errors to Avoid

- Copying code without updating package exports.
- Forgetting message keys and getting raw `fields.*` labels in UI.
- Using unsupported dynamic form components.
- Updating dependencies without refreshing lockfile.
- Missing role guards in admin endpoints.
- Not enforcing business invariants (for example: minimum one admin account).

## Feature Done Checklist

- [ ] Domain entity/port exported
- [ ] Field config exported
- [ ] TypeORM repository + provider module exported
- [ ] Feature api/configuration/infra wired
- [ ] BFF modules imported and DI bound
- [ ] Backoffice pages integrated (if applicable)
- [ ] EN/ES/CA translations complete
- [ ] Typecheck/build green
- [ ] Docs updated
- [ ] Wave QA or equivalent integration review completed for non-trivial feature work

## Last Updated

7 May 2026 - Added wave-first planning and final cleanup workflow.
