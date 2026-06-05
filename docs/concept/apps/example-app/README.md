# Example App

## Example Only

This folder is only an example of how to document an app once the concept has discovered that the app is needed.

Do not treat `example-app` as part of the product. Do not implement it. Do not copy its name into implementation waves. Replace it with real app folders only after answering the concept questions in `docs/concept/apps/README.md`.

## Purpose

Explain what this app does in the product concept and why it deserves to exist as a separate surface.

## Audience

Describe who or what uses this app.

Examples:

- public visitors,
- authenticated customers,
- internal administrators,
- operators,
- external systems,
- background processes.

## Responsibilities

List what this app owns.

Examples:

- public discovery,
- authenticated workspace,
- admin operations,
- API boundary,
- background processing,
- external integration flow.

## Non-Responsibilities

List what this app must not own. This is as important as responsibilities because it prevents app boundaries from becoming vague.

## Surfaces

List pages, route groups, API groups, workers, jobs, dashboards, webhooks, or integrations exposed by this app.

## Data Ownership

Document what the app can read, write, display, hide, validate, or delegate.

## Authentication And Authorization

Document who can access the app and which actions need special permission.

## Related Features

List the product feature areas this app exposes.

## Open Questions

Track questions that block app scope, workflow, or implementation decisions.

## Last Updated

3 June 2026 - Created the single example app contract for concept discovery.
