# YYYY-MM-DD Wave N Prompt XX - Title

## Prompt For Codex

Work in this repository. State the concrete objective in one sentence.

Set the chat title to: `Prompt XX - Wave N - YYYY-MM-DD`.

## Mandatory Start Context

- Work on the correct source-of-truth repository.
- Run `git status --short` before editing.
- Read the required docs before making assumptions.
- Confirm the ownership boundaries before changing files.

## Read First

- `docs/AI-context.md`
- `README.md`
- `docs/waves/README.md`
- `docs/...`

## Ownership

You may edit:

- `path/**`
- `path/**`

Do not edit:

- `path/**`
- `path/**`

If the task requires crossing ownership, stop and report before editing.

## Task

Describe the exact implementation or documentation outcome expected from this prompt.

Prefer concrete bullet points over vague statements.

## Acceptance Criteria

- Criterion one
- Criterion two
- Criterion three

## QA Tester Definition of Done

- Validate the expected behavior.
- Check relevant regressions and edge cases.
- Confirm ownership boundaries were respected.
- Record verification evidence.

## Suggested Verification

Run the smallest reproducible verification commands possible, for example:

```bash
pnpm --filter @piar/example typecheck
pnpm --filter @piar/example test
pnpm --filter @piar/example build
```

If a command does not exist, use the nearest equivalent and report the substitution.

## Expected Output

Report exactly:

1. Files changed
2. Architecture or documentation decisions made
3. Commands executed
4. What passed
5. What failed
6. What could not be tested
7. Residual risks or follow-up
