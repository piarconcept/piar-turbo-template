# AI Context - PIAR Monorepo

Start here. This file is the canonical index and rules for documentation and development decisions.

## Repository language policy

- The entire repository must be in English unless content is a translation for the website in other languages.

## Documentation Guidelines (CRITICAL)

1. **Single Source of Truth**: All determinant decisions, architectural choices, and project rules must live in `docs/`.
2. **Mandatory updates**: When you change structure, architecture, workflows, tooling, or conventions, update the relevant docs.
3. **Structure**:
   - `docs/AI-context.md` = master index and rules
   - `docs/features/` = detailed docs per topic
4. **Naming**: Use kebab-case filenames (e.g., `authentication-flow.md`).
5. **Index maintenance**: Update this index whenever a doc is added/removed.

## Documentation Index

### Setup & Configuration

1. `features/setup-project.md` - Initial setup and project structure
2. `features/repository-configuration.md` - Monorepo rules and conventions
3. `features/github-workflows.md` - CI/CD workflows
4. `features/bff-architecture.md` - BFF architecture patterns

### Development Guides

5. `features/creating-packages.md` - 14-step guide for creating packages
6. `features/creating-features-guide.md` - Feature creation with Clean Architecture
7. `features/component-library-development-guide.md` - Component library workflow
8. `features/testing-guide.md` - Testing standards and examples
9. `features/eslint-configuration.md` - ESLint configuration and linting
10. `features/quality-gates.md` - Formatting, commit hooks, and commit rules
11. `features/styling-configuration.md` - Styling approach overview
12. `features/tailwind-v4-implementation.md` - Tailwind v4 implementation details

### Package Documentation

13. `features/domain-models.md` - `@piar/domain-models`
14. `features/domain-fields.md` - `@piar/domain-fields`
15. `features/ui-components-atomic-design.md` - `@piar/ui-components`
16. `features/auth-card-refactoring.md` - AuthCard refactor notes
17. `features/health-feature.md` - Health feature architecture
18. `features/auth-feature.md` - Auth feature architecture
19. `features/infra-backend-security.md` - Backend security package
20. `features/infra-client-seo.md` - SEO infrastructure
21. `features/error-handling-system.md` - Error handling system
22. `features/nextauth-authentication.md` - NextAuth v5 in backoffice

### Applications

23. `features/web-bff-application.md` - Web BFF documentation
24. `features/backoffice-bff-application.md` - Backoffice BFF documentation

### Templates

25. `features/TEMPLATE.md` - Template for new docs

## Repository Governance

- `CONTRIBUTING.md` - Contribution workflow and commit rules
- `SECURITY.md` - Vulnerability reporting
- `CHANGELOG.md` - Template change history
- `CODE_OF_CONDUCT.md` - Community standards

## Quick Reference

### Creating a New Component

1. Read `features/component-library-development-guide.md`
2. Identify duplication (3+ uses)
3. Choose level: atom/molecule/organism
4. Create in `packages/ui/components/src/{level}/`
5. Export in index.ts
6. Build and document

### Creating a New Feature

1. Read `features/creating-features-guide.md`
2. Create three packages: `configuration/`, `api/`, `client/`
3. Follow Clean Architecture
4. Document in `docs/features/`
5. Update this index

### Creating a New Package

1. Read `features/creating-packages.md`
2. Follow the 14 steps
3. Document in `docs/features/`
4. Update this index

## Before Making Changes

1. Check `features/repository-configuration.md`
2. Review relevant docs in `docs/features/`
3. Update docs after changes

## Last Updated

27 January 2026 - Added code of conduct
