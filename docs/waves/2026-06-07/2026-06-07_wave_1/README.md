# 2026-06-07 Wave 1

## Type

`sequential-prod-safe`

## Objective

Move backoffice accounts and search implementation code out of the BFF app and
into feature API packages without changing the public HTTP API.

## Dependencies

- `docs/features/creating-features-guide.md`
- `docs/features/template-baseline-and-feature-migration.md`
- `docs/features/backoffice-bff-application.md`
- `docs/architecture/fixes/2026-05-08-bounded-list-contract.md`

## Prompt Index

- `2026-06-07_wave_1_prompt_AA.md` - Package-boundary refactor and verification.

## Execution Order

Run prompt `AA` once. Do not split this wave in parallel because the same app
module and dependency graph are shared by accounts and search wiring.

## Integration Criteria

- New packages are valid workspace packages.
- Backoffice BFF depends on the new packages.
- Local app folders for accounts and search are removed.
- Docs and architecture fix memory are updated.
- Targeted verification passes or failures are reported with concrete causes.

## Non-Goals Or Safety Rules

- Do not change endpoint paths or response shapes.
- Do not change database configuration or repository implementations.
- Do not personalize template identity.
- Do not alter backoffice client flows unless verification proves it is required.

## Last Updated

2026-06-07 - Created wave definition
