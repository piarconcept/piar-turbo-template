# Error Handling System

## Purpose

Complete centralized error handling system that ensures consistent, structured error responses across the entire monorepo, from backend to frontend.

## Status

- [x] Completed - Domain error entities
- [x] Completed - Backend infrastructure (filters)
- [x] Completed - Client infrastructure (deserializers, hooks)
- [x] Completed - Integration in BFFs
- [x] Completed - Swagger documentation

## Key Decisions

### 1. Domain-First Approach

**Decision**: All errors are domain entities (`ApplicationError`) defined in `@piar/domain-models`

**Why**:

- Single source of truth for error structure
- Shared between backend and frontend (type-safe)
- Serializable (can travel through HTTP)
- Framework-agnostic (pure TypeScript)

### 2. Automatic Error Conversion

**Decision**: The `GlobalExceptionFilter` converts ANY error into a domain error

**Why**:

- Frontend ALWAYS receives the same structured format
- No need for `try-catch` everywhere
- Easier to deserialize and display errors
- Consistent error handling across all endpoints

### 3. APP_FILTER Provider Pattern

**Decision**: Use NestJS `APP_FILTER` instead of `app.useGlobalFilters()`

**Why**:

- Proper dependency injection support
- Filters have access to NestJS context
- Recommended by NestJS documentation
- Easier to test and maintain

## Architecture

### Layer Structure

```
┌─────────────────────────────────────────────────────────┐
│                    DOMAIN LAYER                          │
│  @piar/domain-models/src/errors/                        │
│  - application-error.ts (base class)                    │
│  - error-codes.ts (13 error codes + HTTP mapping)       │
│  - specific-errors.ts (8 error classes)                 │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│              INFRASTRUCTURE LAYER                        │
│                                                          │
│  BACKEND (@piar/infra-backend-common-error)             │
│  - ApplicationErrorFilter (catches domain errors)       │
│  - GlobalExceptionFilter (converts all to domain)       │
│                                                          │
│  CLIENT (@piar/infra-client-common-error)               │
│  - deserializeHttpError() (Response → ApplicationError) │
│  - useErrorHandler() (React error state)                │
│  - ErrorBoundary (catches React errors)                 │
│  - wrapServerAction() (Next.js Server Actions)          │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│               APPLICATION LAYER                          │
│  - BFFs register filters with APP_FILTER                │
│  - Controllers throw domain errors                       │
│  - Use-cases throw domain errors                         │
│  - Repositories throw domain errors                      │
└─────────────────────────────────────────────────────────┘
```

## Technical Details

### Domain Layer: Error Entities

#### ErrorCode Enum (13 codes)

```typescript
export enum ErrorCode {
  // General errors (1xxx)
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  // Authentication errors (2xxx)
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',

  // Resource errors (3xxx)
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',

  // Business errors (4xxx)
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
}
```

**HTTP Status Mapping**:

```typescript
export const ErrorCodeHttpStatus: Record<ErrorCode, number> = {
  [ErrorCode.INTERNAL_SERVER_ERROR]: 500,
  [ErrorCode.BAD_REQUEST]: 400,
  [ErrorCode.VALIDATION_ERROR]: 400,
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.FORBIDDEN]: 403,
  [ErrorCode.INVALID_CREDENTIALS]: 401,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.RESOURCE_ALREADY_EXISTS]: 409,
  [ErrorCode.BUSINESS_RULE_VIOLATION]: 422,
  // ... etc
};
```

#### ApplicationError (Base Class)

```typescript
export class ApplicationError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;
  public readonly timestamp: string;
  public readonly i18nKey?: string;

  constructor(
    code: ErrorCode,
    message: string,
    details?: Record<string, unknown>,
    i18nKey?: string,
  ) {
    super(message);
    this.name = 'ApplicationError';
    this.code = code;
    this.statusCode = ErrorCodeHttpStatus[code];
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.i18nKey = i18nKey;
  }

  toJSON(): SerializableError {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp,
      i18nKey: this.i18nKey,
    };
  }

  static fromJSON(json: SerializableError): ApplicationError {
    return new ApplicationError(json.code, json.message, json.details, json.i18nKey);
  }
}
```

