# Migration Context: `piar-concept-platform` -> `piar-turbo-template`

## Scope

This document captures the migration relationship between:

- Source repository:
  - `/Users/polribasrovira/Documents/piar-concept/company/repositories/piar-concept-platform`
- Target repository (this workspace):
  - `/Users/polribasrovira/Documents/piar-concept/temp/piar-turbo-template`

For the authoritative implementation baseline, use:

- `docs/features/template-baseline-and-feature-migration.md`

## Why this exists

Both repositories started from the same template, but `piar-concept-platform` evolved faster.
The goal is to keep this template close to real production patterns so new products can be created faster with less adaptation.

## Current Migration Outcome

Already integrated in template:

- Auth with refresh token flow
- Accounts admin module
- Backoffice search (accounts)
- Contact submissions (public web + admin backoffice)
- Dynamic pages (public web + admin backoffice)
- Backoffice profile page with logout
- Account repository migrated to real TypeORM persistence

## Migration Rules

When copying from source to template:

- Copy source files only.
- Never copy build/runtime artifacts:
  - `node_modules`
  - `dist`
  - `.turbo`
  - `.next`
  - `coverage`
- Always adapt DI wiring, exports, and message keys.
- Validate with typecheck/build at package and app level.

## Common Pitfalls Found During Migration

1. Missing exports

- New folders copied but not exported in package entrypoints.

2. Missing message keys

- UI shows raw translation keys instead of labels.

3. Unsupported custom field components

- Dynamic forms break if field type does not match available renderers.

4. Dependency graph not refreshed

- New workspace package imports fail until lockfile/dependency metadata is updated.

5. Business invariants not guarded

- Admin safety rules must be enforced at service/repository level.

## Recommended Workflow

1. Domain entities and ports
2. Field configs
3. TypeORM repositories + provider modules
4. Feature packages (`configuration`, `infra/backend`, `api`)
5. BFF wiring
6. Backoffice pages
7. i18n updates
8. Documentation updates
9. Full validation commands

Detailed checklist:

- `docs/features/template-baseline-and-feature-migration.md`

## Last Updated

23 February 2026 - Synced with current integrated feature set and migration standards.
