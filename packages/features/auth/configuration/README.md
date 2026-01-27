# @piar/auth-configuration

Configuration package for the Auth feature. Contains ports (interfaces) following Clean Architecture principles.

## Purpose

This package defines the contracts and interfaces for authentication functionality. It represents the domain layer in Clean Architecture, containing only interfaces and types without any implementation details.

## Architecture

Following **Clean Architecture**, this package contains:

- **Ports**: Interfaces that define contracts for external dependencies
- **Types**: Domain types and data structures

## Exports

### Ports

- `IAuthRepository`: Repository interface for auth operations

### Types

- `AccountEntity`
- `AuthSession`
- `AccountRole`
- `LoginRequest`
- `LoginResponse`
- `RegisterRequest`
- `RegisterResponse`
- `ForgotPasswordRequest`
- `ForgotPasswordResponse`
- `UpdateUserRoleRequest`
- `UpdateUserRoleResponse`

## Usage

```typescript
import { AccountEntity } from '@piar/domain-models';
import { IAuthRepository, LoginRequest } from '@piar/auth-configuration';

class HttpAuthRepository implements IAuthRepository {
  async login(payload: LoginRequest) {
    return {
      account: new AccountEntity({
        id: '1',
        accountCode: 'USR-001',
        email: payload.email,
        role: 'user',
      }),
      session: { token: 'token', expiresAt: new Date().toISOString() },
    };
  }

  async register(payload) {
    return {
      account: new AccountEntity({
        id: '1',
        accountCode: payload.accountCode,
        email: payload.email,
        role: 'user',
      }),
    };
  }

  async forgotPassword(payload) {
    return {
      success: true,
      message: `Reset email sent to ${payload.email}`,
    };
  }

  async updateUserRole(payload) {
    return {
      account: new AccountEntity({
        id: payload.userId,
        accountCode: 'USR-001',
        email: 'user@piar.com',
        role: payload.role,
      }),
    };
  }
}
```

## Dependencies

This package depends on `@piar/domain-models` to ensure all auth types are based on the shared Account entity.

## Development

```bash
# Build
pnpm --filter @piar/auth-configuration build

# Watch mode
pnpm --filter @piar/auth-configuration dev

# Type check
pnpm --filter @piar/auth-configuration typecheck

# Lint
pnpm --filter @piar/auth-configuration lint

# Test
pnpm --filter @piar/auth-configuration test
```

## Clean Architecture Layers

```
┌─────────────────────────────────────────┐
│   @piar/auth-client (Use Cases)        │
│   - Business Logic                      │
│   - Application Layer                   │
└──────────────┬──────────────────────────┘
               │ depends on
               ▼
┌─────────────────────────────────────────┐
│   @piar/auth-configuration (Ports)     │ ◄── YOU ARE HERE
│   - Interfaces                          │
│   - Domain Types                        │
│   - No dependencies                     │
└──────────────▲──────────────────────────┘
               │ implements
               │
┌──────────────┴──────────────────────────┐
│   @piar/auth-api (Adapters)            │
│   - HTTP Implementation                 │
│   - External Dependencies               │
└─────────────────────────────────────────┘
```

## Related Packages

- `@piar/auth-api`: API adapter implementation
- `@piar/auth-client`: Client-side use cases and controllers