**Key features**:

- ✅ Extends `Error` (can be thrown)
- ✅ Serializable via `toJSON()`
- ✅ Deserializable via `fromJSON()` (isomorphic)
- ✅ Automatic HTTP status code from ErrorCode
- ✅ i18nKey for internationalization support
- ✅ Details object for additional context

#### Specific Error Classes (8 classes)

```typescript
// Authentication errors
export class UnauthorizedError extends ApplicationError
export class InvalidCredentialsError extends ApplicationError
export class TokenExpiredError extends ApplicationError
export class ForbiddenError extends ApplicationError

// Resource errors
export class NotFoundError extends ApplicationError
export class ResourceAlreadyExistsError extends ApplicationError

// Validation errors
export class ValidationError extends ApplicationError

// Business errors
export class BusinessRuleViolationError extends ApplicationError

// Server errors
export class InternalServerError extends ApplicationError
```

**Usage example**:

```typescript
// In repository
if (!account) {
  throw new NotFoundError('Account', email, 'errors.account.not_found');
}

if (!passwordMatch) {
  throw new InvalidCredentialsError(
    'Invalid email or password',
    undefined,
    'errors.auth.invalid_credentials',
  );
}

// Error automatically includes:
// - code: 'NOT_FOUND' or 'INVALID_CREDENTIALS'
// - statusCode: 404 or 401
// - timestamp: '2026-01-23T12:00:00.000Z'
// - i18nKey: 'errors.account.not_found'
```

### Infrastructure Layer: Backend

#### ApplicationErrorFilter

```typescript
@Catch(ApplicationError)
export class ApplicationErrorFilter implements ExceptionFilter {
  catch(exception: ApplicationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const errorResponse = exception.toJSON();

    // Log for monitoring
    this.logger.error(`${request.method} ${request.url} - ${exception.message}`, {
      code: exception.code,
      statusCode: exception.statusCode,
      details: exception.details,
      i18nKey: exception.i18nKey,
      stack: exception.stack,
    });

    // Send structured response
    response.status(exception.statusCode).json(errorResponse);
  }
}
```

**Purpose**: Catches domain errors and sends them as JSON to the client.

**Flow**:

1. Domain error thrown anywhere in the app
2. Filter catches it
3. Logs error details for monitoring
4. Converts to JSON via `toJSON()`
5. Returns HTTP response with correct status code

#### GlobalExceptionFilter

```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // HttpException → InternalServerError (domain)
    if (exception instanceof HttpException) {
      const message = /* extract message */;
      const domainError = new InternalServerError(message, {
        originalStatus: exception.getStatus(),
        originalResponse: exception.getResponse(),
      });
      response.status(exception.getStatus()).json(domainError.toJSON());
      return;
    }

    // ApplicationError → already handled by ApplicationErrorFilter
    if (exception instanceof ApplicationError) {
      const errorResponse = exception.toJSON();
      response.status(exception.statusCode).json(errorResponse);
      return;
    }

    // Unknown error → InternalServerError (domain)
    const domainError = new InternalServerError(
      exception instanceof Error ? exception.message : 'An unexpected error occurred',
      { originalError: exception instanceof Error ? exception.name : 'UnknownError' }
    );
    response.status(500).json(domainError.toJSON());
  }
}
```

**Purpose**: Converts ANY non-domain error into a domain error.

**Key behavior**:

- ✅ NestJS `HttpException` → `InternalServerError` (preserves original status)
- ✅ Unknown errors → `InternalServerError` with 500 status
- ✅ Already domain errors → passes through
- ✅ ALWAYS returns structured JSON

**Why this is important**:

- Frontend receives consistent format ALWAYS
- No need to handle different error shapes
- Easy to deserialize and display
- Tracks original error in `details`

#### Integration in BFFs

```typescript
// apps/api/backoffice-bff/src/app.module.ts
@Module({
  // ... imports
  providers: [
    {
      provide: APP_FILTER,
      useClass: ApplicationErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
```

**Execution order**:

1. `ApplicationErrorFilter` (catches `ApplicationError` first)
2. `GlobalExceptionFilter` (catches everything else)

**Benefits of APP_FILTER pattern**:

