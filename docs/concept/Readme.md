# Product Concept Documentation

## Purpose

The concept documentation is the source of truth for the product idea before implementation starts.

It describes what the product is, why it should exist, who it serves, which apps and surfaces it needs, which business rules shape it, and which features must be built first. A developer should be able to enter this folder, answer the questions progressively, and produce a clear enough product concept to plan waves, architecture, data models, APIs, and UI work without guessing.

## Why This Matters

A template can generate structure quickly, but it cannot choose the product strategy by itself. The concept layer prevents implementation from starting with vague assumptions.

Use this folder to:

- capture the product idea before code decisions harden,
- force the right product, UX, data, and business questions early,
- separate product intent from implementation details,
- make future feature waves easier to scope,
- give every agent or engineer the same context,
- preserve decisions that explain why the product is shaped a certain way.

If a later implementation decision conflicts with the concept, update the concept or document the reason for the change before continuing.

## Concept Documentation Tree

The concept should be organized as folders, not as a flat list of disconnected files. Each folder owns one product area, starts with its own `README.md`, and may contain deeper documents when the area needs more detail.

Use this structure by default when defining a new product from scratch:

```text
docs/concept/
  Readme.md

  initial-questions/
    README.md
    answers.md

  product/
    README.md
    idea.md
    positioning.md
    scope.md

  users/
    README.md
    audiences.md
    problems.md
    constraints.md

  apps/
    README.md
    app-map.md
    example-app/
      README.md

  domain/
    README.md
    entities.md
    relationships.md
    lifecycle-states.md
    data-visibility.md

  journeys/
    README.md
    primary-journeys.md
    admin-journeys.md
    edge-cases.md

  features/
    README.md
    feature-map.md
    mvp.md
    later.md
    dependencies.md

  rules/
    README.md
    business-rules.md
    permissions.md
    validation.md

  experience/
    README.md
    ux-guidelines.md
    content-and-communication.md
    localization.md

  operations/
    README.md
    integrations.md
    jobs-and-queues.md
    environment.md
    observability.md

  planning/
    README.md
    build-plan.md
    waves-input.md
    risks.md

  decisions/
    README.md
    YYYY-MM-DD-decision-title.md

  questions/
    README.md
    open-questions.md

  glossary.md
```

The tree can be smaller for simple products, but do not skip `initial-questions/`, `product/`, `users/`, `apps/`, `domain/`, `features/`, and `planning/` for a real product.

## Folder Responsibilities

### `initial-questions/`

Defines the first questions that must be answered when this template becomes a real project.

Use it before changing package names, replacing `@piar`, renaming Piar references, choosing apps, changing database technology, configuring auth, or creating implementation waves.

Answer:

- What is the product name and technical slug?
- What package scope should replace `@piar`?
- What organization or author name should replace Piar Concept?
- What is the short product summary?
- Which apps or surfaces are known, and which are still unknown?
- Which database should the product use?
- Does the product need auth and roles?
- Which locales, domains, providers, and environment assumptions are known?
- Should template identity be replaced globally now?

Suggested documents:

- `README.md` - required question gate and AI behavior.
- `answers.md` - project-specific answers once the user provides them.

### `product/`

Defines the product in plain language before implementation language appears.

Answer:

- What is the product?
- What problem does it solve?
- Why should it exist now?
- What is the strongest version of the idea?
- What is explicitly out of scope?
- What would make the product obviously useful to its target users?

Suggested documents:

- `README.md` - product summary and current status.
- `idea.md` - raw idea, problem, promise, and assumptions.
- `positioning.md` - category, alternatives, differentiation, and value proposition.
- `scope.md` - in-scope, out-of-scope, MVP, and future expansion.

### `users/`

Defines who the product serves and the real-world context around each audience.

Answer:

- Who are the primary users?
- Who are the secondary users?
- What do they already do today?
- What frustrates them?
- What are they trying to achieve?
- What constraints do they have: time, budget, knowledge, devices, language, regulation, internal process?

Suggested documents:

- `README.md` - user model overview.
- `audiences.md` - primary, secondary, internal, and admin users.
- `problems.md` - jobs to be done, pain points, and current alternatives.
- `constraints.md` - practical limits that affect product design.

### `apps/`

Defines every app, service, user surface, and internal surface in the concept. This folder is mandatory because each app must have a clear reason to exist before implementation starts.

Do not predefine real apps before the concept requires them. The implementation template may include common app types, but the concept must discover the actual product surfaces first.

The top-level `apps/README.md` should answer:

