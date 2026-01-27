# Health Feature

## Description

The `health` feature provides endpoints to verify the health of the BFF APIs. It enables monitoring of application status and dependencies (database, cache, etc.).

## Architecture

This feature follows **Clean Architecture** with the following layers:

```
packages/features/health/
├── configuration/          # Domain layer (ports & interfaces)
│   └── src/
│       └── ports/
│           └── health-repository.port.ts
├── api/                   # Infrastructure layer (NestJS)
│   └── src/
│       ├── controllers/   # Presentation layer
│       ├── use-cases/     # Business logic
│       ├── modules/       # NestJS modules (DI)
│       └── index.ts
└── client/                # Client layer (React)
    └── src/
        ├── repositories/  # HTTP implementation
        ├── hooks/         # React hooks
        └── components/    # UI components
```

### Layers

1. **Configuration (Domain)**: Defines interfaces and types without dependencies
2. **API (NestJS)**: Backend implementation with use-cases, controllers, modules
3. **Client (React)**: Frontend implementation with hooks and components

## Packages

### 1. `@piar/health-configuration`

**Purpose**: Define shared contracts and types (pure domain layer).

**Characteristics**:

- Zero dependencies
- Pure TypeScript types
- Repository ports

**Primary exports**:

```ts
interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  service: string;
  timestamp: string;
  version?: string;
  checks?: HealthCheck[];
}

interface HealthCheck {
  name: string;
  status: 'ok' | 'error';
  message?: string;
}

interface IHealthRepository {
  getHealth(): Promise<HealthStatus>;
  getHealthWithTimeout(timeoutMs: number): Promise<HealthStatus>;
}
```

### 2. `@piar/health-api`

**Purpose**: NestJS implementation with use-cases, controllers, and modules.

**Dependencies**:

- `@nestjs/common`
- `@nestjs/core`
- `@piar/health-configuration`

#### Use Cases

```ts
export interface GetHealthUseCase {
  execute(): Promise<HealthStatus>;
}

export class GetHealthUseCaseExecuter implements GetHealthUseCase {
  async execute(): Promise<HealthStatus> {
    return {
      status: 'ok',
      service: 'health-api',
      timestamp: new Date().toISOString(),
    };
  }
}
```

#### Controllers

```ts
@Controller('health')
export class HealthController {
  constructor(
    @Inject(GetHealthUseCase)
    private readonly getHealthUseCase: GetHealthUseCase,
    @Inject(GetDetailedHealthUseCase)
    private readonly getDetailedHealthUseCase: GetDetailedHealthUseCase,
  ) {}

  @Get()
  async getHealth(): Promise<HealthStatus> {
    return this.getHealthUseCase.execute();
  }

  @Get('detailed')
  async getDetailedHealth(): Promise<HealthStatus> {
    return this.getDetailedHealthUseCase.execute();
  }
}
```

#### Modules

```ts
@Module({
  controllers: [HealthController],
})
export class HealthModule {
  static register(): DynamicModule {
    return {
      module: HealthModule,
      providers: [
        {
          provide: GetHealthUseCase,
          useFactory: () => new GetHealthUseCaseExecuter(),
        },
        {
          provide: GetDetailedHealthUseCase,
          useFactory: () => new GetDetailedHealthUseCaseExecuter(),
        },
      ],
    };
  }
}
```

### 3. `@piar/health-client`

**Purpose**: React implementation with hooks and components.

**Dependencies**:

- `react` (peer)
- `@piar/health-configuration`

**Primary exports**:

```ts
export function useHealth(url: string);
export function useMultipleHealth(urls: string[]);
export function useHealthPolling(url: string, intervalMs: number);

export function HealthBadge({ serviceUrl, serviceName });
export function HealthCard({ serviceUrl, serviceName });

export class HttpHealthRepository implements IHealthRepository;
```

## Integration in BFFs

### 1. Add dependency

```json
{
  "dependencies": {
    "@piar/health-api": "workspace:*"
  }
}
```

### 2. Import module in `AppModule`

```ts
import { HealthModule } from '@piar/health-api';

@Module({
  imports: [HealthModule.register()],
})
export class AppModule {}
```

### 3. Available Endpoints

- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health check with dependency checks

## Last Updated

27 January 2026 - English rewrite and cleanup
