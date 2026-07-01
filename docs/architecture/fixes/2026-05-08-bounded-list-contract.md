# Bounded List Contract

## Summary

The template allowed repository ports and feature adapters to expose whole-table
reads through `getAll`. Several admin list and search paths then loaded complete
collections and applied pagination, filtering, sorting, or search in memory.

## Date

2026-05-08

## Status

- [x] Resolved
- [ ] Follow-up needed

## Architecture Scope

- Apps or packages:
  - `apps/api/backoffice-bff`
  - `packages/domain/models`
  - `packages/domain/dynamic-form`
  - `packages/features/contact`
  - `packages/features/dynamic-page`
  - `packages/infra/backend/repositories`
- Layers or boundaries involved:
  - domain ports
  - feature adapters
  - BFF use cases
  - TypeORM repositories
- Contracts, schemas, persistence, or build concerns:
  - collection-read contract
  - paginated result contract
  - SQL filtering, sorting, and search boundaries

## Symptoms

- Admin account lists loaded all accounts before applying search, filter, sort,
  and pagination.
- Backoffice search loaded all accounts before slicing the result set.
- Contact submission and dynamic page feature adapters loaded full collections
  and delegated query behavior to in-memory helpers.
- Repository ports made the unsafe behavior easy to repeat in new features.

## Impact

- Table growth could turn ordinary list/search requests into expensive full-table
  reads.
- Pagination did not protect the database because the limit was applied after
  records had already been fetched.
- New template consumers could copy the same pattern into production projects.

## Why This Was Architectural

The root problem was the shared collection-read contract, not a single endpoint.
`getAll` lived in the domain port shape, so controllers, use cases, adapters, and
repositories could compile while bypassing bounded query behavior.

## Root Cause

The base port contract treated whole-collection reads as a normal CRUD method.
Feature adapters then compensated by applying `DynamicQuery` in memory, which
kept UI behavior working while hiding the persistence cost.

## Resolution

- Replaced `BasePort.getAll()` with required `BasePort.list(query)`.
- Made `DynamicCrudPort.list(query)` required and documented that database-backed
  implementations must apply the query at the persistence boundary.
- Removed `getAll` implementations from TypeORM repositories.
- Added shared TypeORM query helpers for bounded windows, allowlisted text search,
  filters, and sorting.
- Updated account, contact submission, and dynamic page repositories to use
  query-builder pagination and allowlisted query fields.
- Updated feature adapters and backoffice search to call `list(query)` instead of
  loading whole collections.
- Replaced broad account counts with bounded existence checks for first-account
  and last-admin business rules.
- Hardened feature list controllers so malformed filter JSON is ignored instead
  of throwing from the controller.

## Verification

- Tests added or updated:
  - Existing domain tests cover the changed port packages.
- Commands run:
  - `tsc --noEmit` in `packages/domain/dynamic-form`
  - `tsc --noEmit` in `packages/domain/models`
  - `tsc --noEmit` in `packages/infra/backend/repositories`
  - `tsc --noEmit` in `packages/features/contact/infra/backend`
  - `tsc --noEmit` in `packages/features/dynamic-page/infra/backend`
  - `tsc --noEmit` in `packages/features/contact/api`
  - `tsc --noEmit` in `packages/features/dynamic-page/api`
  - `tsc --noEmit` in `packages/features/auth/api`
  - `tsc --noEmit` in `apps/api/backoffice-bff`
  - `tsc --noEmit` in `apps/api/web-bff`
  - `vitest --run` in `packages/domain/dynamic-form`
  - `vitest --run` in `packages/domain/models`
  - `vitest --run --passWithNoTests` in `packages/infra/backend/repositories`
  - `vitest --run --passWithNoTests` in `packages/features/contact/api`
  - `vitest --run --passWithNoTests` in `packages/features/dynamic-page/api`
  - `eslint` on changed TypeScript files
  - `prettier --check` on changed TypeScript and Markdown files
- Manual verification:
  - Searched `apps` and `packages` for `getAll`; no code matches remain.
  - Searched `apps` and `packages` for unbounded `.find()`, `.count()`, and
    `findAndCount`; no matches remain.

## Guardrails

- New collection reads should use `list(query)` at the domain port boundary.
- Database-backed repositories must apply `page`, `limit`, search, filters, and
  sort in SQL.
- Search and filter fields must be allowlisted before reaching a query builder.
- Avoid exact counts when the business rule only needs existence or
  "at least two" semantics.

## Cross-References

- Related feature docs:
  - `docs/features/bff-architecture.md`
  - `docs/features/backoffice-bff-application.md`
  - `docs/features/domain-dynamic-form.md`
  - `docs/features/template-baseline-and-feature-migration.md`
- Related wave docs:
  - None; this was a single linear architecture fix.
- Related learning-log entries:
  - None.
- Relevant files:
  - `packages/domain/models/src/entities/base/base.port.ts`
  - `packages/domain/dynamic-form/src/ports.ts`
  - `packages/infra/backend/repositories/src/common/dynamic-query.ts`
  - `packages/features/accounts/api/src/use-cases/list-accounts.use-case.ts`
  - `packages/features/search/api/src/use-cases/search-backoffice.use-case.ts`

## Last Updated

2026-06-07 - Updated account/search feature package file references