- Which apps exist?
- Who uses each app?
- Why does each app exist as a separate surface?
- What does each app own?
- What must each app never own?
- Which apps are user-facing, admin-facing, API-only, background-only, or integration-only?
- Which apps communicate with each other?
- Which app is the source of truth for each workflow?

The top-level `apps/app-map.md` should include one row per app:

```text
App | Type | Audience | Purpose | Main Responsibilities | Must Not Own | Depends On | MVP Required
```

Each app folder should answer:

- What is this app's job in the product concept?
- Which users or systems interact with it?
- Which surfaces are public, authenticated, internal, or admin-only?
- Which workflows start, continue, or end here?
- Which data can it read?
- Which data can it write?
- Which actions require authentication or authorization?
- Which feature areas does it expose?
- Which product decisions would change this app's scope?

`example-app/` exists only as a contract example. It is not part of the product concept and must not be treated as a required app. When a real product app is discovered, create a new folder under `apps/` using the actual app name and fill the same contract.

Do not mix app ownership into feature docs. A feature can appear in multiple apps, but each app folder must explain what that app does with the feature and why.

### `domain/`

Defines the business objects before implementation types are created.

Answer:

- What are the core entities?
- What fields does each entity need?
- Which fields are required, optional, computed, private, or public?
- What are the entity relationships?
- What lifecycle states exist?
- Which records need auditability?
- Which collections must be paginated, filtered, or searched?

Suggested documents:

- `README.md` - domain overview and naming rules.
- `entities.md` - core business entities and fields.
- `relationships.md` - entity relationships and ownership.
- `lifecycle-states.md` - status changes and transitions.
- `data-visibility.md` - public, private, admin-only, and sensitive data.

### `journeys/`

Defines the paths users take through the product.

Answer:

- What is the first successful user journey?
- What is the main repeated workflow?
- What happens before, during, and after each workflow?
- What errors or empty states are expected?
- Where does a user need confirmation, recovery, or undo?
- Which journeys must work on mobile?

Suggested documents:

- `README.md` - journey index.
- `primary-journeys.md` - main user-facing flows.
- `admin-journeys.md` - internal and backoffice flows.
- `edge-cases.md` - empty, error, recovery, and unusual flows.

### `features/`

Turns the concept into feature areas.

Answer:

- What are the major feature groups?
- Which features are required for MVP?
- Which features are follow-up work?
- Which features require domain models, repositories, BFF endpoints, backoffice pages, or public web pages?
- Which features depend on each other?
- Which feature should be built first and why?

Suggested documents:

- `README.md` - feature area overview.
- `feature-map.md` - product features grouped by area.
- `mvp.md` - first viable product scope.
- `later.md` - intentionally deferred features.
- `dependencies.md` - feature ordering and cross-feature dependencies.

### `rules/`

Captures invariant behavior that code must enforce.

Answer:

- What must always be true?
- What must never be allowed?
- Which actions require authorization?
- Which changes are reversible?
- Which records can be deleted, archived, hidden, or restored?
- Which validations are product rules rather than UI convenience?

Suggested documents:

- `README.md` - rules index.
- `business-rules.md` - product invariants.
- `permissions.md` - roles, ownership, and authorization.
- `validation.md` - field, workflow, and state validation.

### `experience/`

Defines UX, content, communication, and localization expectations.

Answer:

- Should the product feel operational, editorial, commercial, playful, or premium?
- Which workflows must be fast and dense?
- Which screens need rich explanation or storytelling?
- What should a user see first?
- What should never be hidden behind unclear navigation?
- Which interactions need loading, optimistic, empty, error, or success states?
- What tone should the product use?
- Which languages are required?
- Which terms must be consistent across all apps?

Suggested documents:

- `README.md` - experience principles.
- `ux-guidelines.md` - product UX direction and interaction expectations.
- `content-and-communication.md` - product language, messaging, emails, labels, and notifications.
- `localization.md` - required locales and translation priorities.

### `operations/`

Defines dependencies outside the local app.

Answer:

- Which third-party services are required?
- Which services are optional?
- Which jobs, queues, webhooks, cron tasks, or emails are needed?
- Which environment variables are required?
- What data can leave the system?
- What operational failures must be visible in logs or admin views?

Suggested documents:

- `README.md` - operational overview.
- `integrations.md` - external providers and service boundaries.
- `jobs-and-queues.md` - async work and scheduled tasks.
- `environment.md` - configuration and required variables.
- `observability.md` - logs, alerts, dashboards, and operational visibility.

### `planning/`

Connects the concept to implementation planning.

Answer:

- What is the smallest valuable build?
- Which feature wave should be created first?
- Which packages or apps will be touched?
- Which docs in `docs/features/` must be read or created?
- Which quality gates must pass?
- What must be proven before implementation is considered ready?

