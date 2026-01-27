# PIAR Monorepo Template

Production-ready monorepo template for building modern web applications with Next.js, NestJS, and shared TypeScript packages.

## Quick Start

Prerequisites:

- Node.js 20.x
- pnpm 10.28.0

```bash
pnpm install
pnpm verify
```

Run apps in dev mode:

```bash
pnpm --filter @piar/web dev
pnpm --filter @piar/backoffice dev
pnpm --filter @piar/web-bff dev
pnpm --filter @piar/backoffice-bff dev
```

## Repository Structure

```
piar-repo/
├── apps/
│   ├── api/                 # NestJS BFFs
│   ├── client/              # Next.js apps
│   └── sqs/                 # Queue handlers
├── packages/                # Shared packages
├── docs/                    # Documentation and architecture
├── scripts/                 # Tooling scripts
├── turbo.json               # Turbo config
└── tsconfig.base.json       # Base TS config
```

## Applications

- `@piar/web` - Public website (Next.js)
- `@piar/backoffice` - Admin app (Next.js)
- `@piar/web-bff` - Web BFF API (NestJS)
- `@piar/backoffice-bff` - Backoffice BFF API (NestJS)

## Shared Packages (highlights)

- `@piar/domain-models` - Domain entities
- `@piar/domain-fields` - Field configuration system
- `@piar/messages` - i18n messages
- `@piar/ui-config` - Tailwind CSS v4 shared config and design tokens
- `@piar/ui-components` - Shared UI components
- `@piar/layout` - Shared layout components
- `@piar/infra-client-seo` - SEO infrastructure (sitemap, robots, validators)
- `@piar/infra-backend-security` - Shared JWT security

## Common Commands

```bash
pnpm turbo build        # Build all packages/apps
pnpm typecheck          # Type check all packages/apps
pnpm lint               # Lint all packages/apps
pnpm test               # Run all tests with coverage
pnpm verify             # Install, build, typecheck, test, lint, format check
```

## Ports (defaults)

- Web: Next.js default 3000
- Backoffice: Next.js default 3000 (set `PORT=3001` if running both)
- Web BFF: 5010
- Backoffice BFF: 5050

## Documentation

Start here: `docs/AI-context.md`

Key docs:

- `docs/features/repository-configuration.md`
- `docs/features/creating-packages.md`
- `docs/features/creating-features-guide.md`
- `docs/features/testing-guide.md`
- `docs/features/tailwind-v4-implementation.md`

## Contributing

See `CONTRIBUTING.md` for workflow and commit rules.

## Security

See `SECURITY.md` for reporting vulnerabilities.

## Code of Conduct

See `CODE_OF_CONDUCT.md` for community guidelines.

## Commit Convention

This repo uses **Conventional Commits** enforced by commitlint.

Format:

```
type(scope): short description
```

Common types:

- `feat`: new feature
- `fix`: bug fix
- `chore`: tooling or maintenance
- `docs`: documentation only
- `refactor`: code change without behavior change
- `test`: add or update tests

Examples:

```
feat(ui): add button variants
fix(api): handle missing auth token
docs(readme): document commit convention
```

## License

MIT License. See `LICENSE`.

## About Piar Concept

This template is created and maintained by Piar Concept.

Website: `https://piarconcept.com`
Contact: `polribasrovira@gmail.com`
