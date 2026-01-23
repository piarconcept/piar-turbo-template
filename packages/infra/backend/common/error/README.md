# @piar/infra-backend-common-error

NestJS error handling infrastructure for BFF applications.

## Features

- Global exception filter for ApplicationError
- Error response interceptor
- Automatic serialization of domain errors to HTTP responses

## Usage

### In BFF Application

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ApplicationErrorFilter, ErrorResponseInterceptor } from '@piar/infra-backend-common-error';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: ApplicationErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorResponseInterceptor,
    },
  ],
})
export class AppModule {}
```

### Throwing Errors

```typescript
import { InvalidCredentialsError } from '@piar/domain-models';

// In your service or repository
throw new InvalidCredentialsError('Invalid email or password', undefined, 'errors.auth.invalidCredentials');
```

### Response Format

```json
{
  "code": 2003,
  "message": "Invalid email or password",
  "statusCode": 401,
  "i18nKey": "errors.auth.invalidCredentials",
  "timestamp": "2026-01-23T10:30:00.000Z"
}
```

## Development

```bash
# Build
pnpm --filter @piar/infra-backend-common-error build

# Watch mode
pnpm --filter @piar/infra-backend-common-error dev

# Test
pnpm --filter @piar/infra-backend-common-error test
```