Suggested documents:

- `README.md` - planning status and implementation readiness.
- `build-plan.md` - first build scope and sequencing.
- `waves-input.md` - inputs that must be copied into `docs/waves/`.
- `risks.md` - technical, product, delivery, and operational risks.

### `decisions/`

Stores concept-level decisions that explain why the product is shaped a certain way.

Use one file per durable decision. Include:

- date,
- decision,
- context,
- options considered,
- consequences,
- when to revisit.

### `questions/`

Tracks unresolved product questions.

Each question should include:

- owner,
- current best assumption,
- why it matters,
- decision deadline,
- downstream work blocked by the answer.

### `glossary.md`

Defines product terms and avoids vocabulary drift.

Include:

- term,
- definition,
- accepted synonyms,
- forbidden synonyms,
- where the term appears in the product.

## App Concept Contract

Every app folder under `docs/concept/apps/` must use the same contract so app ownership stays comparable.

Each app `README.md` should include:

```text
# App Name

## Purpose

What this app does in the product concept.

## Audience

Who or what uses this app.

## Responsibilities

What this app owns.

## Non-Responsibilities

What this app must not own.

## Surfaces

Pages, route groups, API groups, workers, jobs, dashboards, or integrations exposed by this app.

## Data Ownership

What the app reads, writes, displays, hides, validates, or delegates.

## Authentication And Authorization

Who can access it and which actions need special permission.

## Related Features

Which feature areas this app exposes.

## Open Questions

Questions that block app scope, workflow, or implementation decisions.
```

Use this contract even for API-only or worker apps. A BFF still has a product responsibility: it defines a boundary, exposes capabilities, protects data, and decides which client workflows are possible.

## Progressive Discovery Questions

Answer these in order. Do not move to implementation waves until each answer is concrete enough to create ownership boundaries.

### Product

Answer:

- What exists?
- Why should it exist?
- Who cares enough to use it?
- What result does it create?
- What is not part of the product?

### Apps

Answer:

- Which apps are needed?
- What does each app do?
- Why is each app separate?
- Which app owns each critical workflow?
- Which app owns administration?
- Which app owns public discovery?
- Which app owns API boundaries?
- Which app owns background work?

### Domain

Answer:

- What are the main business objects?
- What relationships exist between them?
- What states can they be in?
- What can users create, update, delete, publish, archive, or restore?
- What data is private, public, sensitive, or operational?

### Features

Answer:

- What must be built first?
- Which feature proves the product works?
- Which features are admin-only?
- Which features are public-facing?
- Which features need APIs but no UI?
- Which features are intentionally deferred?

### Implementation Readiness

Answer:

- What is the smallest valuable build?
- Which app folders are complete enough to implement?
- Which domain entities are stable enough to model?
- Which open questions still block architecture?
- Which first wave should be created in `docs/waves/`?

## Development Workflow

Use this order before implementation:

1. Ask and answer `initial-questions/`.
2. Fill `product/`.
3. Fill `users/`.
4. Fill `apps/README.md` and `apps/app-map.md`.
5. Create one folder per real product app under `apps/` and fill each app contract.
6. Draft `domain/`.
7. Draft `journeys/`.
8. Convert journeys into `features/`.
9. Capture non-negotiable behavior in `rules/`.
10. Define language and UX expectations in `experience/`.
11. Identify integrations and operational constraints in `operations/`.
12. Produce `planning/build-plan.md`.
13. Create implementation waves in `docs/waves/`.
14. Start coding only after the first build wave has clear acceptance criteria.

Do not treat these files as static paperwork. Update them whenever a product decision changes during implementation.

## Quality Bar For A Complete Concept

A product concept is ready for implementation when all of these are true:

- the product can be explained in one paragraph,
- template identity replacement is decided,
- primary and secondary users are named,
- every app has its own folder, purpose, responsibilities, and non-responsibilities,
- every app surface is mapped to the app that owns it,
- core entities and relationships are listed,
- MVP features are separated from later features,
- business invariants are explicit,
- open questions are tracked instead of hidden,
- the first implementation wave can be created without guessing,
- the concept uses the same language that the UI, API, and documentation will use.

## Relationship With Other Documentation

- Use `docs/concept/` for product intent, product decisions, user context, and feature discovery.
- Use `docs/waves/` for staged implementation plans and agent execution prompts.
- Use `docs/features/` for stable implementation documentation after a feature exists or is being built.
- Use `docs/architecture/fixes/` for resolved architecture bugs.
- Use `docs/learning-log/` for reusable operational lessons.

## Last Updated

3 June 2026 - Added initial template questions before product concept and implementation work.
