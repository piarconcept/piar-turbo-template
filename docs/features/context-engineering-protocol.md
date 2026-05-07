# Context Engineering Protocol

## Purpose

Turn resolved errors, regressions, and important fixes into reusable repository context.

The goal is simple: if the team had to spend time understanding a problem once, the next engineer should not need to rediscover the same path from scratch.

## When Documentation Is Mandatory

Create or update an architecture fix note or learning-log entry when any of the following is true:

- A bug, regression, or incident reached a shared branch, staging, or production.
- The fix required non-obvious debugging across multiple files, layers, or services.
- The root cause was missing from the current docs, tests, or operational knowledge.
- The issue affected CI/CD, authentication, permissions, data integrity, migrations, integrations, or deployments.
- The team had to apply a workaround, rollback, cleanup step, or manual recovery process.
- The same class of mistake is likely to happen again without written context.

Documentation is optional for clearly trivial changes such as typos, copy fixes, or isolated refactors with no learning value.

## Where To Document

- Store architecture root causes in `docs/architecture/fixes/`.
- Store reusable operational fix notes in `docs/learning-log/`.
- Create one file per root cause or incident using `YYYY-MM-DD-short-slug.md`.
- Start from the matching template in that directory.
- If the work was planned or executed through waves, update the relevant `docs/waves/` plan or implementation report.
- If the fix changes a permanent workflow or architecture rule, update the relevant document in `docs/features/` as well and cross-link both documents.

Use `docs/architecture/fixes/` when the root cause is structural: package boundaries, BFF/client ownership, layering, contracts, monorepo wiring, persistence, migrations, or repeated architecture decisions.

## Required Content For Each Entry

Every architecture fix or learning-log note must include:

- Summary: what broke and why this note exists.
- Symptoms: what engineers or users saw.
- Impact: who or what was affected.
- Root Cause: the actual technical reason, not only the surface failure.
- Resolution: what changed to fix it.
- Verification: how the fix was validated.
- Prevention: tests, alerts, docs, guardrails, or follow-up actions that reduce recurrence.
- Related Changes: relevant files, packages, PRs, commits, or docs.

## Workflow

1. Fix the code.
2. Add or update tests when appropriate.
3. Update the relevant wave plan or implementation report if the work was wave-based.
4. Write the architecture fix note or learning-log entry before merging.
5. Update the canonical feature or architecture doc if the fix changed long-term behavior.
6. Add the new entry to the relevant README index.

## Review Standard

A reviewer should be able to open the note and understand:

- how to recognize the issue quickly,
- what the real root cause was,
- how it was fixed,
- and what prevents the same mistake from repeating.

If the note only says what changed in code, it is incomplete.

## Ownership

- The engineer shipping the fix owns the first version of the note.
- The reviewer checks that the note is accurate and reusable.
- The team updates the note if the same issue reappears with a better understanding.

## Related Documentation

- `../architecture/fixes/README.md`
- `../architecture/fixes/TEMPLATE.md`
- `../learning-log/README.md`
- `../learning-log/TEMPLATE.md`
- `../waves/README.md`
- `quality-gates.md`
- `error-handling-system.md`

## Last Updated

7 May 2026 - Connected reusable learning capture with wave execution docs
