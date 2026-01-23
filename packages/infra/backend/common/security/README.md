# @piar/infra-backend-common-security

NestJS security infrastructure for JWT authentication. Provides token creation, verification, and guards for protecting routes.

## Purpose

This package centralizes JWT handling for backend services. It exposes a security module, a token service, and guards that can be reused by feature modules.

## Exports

- `SecurityModule`
- `JwtTokenService`
- `JwtAuthGuard`
- `JwtPayload`
- `SecurityModuleOptions`

## Usage

```typescript
import { SecurityModule } from '@piar/infra-backend-common-security';

@Module({
  imports: [
    SecurityModule.register({
      secret: process.env.JWT_SECRET ?? 'change-me',
      expiresIn: '1h',
    }),
  ],
})
export class AuthModule {}
```

## Development

```bash
# Build
pnpm --filter @piar/infra-backend-common-security build

# Watch mode
pnpm --filter @piar/infra-backend-common-security dev

# Type check
pnpm --filter @piar/infra-backend-common-security typecheck

# Lint
pnpm --filter @piar/infra-backend-common-security lint
```
