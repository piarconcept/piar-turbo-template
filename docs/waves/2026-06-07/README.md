# 2026-06-07 Waves

## Purpose

Align backoffice account administration and search with the repository feature
package conventions. The work is small enough for one sequential wave, but it
changes package boundaries and app wiring, so it is documented for future
handoff value.

## Source Documents

- `docs/AI-context.md`
- `README.md`
- `docs/features/creating-features-guide.md`
- `docs/features/template-baseline-and-feature-migration.md`
- `docs/features/bff-architecture.md`
- `docs/features/backoffice-bff-application.md`
- `docs/waves/README.md`

## Wave Index

### Wave 1 - `sequential-prod-safe`

- `2026-06-07_wave_1`
- Prompt `AA` - Move backoffice accounts and search implementation into feature
  API packages, rewire the BFF, and verify.

## Execution Order

1. Read the architecture and feature package docs.
2. Create the feature API packages and preserve endpoint behavior.
3. Rewire `apps/api/backoffice-bff` to consume those packages.
4. Delete the old app-local implementation folders.
5. Update architecture and feature docs.
6. Run targeted package and BFF verification.

## Cross-Wave Integration Rule

This day has one sequential wave. If verification finds package graph or DI
problems, fix them in the same wave before broader cleanup commands.

## Day-Level Success Criteria

- `apps/api/backoffice-bff/src` no longer contains app-local accounts/search
  feature implementations.
- `@piar/accounts-api` and `@piar/search-api` own their controllers, use cases,
  DTOs or types, and module setup.
- Backoffice BFF imports feature modules from packages and binds repository
  providers explicitly.
- Documentation records the architecture boundary fix.
- Targeted typecheck/build commands pass.

## Last Updated

2026-06-07 - Created day-level wave plan
