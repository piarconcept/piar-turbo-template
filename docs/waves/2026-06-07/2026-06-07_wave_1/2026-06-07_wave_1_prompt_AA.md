# 2026-06-07 Wave 1 Prompt AA - Backoffice Feature Boundaries

## Prompt For Codex

Work in this repository. Move `apps/api/backoffice-bff/src/accounts` and
`apps/api/backoffice-bff/src/search` into feature API packages and rewire the
backoffice BFF to consume those packages.

Set the chat title to: `Prompt AA - Wave 1 - 2026-06-07`.

## Mandatory Start Context

- Work on `/Users/polribasrovira/Documents/piar-concept/temp/piar-turbo-template`.
- Run `git status --short` before editing.
- Read the required docs before making assumptions.
- Confirm the ownership boundaries before changing files.

## Read First

- `docs/AI-context.md`
- `README.md`
- `docs/concept/initial-questions/README.md`
- `docs/features/creating-features-guide.md`
- `docs/features/template-baseline-and-feature-migration.md`
- `docs/features/bff-architecture.md`
- `docs/features/backoffice-bff-application.md`
- `docs/waves/README.md`

## Ownership

You may edit:

- `packages/features/accounts/api/**`
- `packages/features/search/api/**`
- `apps/api/backoffice-bff/package.json`
- `apps/api/backoffice-bff/src/app.module.ts`
- `apps/api/backoffice-bff/src/accounts/**`
- `apps/api/backoffice-bff/src/search/**`
- `docs/features/backoffice-bff-application.md`
- `docs/features/template-baseline-and-feature-migration.md`
- `docs/architecture/fixes/**`
- `docs/waves/2026-06-07/**`
- `docs/AI-context.md`
- `docs/README.md`
- `pnpm-lock.yaml`

Do not edit:

- `apps/client/**`
- `packages/infra/backend/repositories/**`
- `packages/domain/**`
- database configuration or migrations

If the task requires crossing ownership, stop and report before editing.

## Task

- Create `@piar/accounts-api` under `packages/features/accounts/api`.
- Convert the local accounts service behavior into feature-owned use cases.
- Create `@piar/search-api` under `packages/features/search/api`.
- Move search controller, types, module, and use case into that package.
- Update `apps/api/backoffice-bff` to import `AccountsModule` and `SearchModule`
  from packages and register repository providers.
- Delete the local app-level accounts and search implementation folders.
- Update required docs and lockfile.

## Acceptance Criteria

- Existing `/accounts` and `/search` route contracts are preserved.
- Accounts feature has list, get, update, and delete use cases.
- Search feature has its backoffice search use case.
- Backoffice BFF no longer imports local `./accounts` or `./search` modules.
- Targeted typecheck/build passes.

## QA Tester Definition of Done

- Review `git diff` for boundary drift.
- Search for deleted app-local import paths.
- Confirm workspace dependency graph includes the new packages.
- Run the smallest relevant verification commands.
- Record what passed, what failed, and residual risk.

## Suggested Verification

```bash
pnpm install --lockfile-only
pnpm --filter @piar/accounts-api typecheck
pnpm --filter @piar/accounts-api build
pnpm --filter @piar/search-api typecheck
pnpm --filter @piar/search-api build
pnpm -C apps/api/backoffice-bff typecheck
pnpm -C apps/api/backoffice-bff build
```

## Expected Output

Report exactly:

1. Files changed
2. Architecture or documentation decisions made
3. Commands executed
4. What passed
5. What failed
6. What could not be tested
7. Residual risks or follow-up
