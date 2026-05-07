# Waves Workflow

## Purpose

Feature work in this template should be planned as execution waves whenever the scope is larger than a small linear fix.

Waves keep Codex chats, agents, and worktrees aligned around explicit ownership, integration order, QA, and handoff evidence.

## Canonical Location

Use `docs/waves/` for wave plans and prompts.

Start from:

- `../waves/README.md`
- `../waves/template-day.md`
- `../waves/template-wave.md`
- `../waves/template-prompt.md`

## When To Use Waves

Use waves by default for:

- new features,
- feature migrations from product repositories back into the template,
- multi-package refactors,
- UI/API work that needs visual or integration QA,
- work split across multiple agents, chats, or worktrees,
- production-safety changes that need staged rollout.

Tiny one-file fixes can skip a wave only when the task is clearly linear and no future handoff value is created by a wave plan.

## Standard Feature Wave Shape

Adapt the exact shape to the feature, but start with this default:

1. Wave 0 - scope, source docs, package map, ownership plan, and quality gates.
2. Wave 1 - contracts, domain models, field configs, DTOs, and message keys.
3. Wave 2 - repositories, feature API packages, and BFF wiring.
4. Wave 3 - client surfaces, backoffice/web flows, and user-facing states.
5. Wave 4 - tests, test participation policy, documentation, and learning-log updates.
6. Wave 5 - cleanup, artifact hygiene, final QA, and `pnpm clean`.

Do not force all six waves when the scope is smaller. The important rule is that each wave has clear ownership, clear dependencies, and a real exit gate.

## Required Gate Per Wave

Each wave must define:

- objective,
- files or folders under ownership,
- forbidden edit areas,
- acceptance criteria,
- QA Tester Definition of Done,
- suggested verification commands,
- expected handoff format,
- and residual risks to report.

## Integration Rules

- Prompts in a parallel wave must have disjoint write sets.
- A prompt that needs to cross ownership must stop and report before editing.
- Integrate one wave before starting a dependent wave.
- Run the wave QA prompt after implementation prompts are integrated.
- If QA finds shared contract drift or conflicts, create an integrator wave before continuing.

## Cleanup Rule

Before final handoff for feature work, run:

```bash
pnpm clean
```

This formats tracked and unignored files, cleans generated artifacts, checks artifact hygiene, and finishes with full verification.

## Related Documentation

- `../waves/README.md`
- `creating-features-guide.md`
- `template-baseline-and-feature-migration.md`
- `quality-gates.md`
- `context-engineering-protocol.md`

## Last Updated

7 May 2026 - Added wave-first feature workflow for template projects
