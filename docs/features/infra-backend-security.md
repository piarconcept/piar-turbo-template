# Infra Backend Security (JWT)

## Description

Shared backend security package that provides JWT token creation, verification, and guards for NestJS services.

## Location

`packages/infra/backend/common/security`

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

## Notes

- JWT secret and expiration are provided by the consumer module.
- Guards use the Authorization header with the Bearer scheme.
