# Contributing

Thanks for contributing to the PIAR monorepo template.

## Quick Start

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Run verification:
   ```bash
   pnpm clean
   ```

## Commit Convention

This repository uses Conventional Commits (enforced by commitlint):

```
<type>(<scope>): <short summary>
```

Common types:

- `feat`: new feature
- `fix`: bug fix
- `chore`: tooling or maintenance
- `docs`: documentation only
- `refactor`: refactor without behavior change
- `test`: add or update tests

Examples:

```
feat(ui): add button variants
fix(api): handle missing auth token
docs(readme): document commit convention
```

## Code Style

- Format with Prettier: `pnpm format`
- Lint with ESLint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Final cleanup and verification: `pnpm clean`

## Tests

- Run all tests: `pnpm test`
- Coverage: `pnpm test:coverage -- --run`

## Documentation

Any structural or architectural change must be documented under `docs/`.
Feature work and multi-agent execution plans should use `docs/waves/`.
Any non-trivial bug fix, regression, incident, workaround, or debugging session with reusable learning must be logged in `docs/learning-log/`.
Use `docs/learning-log/TEMPLATE.md` for new entries.
If the fix changes the canonical workflow or architecture, also update the relevant document under `docs/features/`.
Update `docs/AI-context.md` when adding or removing docs.

## Pull Requests

- Keep PRs focused and minimal.
- Update docs if behavior or structure changes.
- Link the relevant wave plan for non-trivial feature work.
- For meaningful `fix` changes, add or update a learning-log entry unless the change is truly trivial.
- Ensure CI passes.
