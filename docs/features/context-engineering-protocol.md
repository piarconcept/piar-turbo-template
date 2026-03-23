# Context Engineering Protocol

## Purpose

Turn resolved errors, regressions, and important fixes into reusable repository context.

The goal is simple: if the team had to spend time understanding a problem once, the next engineer should not need to rediscover the same path from scratch.

## When Documentation Is Mandatory

Create or update a learning-log entry when any of the following is true:

- A bug, regression, or incident reached a shared branch, staging, or production.
- The fix required non-obvious debugging across multiple files, layers, or services.
- The root cause was missing from the current docs, tests, or operational knowledge.
- The issue affected CI/CD, authentication, permissions, data integrity, migrations, integrations, or deployments.
- The team had to apply a workaround, rollback, cleanup step, or manual recovery process.
- The same class of mistake is likely to happen again without written context.

Documentation is optional for clearly trivial changes such as typos, copy fixes, or isolated refactors with no learning value.

## Where To Document

- Store reusable fix notes in `docs/learning-log/`.
- Create one file per root cause or incident using `YYYY-MM-DD-short-slug.md`.
- Start from `docs/learning-log/TEMPLATE.md`.
- If the fix changes a permanent workflow or architecture rule, update the relevant document in `docs/features/` as well and cross-link both documents.

## Required Content For Each Entry

Every learning-log note must include:

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
3. Write the learning-log entry before merging.
4. Update the canonical feature or architecture doc if the fix changed long-term behavior.
5. Add the new entry to `docs/learning-log/README.md`.

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

- `../learning-log/README.md`
- `../learning-log/TEMPLATE.md`
- `quality-gates.md`
- `error-handling-system.md`

## Last Updated

10 March 2026 - Aligned the protocol with the learning-log workflow used in piar-concept-platform
