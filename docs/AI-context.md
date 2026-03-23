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
   - `docs/learning-log/` = resolved incidents, regressions, and non-obvious fixes
4. **Naming**: Use kebab-case filenames (e.g., `authentication-flow.md`).
5. **Index maintenance**: Update this index whenever a doc is added/removed.
6. **Learning capture**: Any non-trivial fix, incident, workaround, or reusable debugging lesson must be logged in `docs/learning-log/`.

## Documentation Index

### Setup & Configuration

1. `features/setup-project.md` - Initial setup and project structure
2. `features/repository-configuration.md` - Monorepo rules and conventions
3. `features/github-workflows.md` - CI/CD workflows
4. `features/bff-architecture.md` - BFF architecture patterns

### Development Guides

5. `features/creating-packages.md` - 14-step guide for creating packages
6. `features/creating-features-guide.md` - Feature creation with Clean Architecture
7. `features/template-baseline-and-feature-migration.md` - Current baseline and migration workflow
8. `features/component-library-development-guide.md` - Component library workflow
9. `features/testing-guide.md` - Testing standards and examples
10. `features/eslint-configuration.md` - ESLint configuration and linting
11. `features/quality-gates.md` - Formatting, commit hooks, and commit rules
12. `features/styling-configuration.md` - Styling approach overview
13. `features/tailwind-v4-implementation.md` - Tailwind v4 implementation details
14. `features/context-engineering-protocol.md` - Rules for documenting important fixes and learnings

### Package Documentation

15. `features/domain-models.md` - `@piar/domain-models`
16. `features/domain-fields.md` - `@piar/domain-fields`
17. `features/ui-components-atomic-design.md` - `@piar/ui-components`
18. `features/auth-card-refactoring.md` - AuthCard refactor notes
19. `features/health-feature.md` - Health feature architecture
20. `features/auth-feature.md` - Auth feature architecture
21. `features/infra-backend-security.md` - Backend security package
22. `features/infra-client-seo.md` - SEO infrastructure
23. `features/error-handling-system.md` - Error handling system
24. `features/nextauth-authentication.md` - NextAuth v5 in backoffice

### Applications

25. `features/web-bff-application.md` - Web BFF documentation
26. `features/backoffice-bff-application.md` - Backoffice BFF documentation

### Templates

27. `features/TEMPLATE.md` - Template for new docs

### Operational Learning

28. `learning-log/README.md` - Index of resolved incidents and important fixes
29. `learning-log/TEMPLATE.md` - Template for learning-log entries

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
2. Read `features/template-baseline-and-feature-migration.md`
3. Create required layers (`domain`, `fields`, `repositories`, feature packages, BFF wiring)
4. Follow Clean Architecture
5. Document in `docs/features/`
6. Update this index

### Creating a New Package

1. Read `features/creating-packages.md`
2. Follow the 14 steps
3. Document in `docs/features/`
4. Update this index

### Documenting an Important Fix

1. Read `features/context-engineering-protocol.md`
2. Create or update a note in `docs/learning-log/`
3. Use `learning-log/TEMPLATE.md`
4. Update the relevant feature doc if the fix changes long-term behavior
5. Update this index only when docs are added or removed

## Before Making Changes

1. Check `features/repository-configuration.md`
2. Review relevant docs in `docs/features/`
3. Review `docs/learning-log/` when working on a repeated or unclear failure
4. Update docs after changes

## Last Updated

10 March 2026 - Aligned context engineering docs with the learning-log workflow
