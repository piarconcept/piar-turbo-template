# @piar/accounts-api

NestJS API package for backoffice account administration.

## Purpose

This package owns the accounts HTTP controllers, DTOs, use cases, and module wiring.
Backoffice BFF apps should import `AccountsModule.register(...)` instead of keeping
feature implementation code inside `apps/api/*`.

## Endpoints

- `GET /accounts`
- `GET /accounts/:id`
- `PATCH /accounts/:id`
- `DELETE /accounts/:id`

## Development

```bash
pnpm --filter @piar/accounts-api typecheck
pnpm --filter @piar/accounts-api build
pnpm --filter @piar/accounts-api test
```
