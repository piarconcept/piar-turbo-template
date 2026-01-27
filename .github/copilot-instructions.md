# PIAR Monorepo - AI Agent Instructions

**Language Policy**: All code, documentation, and comments must be in English (except user-facing translations).

## Architecture Overview

This is a **pnpm workspace monorepo** using **Turbo** for build orchestration. Two key architectural patterns define this codebase:

### 1. Backend for Frontend (BFF) Pattern

- **Two specialized NestJS APIs**, not one generic backend
- `@piar/web-bff` (port 5010): Serves public website `@piar/web`
- `@piar/backoffice-bff` (port 5050): Serves admin panel `@piar/backoffice`
- Each BFF is optimized for its client's specific needs and can evolve independently
- See [docs/features/bff-architecture.md](../docs/features/bff-architecture.md) for full rationale

### 2. Three-Layer Clean Architecture for Features

Every feature splits into three packages under `packages/features/{feature}/`:

```
{feature}/
├── configuration/  # Domain layer: ports (interfaces), types, DTOs - zero dependencies
├── api/           # Infrastructure layer: NestJS use-cases, controllers, modules
└── client/        # Presentation layer: React hooks, components, HTTP repositories
```

**Example**: The `health` feature ([docs/features/health-feature.md](../docs/features/health-feature.md)) demonstrates this pattern completely.

## Critical Workspace Rules

⚠️ **NEVER violate these** (see [docs/features/repository-configuration.md](../docs/features/repository-configuration.md)):

1. **Single pnpm-workspace.yaml** at root only - never create workspace files in subdirectories
2. **All packages use `@piar/` scope** - e.g., `@piar/backoffice`, `@piar/web-bff`
3. **Turbo orchestrates builds** - always use workspace scripts (`pnpm dev`, `pnpm build`), never bypass
4. **Node.js 20.x required** - specified in root package.json engines
5. **pnpm 10.28.0** - enforced via packageManager field

## Developer Workflows

### Development

```bash
# Start specific apps (most common)
pnpm dev:web              # Web client + BFF
pnpm dev:backoffice       # Backoffice client + BFF
pnpm dev:apis             # Both BFFs only
pnpm dev:clients          # Both clients only

# Or individual apps
pnpm --filter @piar/web dev
pnpm --filter @piar/web-bff dev
```

### Building & Testing

```bash
pnpm build                # Build all via Turbo (respects dependencies)
pnpm typecheck            # TypeScript validation across workspace
pnpm lint                 # ESLint (apps have own configs, packages use root)
pnpm test                 # Run tests with coverage
pnpm verify               # Full CI check: install + build + typecheck + test
```

### Key Turbo Configuration ([turbo.json](../turbo.json))

- `dev`: No cache, persistent (servers)
- `build`: Cached, depends on `^build` (upstream packages first)
- `test`: No cache, depends on `^build`, outputs to `coverage/`

## Testing with Vitest

- **Workspace mode**: Root [vitest.config.ts](../vitest.config.ts) discovers all package tests
- **Apps excluded** from workspace tests (tested individually if needed)
- **Coverage thresholds**: 80% lines/functions/statements, 75% branches
- **Test location**: `tests/` directory mirrors `src/` structure
- **Example**: [packages/domain/models/tests/](../packages/domain/models/tests/) shows entity testing patterns

**Run package tests**:

```bash
pnpm --filter @piar/domain-models test        # Single package
pnpm test:coverage                            # All packages with aggregated coverage
```

See [docs/features/testing-guide.md](../docs/features/testing-guide.md) for comprehensive patterns.

## Creating New Features

**Follow the 3-package structure** ([docs/features/creating-features-guide.md](../docs/features/creating-features-guide.md)):

1. **Configuration package** (`@piar/{feature}-configuration`):
   - Zero dependencies, pure TypeScript types
   - Exports ports (repository interfaces) and DTOs
   - Example: [packages/features/health/configuration/](../packages/features/health/configuration/)

2. **API package** (`@piar/{feature}-api`):
   - Depends on configuration package
   - NestJS modules with: `controllers/`, `use-cases/`, `modules/`
   - Use-cases implement business logic, controllers handle HTTP
   - Example: [packages/features/health/api/](../packages/features/health/api/)