- ✅ Automatic dependency injection
- ✅ Registered globally for all endpoints
- ✅ NestJS recommended approach
- ✅ No need for `@UseFilters()` in controllers

### Infrastructure Layer: Client

#### HTTP Error Deserializer

```typescript
/**
 * Deserialize HTTP error response to ApplicationError
 */
export function deserializeHttpError(
  response: Response | { data?: any; error?: any },
): ApplicationError | Error {
  // Handle fetch Response
  if (response instanceof Response) {
    // Parse JSON and deserialize
  }

  // Handle axios-like response
  const errorData = response.error || response.data;
  if (errorData && isSerializableError(errorData)) {
    return ApplicationError.fromJSON(errorData);
  }

  return new Error('Unknown error format');
}

/**
 * Deserialize JSON error response
 */
export function deserializeJsonError(json: unknown): ApplicationError | Error {
  if (isSerializableError(json)) {
    return ApplicationError.fromJSON(json);
  }
  return new Error('Invalid error format');
}
```

**Usage in client**:

```typescript
// In React component or repository
try {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorJson = await response.json();
    const error = deserializeJsonError(errorJson);

    if (isApplicationError(error)) {
      // Handle domain error with code, i18nKey, etc.
      console.log(error.code); // 'INVALID_CREDENTIALS'
      console.log(error.i18nKey); // 'errors.auth.invalid_credentials'
    }
  }
} catch (err) {
  // Network error or other
}
```

#### React Hooks

```typescript
/**
 * Hook for error state management
 */
export function useErrorHandler() {
  const [error, setError] = useState<ApplicationError | Error | null>(null);

  const handleError = useCallback((err: unknown) => {
    if (isApplicationError(err)) {
      setError(err);
    } else if (err instanceof Error) {
      setError(err);
    } else {
      setError(new Error('Unknown error'));
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { error, handleError, clearError };
}
```

#### Server Action Wrapper (Next.js)

```typescript
/**
 * Wrap Server Actions to return structured results
 */
export function wrapServerAction<T>(action: () => Promise<T>): Promise<ServerActionResult<T>> {
  return action()
    .then((data) => ({ success: true, data }))
    .catch((error) => ({
      success: false,
      error: isApplicationError(error)
        ? { code: error.code, message: error.message, i18nKey: error.i18nKey }
        : { code: ErrorCode.INTERNAL_SERVER_ERROR, message: 'An error occurred' },
    }));
}

// Usage
export async function loginAction(email: string, password: string) {
  return wrapServerAction(async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorJson = await response.json();
      throw deserializeJsonError(errorJson);
    }

    return response.json();
  });
}
```

## Usage Examples

### Backend: Throwing Domain Errors

```typescript
// In repository
export class AccountRepository implements AccountPort {
  async getByEmail(email: string): Promise<AccountEntityProps | null> {
    const account = this.accounts.find((acc) => acc.email === email);

    if (!account) {
      // ✅ Throw domain error
      throw new NotFoundError('Account', email, 'errors.account.not_found');
    }

    return AccountFactory.toDomain(account);
  }

  async comparePassword(email: string, password: string): Promise<boolean> {
    const account = await this.getByEmail(email);

    if (!account) {
      // ✅ Throw domain error
      throw new InvalidCredentialsError(
        'Invalid email or password',
        undefined,
        'errors.auth.invalid_credentials',
      );
    }

    const isValid = await bcrypt.compare(password, account.passwordHash);

    if (!isValid) {
      // ✅ Throw domain error
      throw new InvalidCredentialsError(
        'Invalid email or password',
        undefined,
        'errors.auth.invalid_credentials',
      );
    }

    return true;
  }
}
```

### Backend: Controller with Swagger Documentation

```typescript
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials (INVALID_CREDENTIALS)' })
  @ApiResponse({ status: 404, description: 'Account not found (NOT_FOUND)' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async login(@Body() payload: LoginDto): Promise<LoginResponse> {
    // No try-catch needed! Errors are handled by filters
    return this.loginUseCase.execute(payload);
  }
}
```

**Important**: No need for `try-catch` or `@UseFilters()` - errors are handled automatically!

