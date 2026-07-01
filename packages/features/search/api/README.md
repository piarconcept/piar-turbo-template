# @piar/search-api

NestJS API package for backoffice search.

## Purpose

This package owns the backoffice search controller, response types, use cases,
and module wiring. BFF apps should import `SearchModule.register(...)` instead
of keeping search feature implementation code inside `apps/api/*`.

## Endpoints

- `GET /search?q=...&locale=...&limitPerCollection=...`

## Development

```bash
pnpm --filter @piar/search-api typecheck
pnpm --filter @piar/search-api build
pnpm --filter @piar/search-api test
```
