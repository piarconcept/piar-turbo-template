# @piar/auth-infra-backend

Backend infrastructure package for the Auth feature. It provides a concrete implementation of the auth port and will be connected to the global infrastructure later.

## Purpose

This package resolves the auth port with a repository class. It is responsible for verifying login credentials and coordinating auth-related operations.

## Exports

- `AuthRepository`: In-memory auth repository implementing `IAuthRepository`

## Development

```bash
# Build
pnpm --filter @piar/auth-infra-backend build

# Watch mode
pnpm --filter @piar/auth-infra-backend dev

# Type check
pnpm --filter @piar/auth-infra-backend typecheck

# Lint
pnpm --filter @piar/auth-infra-backend lint
```
