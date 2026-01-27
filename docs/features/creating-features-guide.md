# Feature Creation Guide

This guide explains how to create new features following the PIAR Clean Architecture approach.

## Feature Architecture

Each feature is split into **three packages**:

```
packages/features/{feature-name}/
├── configuration/    # Domain (ports & types)
├── api/              # NestJS API (use-cases, controllers)
└── client/           # React client (hooks, components)
```

### Principles

1. **Clean Architecture**: Clear separation between domain, application, and infrastructure
2. **Dependency Inversion**: Dependencies point inward to the domain
3. **Reuse**: Shared types across API and client
4. **Type Safety**: End-to-end TypeScript
5. **Testability**: Each layer is independently testable

## Step 1: Create the Configuration Package

The configuration package defines the **contracts** for the feature (ports, types).

### Structure

```
packages/features/{feature-name}/configuration/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── eslint.config.mjs
├── README.md
└── src/
    ├── index.ts
    ├── ports/
    │   └── {name}-repository.port.ts
    └── common/
        └── types.ts
```

### Example Port

```ts
export interface IFeatureRepository {
  findById(id: string): Promise<FeatureEntity | null>;
  save(entity: FeatureEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
```

### Example Types

```ts
export interface FeatureEntity {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export type CreateFeatureDTO = Omit<FeatureEntity, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateFeatureDTO = Partial<CreateFeatureDTO>;
```

### src/index.ts

```ts
export * from './ports/{feature}-repository.port';
export * from './common/types';
```

## Step 2: Create the API Package (NestJS)

This package implements backend logic using NestJS.

### Structure

```
packages/features/{feature-name}/api/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── eslint.config.mjs
├── README.md
└── src/
    ├── index.ts
    ├── controllers/
    │   └── {feature}.controller.ts
    ├── use-cases/
    │   ├── create-{feature}.use-case.ts
    │   ├── get-{feature}.use-case.ts
    │   └── index.ts
    ├── modules/
    │   └── {feature}.module.ts
    └── repositories/
        └── {feature}.repository.ts
```

### Use Cases

```ts
export interface CreateFeatureUseCase {
  execute(dto: CreateFeatureDTO): Promise<FeatureEntity>;
}

export class CreateFeatureUseCaseExecutor implements CreateFeatureUseCase {
  constructor(private readonly repository: IFeatureRepository) {}

  async execute(dto: CreateFeatureDTO): Promise<FeatureEntity> {
    const entity = { ...dto, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    await this.repository.save(entity);
    return entity;
  }
}
```

### Controller

```ts
@Controller('features')
export class FeatureController {
  constructor(
    @Inject(CreateFeatureUseCase)
    private readonly createFeature: CreateFeatureUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateFeatureDTO): Promise<FeatureEntity> {
    return this.createFeature.execute(dto);
  }
}
```

### Module

```ts
@Module({
  controllers: [FeatureController],
})
export class FeatureModule {
  static register(): DynamicModule {
    return {
      module: FeatureModule,
      providers: [
        {
          provide: CreateFeatureUseCase,
          useFactory: (repo: IFeatureRepository) => new CreateFeatureUseCaseExecutor(repo),
          inject: [IFeatureRepository],
        },
      ],
      exports: [CreateFeatureUseCase],
    };
  }
}
```

### src/index.ts

```ts
export * from './modules/{feature}.module';
export * from './controllers/{feature}.controller';
export * from './use-cases';
```

## Step 3: Create the Client Package (React)

This package implements client-side hooks, repositories, and UI.

### Structure

```
packages/features/{feature-name}/client/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── eslint.config.mjs
├── README.md
└── src/
    ├── index.ts
    ├── repositories/
    │   └── http-{feature}.repository.ts
    ├── hooks/
    │   └── use-{feature}.ts
    └── components/
        └── {Feature}Card.tsx
```

### Repository

```ts
export class HttpFeatureRepository implements IFeatureRepository {
  constructor(private readonly baseUrl: string) {}

  async findById(id: string): Promise<FeatureEntity | null> {
    const res = await fetch(`${this.baseUrl}/features/${id}`);
    if (!res.ok) return null;
    return res.json();
  }

  async save(entity: FeatureEntity): Promise<void> {
    await fetch(`${this.baseUrl}/features`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entity),
    });
  }

  async delete(id: string): Promise<void> {
    await fetch(`${this.baseUrl}/features/${id}`, { method: 'DELETE' });
  }
}
```

### Hook

```ts
export function useFeature(id: string, repo: IFeatureRepository) {
  const [data, setData] = useState<FeatureEntity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    repo.findById(id).then((value) => {
      if (mounted) {
        setData(value);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [id, repo]);

  return { data, loading };
}
```

## Step 4: Wire the Feature into a BFF

1. Add dependency to `apps/api/{bff}/package.json`:

```json
{
  "dependencies": {
    "@piar/{feature-name}-api": "workspace:*"
  }
}
```

2. Import module in `apps/api/{bff}/src/app.module.ts`:

```ts
import { FeatureModule } from '@piar/{feature-name}-api';

@Module({
  imports: [FeatureModule.register()],
})
export class AppModule {}
```

## Step 5: Wire the Feature into a Client App

1. Add dependency to the app `package.json`:

```json
{
  "dependencies": {
    "@piar/{feature-name}-client": "workspace:*"
  }
}
```

2. Use the hook or components in your pages.

## Step 6: Tests

- **Configuration**: pure type tests
- **API**: unit test use-cases and controllers
- **Client**: test hooks and components

## Step 7: Documentation

1. Create a new doc in `docs/features/{feature-name}.md`
2. Update `docs/AI-context.md` and `docs/README.md`

## Checklist

- [ ] configuration package created
- [ ] api package created
- [ ] client package created
- [ ] tests added
- [ ] docs updated

## Last Updated

27 January 2026 - English rewrite and cleanup
