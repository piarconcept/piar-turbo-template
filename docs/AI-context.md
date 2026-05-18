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
   - `docs/waves/` = multi-agent execution wave plans, templates, and dated prompt batches
   - `docs/architecture/fixes/` = resolved architecture bugs and structural lessons
   - `docs/learning-log/` = resolved incidents, regressions, and non-obvious fixes
4. **Naming**: Use kebab-case filenames (e.g., `authentication-flow.md`).
5. **Index maintenance**: Update this index whenever a doc is added/removed.
6. **Architecture learning capture**: Every resolved architecture bug must be documented in `docs/architecture/fixes/`.
7. **Operational learning capture**: Any non-trivial fix, incident, workaround, or reusable debugging lesson that is not primarily architectural must be logged in `docs/learning-log/`.

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
15. `features/waves-workflow.md` - Wave-first planning workflow for feature work and multi-agent execution

### Execution Waves

16. `waves/README.md` - Canonical execution waves contract
17. `waves/template-day.md` - Template for day-level wave orchestration
18. `waves/template-wave.md` - Template for a single wave definition
19. `waves/template-prompt.md` - Template for a standalone wave prompt

### Package Documentation

20. `features/domain-models.md` - `@piar/domain-models`
21. `features/domain-fields.md` - `@piar/domain-fields`
22. `features/ui-components-atomic-design.md` - `@piar/ui-components`
23. `features/auth-card-refactoring.md` - AuthCard refactor notes
24. `features/health-feature.md` - Health feature architecture
25. `features/auth-feature.md` - Auth feature architecture
26. `features/infra-backend-security.md` - Backend security package
27. `features/infra-client-seo.md` - SEO infrastructure
28. `features/error-handling-system.md` - Error handling system
29. `features/nextauth-authentication.md` - NextAuth v5 in backoffice

### Applications

30. `features/web-bff-application.md` - Web BFF documentation
31. `features/backoffice-bff-application.md` - Backoffice BFF documentation

### Templates

32. `features/TEMPLATE.md` - Template for new docs

### Architecture Fix Memory

33. `architecture/fixes/README.md` - Index and rules for architecture fix notes
34. `architecture/fixes/TEMPLATE.md` - Template for architecture fix notes
35. `architecture/fixes/2026-05-08-bounded-list-contract.md` - Bounded collection-query contract and removal of whole-table `getAll` reads
36. `architecture/fixes/2026-05-07-template-wave-clean-baseline.md` - Wave workflow, clean command, and verification hardening baseline

### Operational Learning

37. `learning-log/README.md` - Index of resolved incidents and important fixes
38. `learning-log/TEMPLATE.md` - Template for learning-log entries

## Repository Governance

- `CONTRIBUTING.md` - Contribution workflow and commit rules
- `AGENTS.md` - Agent entrypoint that redirects to this file and the wave workflow
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
3. Read `features/waves-workflow.md`
4. Create or update `docs/waves/` when the feature is larger than a tiny linear fix
5. Create required layers (`domain`, `fields`, `repositories`, feature packages, BFF wiring)
6. Follow Clean Architecture
7. Document in `docs/features/`
8. Update this index

### Creating a New Package

1. Read `features/creating-packages.md`
2. Follow the 14 steps
3. Document in `docs/features/`
4. Update this index

### Documenting an Important Fix

1. Read `features/context-engineering-protocol.md`
2. If the root cause is architectural, create or update a note in `docs/architecture/fixes/`
3. If the fix is non-architectural but reusable, create or update a note in `docs/learning-log/`
4. Use the matching template in that directory
5. Update the relevant wave plan if the work was executed through multi-agent prompts
6. Update the relevant feature doc if the fix changes long-term behavior
7. Update this index only when docs are added or removed

## Before Making Changes

1. Check `features/repository-configuration.md`
2. Review relevant docs in `docs/features/`
3. Review `docs/waves/` when planning or resuming feature work, multi-agent execution, or staged migrations
4. Review `docs/architecture/fixes/` when working on a repeated or structural failure
5. Review `docs/learning-log/` when working on a repeated or unclear operational failure
6. Update docs after changes

## Last Updated

8 May 2026 - Added bounded list contract architecture fix to the index
