# Concept Apps

## Purpose

This folder defines the apps and app-like surfaces that exist in the product concept.

Each app must have a clear product responsibility before implementation starts. A feature can span multiple apps, but app ownership must stay explicit so product surfaces, admin surfaces, APIs, workers, and integrations do not blur into one unclear surface.

This folder intentionally does not predefine the real apps for a product. When a concept starts, you do not know yet whether the product needs a public website, a backoffice, a mobile app, a BFF, workers, integrations, or something else. Discover the apps first, then create one folder per real app.

## App Map

Create `app-map.md` when real apps are known. Use this table shape:

| App             | Type                          | Audience    | Purpose       | Main Responsibilities | Must Not Own         | Depends On              | MVP Required |
| --------------- | ----------------------------- | ----------- | ------------- | --------------------- | -------------------- | ----------------------- | ------------ |
| `real-app-name` | Client/API/worker/integration | Who uses it | Why it exists | What it owns          | What it must not own | Related apps or systems | Yes/No       |

The row above is a placeholder. Replace it with real product apps.

## Required App Contract

Every app folder must answer the same questions:

- What is this app's job in the product concept?
- Which users or systems interact with it?
- Which surfaces are public, authenticated, internal, or admin-only?
- Which workflows start, continue, or end here?
- Which data can it read?
- Which data can it write?
- Which actions require authentication or authorization?
- Which feature areas does it expose?
- Which product decisions would change this app's scope?

## App Ownership Rule

An app should own a workflow only when that workflow naturally belongs to its audience and trust boundary.

- Public discovery belongs in the app that owns public discovery for this product.
- Authenticated customer work belongs in the app that owns authenticated customer work for this product.
- Internal operations belong in the app that owns internal operations for this product.
- API capabilities belong in the app or service that owns the relevant trust boundary.
- Delayed, scheduled, or retryable work belongs in a worker-like app only if the product needs that execution model.
- External provider behavior belongs in an integration-like surface only if the product needs that provider.

When a feature spans apps, document the split here first, then turn it into implementation waves.

## Example App

`example-app/` is included only to show the app documentation contract.

It is not a real product app. It is not a recommendation. It is not required by the template. When a real app is discovered, create a new folder with the real app name and use the same contract.

## Last Updated

3 June 2026 - Reworked apps concept docs so real apps are discovered, with one example app only.
