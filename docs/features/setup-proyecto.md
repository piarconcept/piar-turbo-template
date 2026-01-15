# Project Setup

## Purpose
Document the initial project setup, structure, and baseline steps for new agents and developers working on this monorepo.

## Status
- [x] Completed - Initial setup documented

## Key Decisions
- **Monorepo structure**: Using a monorepo to share code between multiple apps
- **Package manager**: pnpm with workspaces for efficient dependency management
- **Build tool**: Turbo for faster builds and caching
- **Apps structure**: Separated into `api`, `client` (backoffice & web), and `lambda`

## Technical Details

### Architecture
This is a monorepo containing multiple applications and shared packages:
- **apps/api**: Backend API
- **apps/client/backoffice**: Admin/backoffice Next.js application
- **apps/client/web**: Public-facing Next.js application
- **apps/lambda**: Serverless functions
- **packages/**: Shared packages used across apps
- **docs/**: Project documentation (MUST be kept updated)

### Dependencies
- **pnpm**: Fast, disk space efficient package manager
- **turbo**: High-performance build system for monorepos
- **Next.js**: React framework for client applications

### File Structure
```
piar-repo/
├── package.json           # Root package configuration
├── pnpm-lock.yaml        # Lock file for dependencies
├── pnpm-workspace.yaml   # Workspace configuration
├── turbo.json            # Turbo build configuration
├── apps/
│   ├── api/              # Backend API
│   ├── client/
│   │   ├── backoffice/   # Admin application
│   │   └── web/          # Public website
│   └── lambda/           # Serverless functions
├── docs/                 # Documentation (AI Context)
│   ├── AI-context.md     # Main index and guidelines
│   └── features/         # Feature-specific docs
└── packages/             # Shared packages
```

### Configuration
- **Language policy**: English only (except translations)
- **Documentation**: All determinant changes must be documented in `docs/`

## Usage

### Installation
```bash
# Install all dependencies
pnpm install
```

### Development
```bash
# Run specific app in development mode
pnpm --filter @app/backoffice dev
pnpm --filter @app/web dev
```

### Build
```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter @app/backoffice build
```

## Related Documentation
- Main AI Context: `docs/AI-context.md`
- Template for new features: `docs/features/TEMPLATE.md`

## Notes
- Always check and update documentation when making structural changes
- Use the TEMPLATE.md when creating new feature documentation
- Keep the Features index in AI-context.md updated

## Last Updated
15 January 2026 - Complete project setup documentation with structure and commands