### Frontend: Deserializing and Displaying Errors

```typescript
// In React component
function LoginForm() {
  const { error, handleError, clearError } = useErrorHandler();
  const t = useTranslations('auth.login');

  async function handleLogin(email: string, password: string) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorJson = await response.json();
        const error = deserializeJsonError(errorJson);
        handleError(error);
        return;
      }

      const data = await response.json();
      // Handle success
    } catch (err) {
      handleError(err);
    }
  }

  return (
    <form>
      {/* Display error */}
      {error && isApplicationError(error) && (
        <ErrorAlert
          title={error.i18nKey ? t(error.i18nKey) : error.message}
          description={error.details ? JSON.stringify(error.details) : undefined}
        />
      )}
      {/* Form fields */}
    </form>
  );
}
```

### Frontend: Using ErrorBoundary

```typescript
// In app layout or page
<ErrorBoundary
  fallback={(error) => (
    <ErrorPage
      title="Something went wrong"
      message={isApplicationError(error) ? error.message : 'An unexpected error occurred'}
      code={isApplicationError(error) ? error.code : undefined}
    />
  )}
>
  <YourApp />
</ErrorBoundary>
```

## Error Response Format

### Structured Response (ALWAYS)

```json
{
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid email or password",
  "statusCode": 401,
  "timestamp": "2026-01-23T12:34:56.789Z",
  "details": {
    "attemptedEmail": "user@example.com"
  },
  "i18nKey": "errors.auth.invalid_credentials"
}
```

**Fields**:

- `code`: ErrorCode enum value (for programmatic handling)
- `message`: Human-readable error message (English, for developers)
- `statusCode`: HTTP status code (for HTTP layer)
- `timestamp`: ISO timestamp (for logging/debugging)
- `details`: Additional context (optional, for debugging)
- `i18nKey`: Translation key (optional, for i18n)

### Why This Format?

1. **Consistent**: Every error has the same shape
2. **Type-safe**: Frontend can deserialize to `ApplicationError`
3. **i18n-ready**: `i18nKey` for translations
4. **Debuggable**: `timestamp` and `details` for troubleshooting
5. **Programmatic**: `code` for conditional logic
6. **Human-readable**: `message` for developers

## Best Practices

### 1. Always Use Domain Errors in Backend

```typescript
// ❌ Bad - Generic Error
throw new Error('User not found');

// ✅ Good - Domain Error
throw new NotFoundError('User', userId, 'errors.user.not_found');
```

### 2. Include i18nKey for User-Facing Errors

```typescript
// ❌ Bad - No i18n key
throw new InvalidCredentialsError('Invalid credentials');

// ✅ Good - With i18n key
throw new InvalidCredentialsError(
  'Invalid credentials',
  undefined,
  'errors.auth.invalid_credentials',
);
```

### 3. Add Details for Debugging

```typescript
// ❌ Bad - No context
throw new ValidationError('Validation failed');

// ✅ Good - With details
throw new ValidationError(
  'Validation failed',
  {
    email: ['Invalid email format'],
    password: ['Must be at least 8 characters'],
  },
  'errors.validation.failed',
);
```

### 4. Don't Catch Errors Unless Necessary

```typescript
// ❌ Bad - Unnecessary try-catch
@Post('login')
async login(@Body() payload: LoginDto) {
  try {
    return await this.loginUseCase.execute(payload);
  } catch (error) {
    throw error; // Pointless!
  }
}

// ✅ Good - Let filters handle it
@Post('login')
async login(@Body() payload: LoginDto) {
  return this.loginUseCase.execute(payload);
}
```

### 5. Use Deserializers in Frontend

```typescript
// ❌ Bad - Manual parsing
if (!response.ok) {
  const json = await response.json();
  const error = new Error(json.message);
  // Lost all structure!
}

// ✅ Good - Use deserializer
if (!response.ok) {
  const json = await response.json();
  const error = deserializeJsonError(json);
  // error is ApplicationError with all fields!
}
```

## Swagger Integration

All error responses are documented in Swagger:

