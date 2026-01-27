# @piar/auth-infra-client

Client infrastructure package for authentication - HTTP repository implementation.

## Purpose

This package provides the HTTP adapter implementation of the `IAuthRepository` port defined in `@piar/auth-configuration`. It follows Clean Architecture principles by implementing the repository pattern for client-side authentication operations.

## Architecture

```
@piar/auth-configuration (ports/interfaces)
       ↓ implements
@piar/auth-infra-client (HttpAuthRepository)
       ↓ used by
apps/client/backoffice/auth.ts (NextAuth)
```

## Usage

```typescript
import { HttpAuthRepository } from '@piar/auth-infra-client';

const authRepository = new HttpAuthRepository(process.env.NEXT_PUBLIC_BACKOFFICE_BFF_URL);

// Login
const { account, session } = await authRepository.login({
  email: 'admin@piar.com',
  password: 'admin123',
});

// Register
const { account, session } = await authRepository.register({
  accountCode: 'ACC-001',
  email: 'user@example.com',
  password: 'securepassword',
});

// Forgot password
const { success, message } = await authRepository.forgotPassword({
  email: 'user@example.com',
});

// Update user role (admin only)
await authRepository.updateUserRole({
  email: 'user@example.com',
  role: 'admin',
});
```

## Integration with NextAuth

```typescript
// apps/client/backoffice/src/auth.ts
import { HttpAuthRepository } from '@piar/auth-infra-client';

const authRepository = new HttpAuthRepository(process.env.NEXT_PUBLIC_BACKOFFICE_BFF_URL!);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const { account, session } = await authRepository.login({
          email: credentials.email as string,
          password: credentials.password as string,
        });

        return {
          id: account.id,
          email: account.email!,
          name: account.name,
          role: account.role,
          accessToken: session.token,
        };
      },
    }),
  ],
});
```

## Error Handling

The repository throws structured errors that can be caught and handled:

```typescript
try {
  await authRepository.login({ email, password });
} catch (error) {
  // Error structure: { i18n, message, code, statusCode }
  const e = JSON.parse(error.message);
  console.error(e.i18n); // e.g., 'invalid_credentials'
}
```

## Development

```bash
# Build
pnpm --filter @piar/auth-infra-client build

# Type check
pnpm --filter @piar/auth-infra-client typecheck

# Watch mode
pnpm --filter @piar/auth-infra-client dev
```

## Dependencies

- `@piar/auth-configuration` - Port definitions and types
- `@piar/domain-models` - Domain entities (AccountEntity)
- `@piar/infra-client-common-error` - Error handling utilities

## Related Documentation

- [Auth Configuration](../configuration/README.md)
- [Auth API](../api/README.md)
- [Auth Backend Infrastructure](../infra/backend/README.md)
