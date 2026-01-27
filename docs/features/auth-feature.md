# Auth Feature

## Description

The `auth` feature provides authentication endpoints for the BFF APIs. It exposes login, registration, forgot-password, and user role update flows using Clean Architecture.

## Architecture

This feature follows **Clean Architecture** with the following layer structure:

```
packages/features/auth/
├── configuration/          # Domain Layer (Ports & Types)
│   └── src/
│       └── ports/
│           └── auth-repository.port.ts
├── infra/                  # Infrastructure implementations
│   └── backend/
│       └── src/
│           └── repositories/
│               └── auth.repository.ts
└── api/                    # Infrastructure Layer (NestJS)
    └── src/
        ├── controllers/    # Presentation layer
        ├── use-cases/      # Use cases (business logic)
        ├── modules/        # NestJS modules (DI)
        └── index.ts
```

### Layers

1. **Configuration (Domain)**: Interfaces and types with zero dependencies
2. **Infra Backend**: Port implementation for authentication flows
3. **API (NestJS)**: Backend implementation with use-cases, controllers, and modules

## Packages

### 1. @piar/auth-configuration

**Purpose**: Define contracts and shared types aligned with the Account domain model.

**Dependencies**:

- `@piar/domain-models`

**Exports**:

- `IAuthRepository`
- `AccountEntity`, `AuthSession`, `AccountRole`
- `LoginRequest`, `LoginResponse`
- `RegisterRequest`, `RegisterResponse`
- `ForgotPasswordRequest`, `ForgotPasswordResponse`
- `UpdateUserRoleRequest`, `UpdateUserRoleResponse`

### 2. @piar/auth-infra-backend

**Purpose**: Provide the backend repository implementation that resolves the auth port.

**Exports**:

- `AuthRepository`

### 3. @piar/auth-api

**Purpose**: NestJS implementation with use-cases, controllers, and modules.

**Dependencies**:

- `@nestjs/common`
- `@nestjs/core`
- `@piar/auth-configuration`
- `@piar/auth-infra-backend`
- `@piar/infra-backend-common-security`

#### Use Cases

Use-cases encapsulate the auth flows:

```typescript
export interface LoginUseCase {
  execute(payload: LoginRequest): Promise<LoginResponse>;
}
```

#### Controllers

Controllers expose HTTP endpoints:

```typescript
@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() payload: LoginRequest) {
    return this.loginUseCase.execute(payload);
  }
}
```

#### Module

The module wires up DI:

```typescript
@Module({ controllers: [AuthController] })
export class AuthModule {
  static register(): DynamicModule {
    return {
      module: AuthModule,
      providers: [{ provide: LoginUseCase, useFactory: () => new LoginUseCaseExecuter() }],
    };
  }
}
```

## Integration in BFFs

### 1. Add dependency

```json
// apps/api/web-bff/package.json
{
  "dependencies": {
    "@piar/auth-api": "workspace:*"
  }
}
```

### 2. Import module in AppModule

```typescript
// apps/api/web-bff/src/app.module.ts
import { Module } from '@nestjs/common';
import { AuthModule } from '@piar/auth-api';

@Module({
  imports: [AuthModule.register()],
})
export class AppModule {}
```

### 3. Available endpoints

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/forgot-password`
- `PATCH /auth/roles`

## Scripts

```bash
# Build all auth packages
pnpm turbo build --filter=@piar/auth-*

# Test all auth packages
pnpm turbo test --filter=@piar/auth-*
```

## Next Steps

- Add validation and error handling for auth payloads
- Implement persistence adapters and repository implementations
- Add tests for use cases and controllers
