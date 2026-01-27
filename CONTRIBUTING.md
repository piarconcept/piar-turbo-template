# Contributing

Thanks for contributing to the PIAR monorepo template.

## Quick Start

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Run verification:
   ```bash
   pnpm verify
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

## Tests

- Run all tests: `pnpm test`
- Coverage: `pnpm test:coverage -- --run`

## Documentation

Any structural or architectural change must be documented under `docs/`.
Update `docs/AI-context.md` when adding or removing docs.

## Pull Requests

- Keep PRs focused and minimal.
- Update docs if behavior or structure changes.
- Ensure CI passes.
