# Project Setup

## Purpose

Document the initial project setup, structure, and baseline steps for new agents and developers working on this monorepo.

## Status

- [x] Completed - Initial setup documented

## Key Decisions

- **Monorepo structure**: Share code between multiple apps
- **Package manager**: pnpm with workspaces
- **Build tool**: Turbo for caching and orchestration
- **Apps structure**: `api`, `client` (backoffice & web), and `sqs`

## Technical Details

### Architecture

This is a monorepo containing multiple applications and shared packages:

- **apps/api**: Backend APIs (NestJS)
- **apps/client/backoffice**: Admin Next.js application
- **apps/client/web**: Public Next.js application
- **apps/sqs**: SQS queue handlers
- **packages/**: Shared packages used across apps
- **docs/**: Project documentation (must be kept updated)

### File Structure

```
piar-repo/
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
├── apps/
│   ├── api/
│   ├── client/
│   │   ├── backoffice/
│   │   └── web/
│   └── sqs/
├── docs/
│   ├── AI-context.md
│   └── features/
└── packages/
```

### Configuration

- **Language policy**: English only (except website translations)
- **Documentation**: Determinant changes must be documented in `docs/`

## Usage

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm --filter @piar/backoffice dev
pnpm --filter @piar/web dev
```

### Build

```bash
pnpm build
pnpm --filter @piar/backoffice build
```

### Test

```bash
pnpm test
pnpm test:coverage
pnpm --filter @piar/domain-models test
```

## CI/CD Integration

### Complete Verification Script

```bash
pnpm verify
```

This executes:

1. Install dependencies
2. Build all packages
3. Type check
4. Run all tests with coverage
5. Check formatting
6. Lint all code

### Pre-commit Checklist

```bash
pnpm typecheck
pnpm format:check
pnpm lint
pnpm test
pnpm build
```

### CI Pipeline Example

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10.28.0
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: pnpm install
      - name: Type check
        run: pnpm typecheck
      - name: Format check
        run: pnpm format:check
      - name: Lint
        run: pnpm lint
      - name: Tests
        run: pnpm test:coverage -- --run
      - name: Build
        run: pnpm build
```

## Related Documentation

- `docs/AI-context.md`
- `docs/features/TEMPLATE.md`

## Last Updated

27 January 2026 - Updated commands and verification steps
