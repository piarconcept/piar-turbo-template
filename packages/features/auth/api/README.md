# @piar/auth-api

NestJS API implementation for the Auth feature. Contains controllers, use cases, and module configuration following Clean Architecture principles.

## Purpose

This package implements the infrastructure layer for authentication with NestJS. It provides HTTP endpoints and orchestrates use cases for login, registration, forgot password, and user role updates.

## Architecture

Following **Clean Architecture**, this package contains:

- **Controllers**: NestJS HTTP entry points
- **Use Cases**: Business logic and orchestration
- **Modules**: NestJS dependency injection setup

## Exports

- `AuthModule`: NestJS module for authentication endpoints
- `AuthController`: Controller for auth routes
- Auth use-case interfaces and executors

## Endpoints

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/forgot-password`
- `PATCH /auth/roles`

## Development

```bash
# Build
pnpm --filter @piar/auth-api build

# Watch mode
pnpm --filter @piar/auth-api dev

# Type check
pnpm --filter @piar/auth-api typecheck

# Lint
pnpm --filter @piar/auth-api lint

# Test
pnpm --filter @piar/auth-api test
```

## Related Packages

- `@piar/auth-configuration`: Domain ports and types
