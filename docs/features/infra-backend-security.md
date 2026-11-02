# Infra Backend Security (JWT)

## Description

Shared backend security package that provides JWT token creation, verification, and guards for NestJS services.

## Location

`packages/infra/backend/common/security`

## Exports

- `SecurityModule`
- `JwtTokenService`
- `JwtAuthGuard`
- `AdminGuard`
- `JwtPayload`
- `SecurityModuleOptions`
- `resolveAllowedOrigins`

## Usage

```typescript
import { SecurityModule } from '@piar/infra-backend-common-security';
import { resolveJwtSecret } from '@piar/auth-api';

@Module({
  imports: [
    SecurityModule.register({
      secret: resolveJwtSecret(),
      expiresIn: '1h',
    }),
  ],
})
export class AuthModule {}
```

## Notes

- The auth module fails startup when `JWT_SECRET` is missing, shorter than 32 characters, or a known
  placeholder. Generate an independent value with `openssl rand -base64 48`.
- Guards use the Authorization header with the Bearer scheme.
- `JwtAuthGuard` rejects refresh tokens on access-token routes.
- Production CORS configuration requires explicit exact origins and rejects wildcards and local
  addresses.
- `packages/infra/backend/common/security/tests` contains anonymous, regular-user and administrator
  negative-path evidence.

## Last Updated

2 November 2026 - Added fail-closed secrets, authorization evidence and strict CORS policy
