# Execution Waves

## Purpose

Define the canonical documentation contract for splitting substantial repository work into small, reviewable, multi-agent execution waves.

This structure replaces ad-hoc prompt accumulation when work has:

- parallel ownership,
- explicit integration dependencies,
- QA requirements,
- production-safety sequencing,
- or a need to resume execution cleanly after interruptions.

## Scope

Use `docs/waves/` by default for feature work and for every multi-agent execution plan.

At minimum, create or update wave docs when one or more of these are true:

- multiple Codex chats, agents, or worktrees will run in parallel,
- ownership boundaries must be enforced explicitly,
- integration or rollout order matters,
- QA needs a standalone prompt and definition of done,
- a later engineer should be able to resume execution from docs alone.

Tiny one-file fixes can skip a wave only when the task is clearly linear and does not create reusable planning value.

## Repository Rules

- Keep all wave docs in English.
- Keep prompts standalone and copy-pasteable into a fresh Codex chat.
- Use Madrid local dates in folder names.
- Update `docs/AI-context.md` and `docs/README.md` when adding or removing wave docs.
- If a wave resolves a reusable operational incident, also update `docs/learning-log/`.
- If a wave changes a stable architecture or workflow rule, update the relevant document in `docs/features/`.

## Directory Layout

```text
docs/waves/
  README.md
  template-day.md
  template-wave.md
  template-prompt.md
  YYYY-MM-DD/
    README.md
    YYYY-MM-DD_wave_1/
      README.md
      YYYY-MM-DD_wave_1_prompt_AA.md
      YYYY-MM-DD_wave_1_prompt_AB.md
      YYYY-MM-DD_wave_1_prompt_QA.md
```

## Naming Rules

- Day folder: `YYYY-MM-DD`
- Wave folder: `YYYY-MM-DD_wave_<n>`
- Prompt file: `YYYY-MM-DD_wave_<n>_prompt_<id>.md`
- Prompt identifiers use uppercase letters such as `AA`, `AB`, `AC`, `BA`
- Reserve `QA` for the wave QA or integration prompt

## Wave Types

Use one of these types explicitly in each wave README:

- `parallel` - independent prompts with disjoint write sets
- `integrator` - reconcile outputs from previous prompts or previous waves
- `qa` - standalone validation wave
- `analysis-contract` - inventory, decision, or migration-matrix work before code changes
- `sequential-prod-safe` - ordered execution where production safety forbids parallel edits

If another type is needed, document it explicitly in the wave README and explain why the standard set was not sufficient.

## Required Files

### Day README

Each `docs/waves/YYYY-MM-DD/README.md` must explain:

- the purpose of the day,
- the source documents or upstream audits,
- the wave index for that day,
- execution order across waves,
- integration rules across waves,
- and day-level success criteria.

### Wave README

Each `docs/waves/YYYY-MM-DD/YYYY-MM-DD_wave_<n>/README.md` must explain:

- wave type,
- objective,
- dependencies,
- prompt index,
- execution order inside the wave,
- integration criteria,
- and non-goals or safety rules.

### Prompt File

Each prompt file must include:

- the exact chat title to use,
- mandatory start context,
- read-first documents,
- ownership and forbidden edit areas,
- task or implementation expectations,
- acceptance criteria,
- `QA Tester Definition of Done`,
- suggested verification commands,
- and expected handoff format.

## Execution Rules

- Every prompt must have a clearly bounded write set.
- Prompts in a `parallel` wave must have disjoint write sets.
- If a required change crosses ownership, the prompt must stop and report instead of improvising.
- A later wave starts only when its dependencies are landed or explicitly documented as blocked.
- Every wave should include a QA prompt unless the day README documents why QA is deferred to a later dedicated wave.
- The QA prompt runs only after the wave outputs are integrated.
- If QA finds integration conflicts, create an `integrator` wave before continuing.
- Prompts must report concrete files changed, commands run, what passed, what failed, and residual risks.

## Prompt QA Standard

A QA prompt is not a generic checklist. It must ask the agent to:

- review `git diff` and ownership boundaries,
- search for regressions across integrated prompts,
- run the smallest relevant build, test, typecheck, lint, or `pnpm verify` commands,
- validate edge cases from the implementation prompts,
- confirm prohibited patterns did not reappear,
- leave prioritized findings with file and line references,
- and avoid code fixes unless the prompt explicitly authorizes tightly scoped QA fixes.

## Implementation Report

When a wave changes production behavior or spans multiple prompts, close it with a short report in the wave folder. Include:

- summary of integrated changes,
- files or areas touched,
- verification commands and results,
- QA findings and fixes,
- residual risks,
- follow-up waves or blockers,
- and reusable learnings for future waves.

## Last Updated

7 May 2026 - Added the template execution waves contract
