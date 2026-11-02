# @piar/infra-backend-common-error

NestJS error handling infrastructure for BFF applications.

## Features

- Global exception filter for ApplicationError
- Error response interceptor
- Safe serialization of domain errors to HTTP responses
- Random event IDs for support correlation without reflecting raw error data
- Metadata-only logs without URLs, submitted values, exception messages, details, or stacks

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
throw new InvalidCredentialsError(
  'Invalid email or password',
  undefined,
  'errors.auth.invalidCredentials',
);
```

### Response Format

```json
{
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid credentials",
  "statusCode": 401,
  "details": { "eventId": "4c76395b-3197-4b10-88f0-0dd1847c7851" },
  "i18nKey": "errors.auth.invalidCredentials",
  "timestamp": "2026-01-23T10:30:00.000Z"
}
```

Application code may retain detailed errors internally, but the BFF filter returns a stable safe
message and event identifier. Do not reintroduce raw exception objects or request URLs into logs.

## Development

```bash
# Build
pnpm --filter @piar/infra-backend-common-error build

# Watch mode
pnpm --filter @piar/infra-backend-common-error dev

# Test
pnpm --filter @piar/infra-backend-common-error test
```
