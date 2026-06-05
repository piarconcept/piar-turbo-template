# Format Check Failed On Deleted Tracked Files

## Summary

`pnpm format:check` failed when a tracked file had been deleted in the working tree because the formatting command passed the deleted path to Prettier. Formatting must support pending deletions so `pnpm verify` can validate a worktree that intentionally removes files.

## Date

2026-06-05

## Status

- [x] Resolved
- [ ] Follow-up needed

## Area

- Package or app: root tooling
- Environment: local verification and scratch verification

## Symptoms

- `pnpm format:check` exited with code 1.
- Prettier reported: `No files matching the pattern were found: "docs/piar-concept-platform-context.md"`.
- `pnpm verify` failed at the format check step even though the remaining files were formatted.

## Impact

- Local verification failed for worktrees with intentional tracked-file deletions.
- The failure blocked `pnpm verify` even when no formatting issue existed.

## Root Cause

The root `format` and `format:check` scripts piped `git ls-files --cached --others --exclude-standard` directly into Prettier. `git ls-files --cached` includes tracked paths from the index even when the visible working tree has deleted them, and Prettier treats a missing explicit path as an error.

## Resolution

- Added `scripts/format-files.mjs`.
- Updated root `format` and `format:check` scripts to use the helper.
- The helper keeps the existing git-aware file selection but filters out paths that no longer exist before calling Prettier.
- The helper keeps the previous fallback to `prettier .` when running outside a git worktree.

## Verification

- Tests added or updated: none; tooling script behavior was verified through the root commands.
- Commands run:
  - `pnpm format:check`
  - `pnpm verify`
- Manual verification:
  - Confirmed a deleted tracked file no longer makes `format:check` fail before Prettier checks existing files.

## Prevention

- Keep root formatting commands behind `scripts/format-files.mjs` instead of inline shell pipelines.
- If formatting scope changes, preserve deleted-file filtering for git worktrees.
- Keep `docs/features/quality-gates.md` aligned with the formatting helper behavior.

## Related Changes

- Files:
  - `package.json`
  - `scripts/format-files.mjs`
  - `docs/features/quality-gates.md`
- PR / commit: pending
- Related docs:
  - `docs/features/quality-gates.md`

## Last Updated

2026-06-05 - Created entry
