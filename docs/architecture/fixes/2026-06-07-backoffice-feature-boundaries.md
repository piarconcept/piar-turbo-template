# Backoffice Feature Boundaries

## Summary

Backoffice account administration and search were implemented inside
`apps/api/backoffice-bff/src`. That made the BFF app own feature controllers,
use cases, DTOs, and module setup directly instead of consuming feature API
packages.

## Date

2026-06-07

## Status

- [x] Resolved
- [ ] Follow-up needed

## Architecture Scope

- Apps or packages:
  - `apps/api/backoffice-bff`
  - `packages/features/accounts/api`
  - `packages/features/search/api`
- Layers or boundaries involved:
  - BFF app wiring
  - feature API packages
  - NestJS module registration
  - domain repository port binding
- Contracts, schemas, persistence, or build concerns:
  - backoffice account endpoints
  - backoffice search endpoint
  - workspace package dependency graph

## Symptoms

- `accounts` and `search` lived as local folders under the backoffice BFF app.
- Account administration used a local service instead of feature-owned use cases.
- The BFF app had implementation ownership for feature code that should be
  reusable and package-scoped.

## Impact

- New features could copy the wrong app-local pattern.
- Feature implementation code was harder to test, build, and reason about as an
  independent package.
- `apps/api/backoffice-bff` mixed orchestration with feature behavior, weakening
  the Clean Architecture conventions documented for the template.

## Why This Was Architectural

The issue was a package-boundary violation. The endpoints worked, but the code
was located in the wrong layer: app folders should wire feature modules, while
feature packages should own controllers, DTOs, use cases, and module providers.

## Root Cause

Accounts and search were integrated before their API-layer packages existed, so
the fastest path placed their NestJS modules directly in the BFF app. That local
structure stayed after the template standardized feature packages.

## Resolution

- Added `@piar/accounts-api` at `packages/features/accounts/api`.
- Added account use cases for list, get, update, and delete flows.
- Added `@piar/search-api` at `packages/features/search/api`.
- Moved the backoffice search controller, types, use case, and module into the
  search feature package.
- Updated `apps/api/backoffice-bff` to import `AccountsModule.register(...)` and
  `SearchModule.register(...)`.
- Deleted the local `apps/api/backoffice-bff/src/accounts` and
  `apps/api/backoffice-bff/src/search` feature implementation folders.

## Verification

- Tests added or updated:
  - Added account use-case tests in
    `packages/features/accounts/api/tests/accounts.use-cases.test.ts`.
  - Added search use-case tests in
    `packages/features/search/api/tests/search-backoffice.use-case.test.ts`.
- Commands run:
  - `pnpm install --lockfile-only`
  - `pnpm install --ignore-scripts`
  - `pnpm --filter @piar/accounts-api typecheck`
  - `pnpm --filter @piar/accounts-api build`
  - `pnpm --filter @piar/accounts-api test`
  - `pnpm --filter @piar/search-api typecheck`
  - `pnpm --filter @piar/search-api build`
  - `pnpm --filter @piar/search-api test`
  - `pnpm -C apps/api/backoffice-bff typecheck`
  - `pnpm -C apps/api/backoffice-bff build`
  - `pnpm format`
  - `pnpm clean`
- Manual verification:
  - Searched the repository for old local accounts/search imports and
    app-local implementation paths.
  - Confirmed `pnpm clean` completed successfully and left the worktree
    artifact-free.

## Guardrails

- Backoffice feature implementation code should live under
  `packages/features/{feature}/api`.
- BFF app modules should only register feature modules and bind infrastructure
  providers.
- New backoffice modules should expose `register(...)` so app wiring remains
  explicit.
- Account and search endpoint behavior must remain bounded through
  `AccountPort.list(...)`.

## Cross-References

- Related feature docs:
  - `docs/features/bff-architecture.md`
  - `docs/features/backoffice-bff-application.md`
  - `docs/features/creating-features-guide.md`
  - `docs/features/template-baseline-and-feature-migration.md`
- Related wave docs:
  - `docs/waves/2026-06-07/README.md`
- Related learning-log entries:
  - None.
- Relevant files:
  - `packages/features/accounts/api/src/modules/accounts.module.ts`
  - `packages/features/accounts/api/src/controllers/accounts.controller.ts`
  - `packages/features/accounts/api/src/use-cases`
  - `packages/features/search/api/src/modules/search.module.ts`
  - `packages/features/search/api/src/controllers/search.controller.ts`
  - `packages/features/search/api/src/use-cases/search-backoffice.use-case.ts`
  - `apps/api/backoffice-bff/src/app.module.ts`

## Last Updated

2026-06-07 - Added verification evidence
