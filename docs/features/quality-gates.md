# Quality Gates

## Purpose

Define formatting, commit rules, and local hooks that keep the template consistent.

## Formatting

- **Tool**: Prettier
- **Config**: `prettier.config.cjs`
- **Ignore**: `.prettierignore`
- **EditorConfig**: `.editorconfig` keeps editors consistent

Commands:

```bash
pnpm format        # auto-format
pnpm format:check  # verify formatting
```

## Commit Rules

- **Tool**: commitlint
- **Config**: `commitlint.config.cjs`
- **Standard**: Conventional Commits

Example:

```
feat(ui): add button variants
fix(api): handle missing auth token
```

## Git Hooks

- **Tool**: husky
- **Hooks**:
  - `pre-commit`: runs `pnpm lint-staged`
  - `commit-msg`: runs commitlint

## lint-staged

Only formats staged files to keep commits fast.

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx,md,json,yml,yaml,css,scss}": [
    "prettier --write"
  ]
}
```

## CI Alignment

`pnpm verify` includes:

- install
- build
- typecheck
- format check
- tests with coverage
- lint

## Last Updated

27 January 2026 - Added formatting and commit hooks
