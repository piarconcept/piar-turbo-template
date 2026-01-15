# AI Context

This file works as an index for agents working on the project.

## Repository language policy
- The entire repository must be in English unless content is a translation for the website in other languages.

## Documentation guidelines (CRITICAL)

**ALWAYS follow these rules to maintain coherence and avoid inconsistencies:**

1. **Single Source of Truth**: All determinant decisions, architectural choices, and project rules MUST be documented in `docs/` or `docs/features/`.

2. **Mandatory documentation updates**: When you make ANY of the following changes, you MUST update the relevant documentation:
   - Add or modify project structure
   - Make architectural decisions
   - Define coding standards or conventions
   - Configure build tools or dependencies
   - Establish workflows or processes
   - Create new features or major functionality

3. **Documentation structure**:
   - `docs/AI-context.md` (this file): Index and main guidelines for AI agents
   - `docs/features/`: Detailed documentation for specific features, decisions, or components
   - Each feature should have its own dedicated markdown file in `docs/features/`

4. **Before making changes**: ALWAYS check existing documentation first to ensure consistency.

5. **After making changes**: ALWAYS update or create documentation to reflect what was done.

6. **Naming convention**: Use descriptive, kebab-case filenames (e.g., `authentication-flow.md`, `database-schema.md`)

7. **Keep index updated**: When adding new documentation files, IMMEDIATELY update the Features section below.

## Features
- Project setup: `docs/features/setup-proyecto.md`
- Repository configuration: `docs/features/repository-configuration.md` ⚠️ CRITICAL
- Documentation template: `docs/features/TEMPLATE.md` (use this for new features)

## How to use
- Add new features inside `docs/features/`.
- Keep this index updated when you add or rename files.
- NEVER make determinant changes without documenting them properly.
