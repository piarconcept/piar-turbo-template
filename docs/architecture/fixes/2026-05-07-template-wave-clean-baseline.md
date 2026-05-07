# Template Wave And Clean Baseline

## Summary

The template lacked a canonical wave workflow for multi-agent feature work and did not have a single cleanup command that formatted, removed generated artifacts, and finished with full verification.

## Date

2026-05-07

## Status

- [x] Resolved
- [ ] Follow-up needed

## Architecture Scope

- Apps or packages: root tooling, app package scripts, documentation workflow
- Layers or boundaries involved: monorepo build orchestration, AI execution planning, verification hygiene
- Contracts, schemas, persistence, or build concerns: generated artifact detection, app dependency preparation, Turbo task dependencies

## Symptoms

- New projects had no template-level `docs/waves/` contract for staged or parallel Codex work.
- Root verification checked artifacts but did not clean local generated output before and after verification.
- Generated JS and DTS files emitted next to TypeScript sources could remain untracked without being classified as artifacts.
- App-level `dev` and `build` scripts did not build workspace dependencies first.

## Impact

- Large work could be split across chats without durable ownership, integration, and QA docs.
- Generated output could obscure real diffs or be committed accidentally.
- Local app startup could depend on prior manual package builds.

## Why This Was Architectural

The issue was not a single implementation bug. It affected repository-wide workflows: how agents plan work, how apps consume workspace packages, how generated artifacts are controlled, and how final verification is run.

## Root Cause

The template had learned context engineering and verification patterns, but it had not yet absorbed wave execution methodology from downstream product repositories or the stricter generated artifact hygiene from PiarGate.

## Resolution

- Added `docs/waves/` with canonical day, wave, and prompt templates.
- Added `docs/features/waves-workflow.md` and linked waves from the documentation indexes.
- Added `AGENTS.md` as a repository entrypoint for future AI agents.
- Added `pnpm clean` to run format, artifact cleanup/checks, and final verify.
- Hardened `scripts/generated-artifacts.mjs` to detect generated directories and source-adjacent JS/DTS artifacts.
- Updated `scripts/verify-all.sh` to clean artifacts before and after scratch verification and compare sorted git status snapshots.
- Added app `build:prepare` and `dev:prepare` scripts for workspace dependency builds.
- Updated Turbo `typecheck` to depend on upstream builds and typechecks.
- Added `docs/architecture/fixes/` for structural learning.

## Verification

- Tests added or updated: none; this is workflow and documentation hardening.
- Commands run: `pnpm artifacts:check`, `pnpm format:check`, `pnpm verify`
- Manual verification: reviewed docs indexes and package scripts for consistency.

## Guardrails

- New non-trivial feature work should start from `docs/waves/`.
- Future structural fixes should be documented in `docs/architecture/fixes/`.
- Final local handoff should use `pnpm clean`.

## Cross-References

- Related feature docs: `docs/features/waves-workflow.md`, `docs/features/quality-gates.md`, `docs/features/context-engineering-protocol.md`
- Related wave docs: `docs/waves/README.md`
- Related learning-log entries:
- Relevant files: `package.json`, `scripts/verify-all.sh`, `scripts/generated-artifacts.mjs`, `turbo.json`, `AGENTS.md`

## Last Updated

2026-05-07 - Created entry
