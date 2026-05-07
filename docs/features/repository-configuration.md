# Repository Configuration

## Purpose

Document critical repository configuration decisions and conventions that must be followed to maintain consistency across the monorepo.

## Status

- [x] Completed - Initial configuration documented

## Key Decisions

### Monorepo Configuration

- **Single pnpm-workspace.yaml**: Only at the root. Sub-apps must not have their own workspace files.
- **Package naming**: All packages use the `@piar/` scope.

### Package Manager

- **pnpm 10.28.0**: Specified in root `package.json`.
- **Workspaces**: Root `pnpm-workspace.yaml` includes:
  - `apps/**`
  - `packages/**`
- **TypeScript base config**: All `tsconfig.json` extend `tsconfig.base.json`

### Build System

- **Turbo 2.7.4** for builds and caching
- **Tasks**:
  - `dev`: Development mode (no cache, persistent)
  - `build`: Production builds with dependency ordering
  - `typecheck`: TypeScript validation across workspace
  - `lint`: Linting across workspace
  - `test`: Tests without coverage
  - `test:coverage`: Tests with coverage

### Node Version

- **Node.js 20.x**: Required engine version

## File Structure Conventions

```
piar-repo/
├── .gitignore
├── eslint.config.mjs
├── vitest.config.ts
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── apps/
    ├── api/
    ├── client/
    │   ├── backoffice/
    │   └── web/
    └── sqs/
```

## Critical Rules

🚫 **NEVER**:

1. Create `pnpm-workspace.yaml` in sub-folders
2. Use unscoped package names (must be `@piar/*`)
3. Commit `.env` files (use `.env.example`)
4. Bypass Turbo for workspace builds

✅ **ALWAYS**:

1. Add new apps under `apps/` and packages under `packages/`
2. Use scoped package names
3. Include `typecheck` in TypeScript packages
4. Update documentation when configuration changes
5. Use `next/link` instead of raw `<a>` for internal navigation in Next.js apps

## Configuration Files

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/**'
  - 'packages/**'
```

### turbo.json

Defines task dependencies and caching:

- `dev`: no cache, persistent
- `build`: cached, depends on upstream builds
- `typecheck`: depends on upstream builds and upstream typechecks
- `lint`: cached, depends on upstream linting
- `test:coverage`: no cache, outputs coverage

App `build` and `dev` scripts should include `build:prepare` or `dev:prepare` steps that build workspace dependencies first. This keeps local Next.js and NestJS startup aligned with package output requirements.

## Usage

### Adding a New App

1. Create folder under `apps/`
2. Create `package.json` with name `@piar/app-name`
3. Add scripts: `dev`, `build`, `typecheck`
4. Document in `docs/features/`

### Adding a Shared Package

1. Create folder under `packages/`
2. Create `package.json` with name `@piar/package-name`
3. Document in `docs/features/`

### Running Commands

```bash
pnpm install
pnpm turbo build
pnpm turbo typecheck
pnpm turbo lint
pnpm test
pnpm test:coverage -- --run
pnpm verify               # artifact hygiene, install, build, typecheck, format check, test policy, test, lint
pnpm clean                # format, clean artifacts, check artifacts, verify
```

## Related Documentation

- `docs/AI-context.md`
- `docs/features/setup-project.md`
- `docs/features/testing-guide.md`
- `docs/features/eslint-configuration.md`
- `docs/features/quality-gates.md`
- `docs/features/waves-workflow.md`

## Last Updated

7 May 2026 - Added clean command and current verification contract