```typescript
@ApiResponse({ status: 401, description: 'Invalid credentials (INVALID_CREDENTIALS)' })
@ApiResponse({ status: 404, description: 'Account not found (NOT_FOUND)' })
@ApiResponse({ status: 409, description: 'Email already exists (RESOURCE_ALREADY_EXISTS)' })
@ApiResponse({ status: 500, description: 'Internal server error (INTERNAL_SERVER_ERROR)' })
```

**Benefits**:

- ✅ Developers can see all possible errors
- ✅ Error codes documented in descriptions
- ✅ Can test error cases in Swagger UI
- ✅ Auto-generated API documentation

## Testing

### Testing Domain Errors

```typescript
describe('AccountRepository', () => {
  it('should throw NotFoundError when account does not exist', async () => {
    const repository = new AccountRepository();

    await expect(repository.getByEmail('nonexistent@example.com')).rejects.toThrow(NotFoundError);
  });

  it('should throw InvalidCredentialsError for wrong password', async () => {
    const repository = new AccountRepository();

    await expect(repository.comparePassword('user@example.com', 'wrongpassword')).rejects.toThrow(
      InvalidCredentialsError,
    );
  });
});
```

### Testing Error Filters

```typescript
describe('ApplicationErrorFilter', () => {
  it('should convert ApplicationError to JSON response', () => {
    const filter = new ApplicationErrorFilter();
    const error = new NotFoundError('User', '123');
    const mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    filter.catch(error, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith(error.toJSON());
  });
});
```

## Common Error Scenarios

### Authentication Errors

- `InvalidCredentialsError`: Wrong email/password
- `UnauthorizedError`: Missing or invalid token
- `TokenExpiredError`: JWT expired
- `ForbiddenError`: Insufficient permissions

### Resource Errors

- `NotFoundError`: Resource doesn't exist
- `ResourceAlreadyExistsError`: Duplicate resource (email, username, etc.)

### Validation Errors

- `ValidationError`: Input validation failed (email format, password length, etc.)

### Business Errors

- `BusinessRuleViolationError`: Business logic constraint violated
- `OperationNotAllowedError`: Operation not permitted in current state

### Server Errors

- `InternalServerError`: Unexpected error, database error, third-party API error

## Packages

### @piar/domain-models

**Location**: `packages/domain/models/src/errors/`

**Contents**:

- `application-error.ts`: Base error class
- `error-codes.ts`: ErrorCode enum + HTTP status mapping
- `specific-errors.ts`: 8 specific error classes
- `index.ts`: Exports all errors

**Dependencies**: None (pure TypeScript)

### @piar/infra-backend-common-error

**Location**: `packages/infra/backend/common/error/`

**Contents**:

- `filters/application-error.filter.ts`: ApplicationErrorFilter + GlobalExceptionFilter
- `interceptors/error-response.interceptor.ts`: Error logging interceptor
- `index.ts`: Exports filters and interceptors

**Dependencies**:

- `@nestjs/common`
- `@piar/domain-models`
- `@types/express`

### @piar/infra-client-common-error

**Location**: `packages/infra/client/common/error/`

**Contents**:

- `shared/http-error-deserializer.ts`: Deserialize HTTP errors
- `shared/error-formatter.ts`: Format error messages
- `client/use-error-handler.ts`: React hooks for error handling
- `client/error-boundary.tsx`: React ErrorBoundary component
- `server/error-handler.ts`: Server-side error extraction
- `server/server-action-wrapper.ts`: Wrap Next.js Server Actions
- `index.ts`: Exports all utilities

**Dependencies**:

- `react` (peer)
- `@piar/domain-models`
- `@types/react-dom`
- `jsdom`

## Related Documentation

- [Domain Models Package](./domain-models.md)
- [BFF Architecture](./bff-architecture.md)
- [Auth Feature](./auth-feature.md)
- [Creating Features Guide](./creating-features-guide.md)

## Future Enhancements

- [ ] Add error tracking integration (Sentry, Datadog)
- [ ] Create error UI components library (`@piar/ui-components`)
- [ ] Add error retry logic for transient failures
- [ ] Implement error rate limiting per user
- [ ] Add error analytics dashboard

## Last Updated

23 January 2026 - Complete error handling system with domain errors and automatic conversion