3. **Client package** (`@piar/{feature}-client`):
   - Depends on configuration package
   - React: `repositories/` (HTTP), `hooks/` (data), `components/` (UI)
   - Example: [packages/features/health/client/](../packages/features/health/client/)

## Creating New Packages

**Always follow the 14-step process** in [docs/features/creating-packages.md](../docs/features/creating-packages.md):

- Use `@piar/` scope in package.json
- Include `build`, `typecheck`, `lint`, `test`, `test:coverage` scripts
- Add `vitest.config.ts` for testable packages
- Update relevant BFF/client dependencies

## ESLint Configuration

- **Root config** ([eslint.config.mjs](../eslint.config.mjs)): Base TypeScript rules for packages
- **App configs**: Next.js apps have own `eslint.config.mjs` extending Next.js rules
- **Apps ignored** in root config (line 64: `ignores: ['apps/**']`)
- **Import rules disabled** for easier AI workflows (no import ordering enforcement)

## Domain Models

- **Base entity pattern** ([packages/domain/models/](../packages/domain/models/)): All entities extend `BaseEntity`
- Entities are classes with:
  - Constructor validation
  - Static factory methods (e.g., `Account.create()`)
  - `toJSON()` for serialization
- See [docs/features/domain-models.md](../docs/features/domain-models.md)

## Styling with Tailwind CSS v4

- **Centralized config** ([packages/ui/config/](../packages/ui/config/)): All Tailwind configuration in `@piar/ui-config`
- **CSS-first approach**: Configuration via `@theme` in CSS, no tailwind.config.js
- **Design tokens**: Centralized in `@piar/ui-config/tailwind.css` (primary colors, fonts)
- **No inline styles**: All components use Tailwind utility classes
- **Monorepo scanning**: PostCSS `base` points to monorepo root for automatic class detection
- See [docs/features/tailwind-v4-implementation.md](../docs/features/tailwind-v4-implementation.md)

### Usage Pattern:

```tsx
// ❌ Don't use inline styles
<div style={{ display: 'flex', padding: '1rem' }}>

// ✅ Use Tailwind classes
<div className="flex p-4">

// ✅ Use design tokens
<div className="bg-[var(--color-secondary)] text-[var(--color-primary)]">
```

## Documentation Requirements

⚠️ **ALWAYS update documentation** ([docs/AI-context.md](../docs/AI-context.md)):

1. **Before changes**: Check existing docs in `docs/features/` for patterns/conventions
2. **After changes**: Update or create docs reflecting what was done
3. **New features**: Use [docs/features/TEMPLATE.md](../docs/features/TEMPLATE.md), update index in AI-context.md
4. **Single source of truth**: Document all architectural decisions, never assume/invent

## Key Files Reference

- [README.md](../README.md) - Quick start and project overview
- [docs/AI-context.md](../docs/AI-context.md) - Documentation index (start here)
- [docs/features/repository-configuration.md](../docs/features/repository-configuration.md) - Critical monorepo rules
- [docs/features/bff-architecture.md](../docs/features/bff-architecture.md) - BFF pattern explained
- [docs/features/creating-features-guide.md](../docs/features/creating-features-guide.md) - Feature creation (Spanish, comprehensive)
- [docs/features/testing-guide.md](../docs/features/testing-guide.md) - Testing patterns and setup
- [package.json](../package.json) - Workspace scripts and package manager
- [turbo.json](../turbo.json) - Build orchestration and caching

## Common Pitfalls to Avoid

- ❌ Creating features without the 3-package structure
- ❌ Skipping documentation updates
- ❌ Adding pnpm-workspace.yaml in subdirectories
- ❌ Using packages without `@piar/` scope
- ❌ Running builds outside Turbo (breaks caching and dependencies)
- ❌ Creating one big API instead of BFF-specific endpoints
- ❌ Mixing infrastructure code in configuration packages (keep domain pure)
- ❌ **Using `useTranslations()` with full keys and fallbacks**: `t('auth.login.title', 'Sign In')` ✗
  - ✅ **Correct**: Use namespace: `useTranslations('auth.login')` then `t('title')`
- ❌ **Using `<a>` tags for internal navigation**: `<a href="/page">Link</a>` ✗
  - ✅ **Correct**: Use Next.js Link: `import Link from 'next/link'` then `<Link href="/page">Link</Link>`
