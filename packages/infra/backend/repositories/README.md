# @piar/infra-backend-repositories

Repository implementations for backend infrastructure.

## Architecture

Each entity has 4 files following the repository pattern:

```
src/
└── account/
    ├── schema.ts           # Data source (MockData, Prisma, TypeORM, etc.)
    ├── repository.ts       # Implements domain port (IAccountRepository)
    ├── factory.ts          # Converts raw data → domain entities
    └── provider.ts         # NestJS module with DI configuration
```

## Pattern Explanation

### 1. Schema (`schema.ts`)
Data source definition. Currently exports MockData, but can be replaced with:
- Prisma schema
- TypeORM entities  
- MongoDB models
- Raw SQL queries

### 2. Repository (`repository.ts`)
Implements the domain port interface. Handles data persistence and retrieval.
All methods return **domain entities** (via factory).

### 3. Factory (`factory.ts`)
Converts raw data → domain entities.
Ensures data integrity and validation before creating entities.

### 4. Provider (`provider.ts`)
NestJS module that provides the repository as an injectable service.
Configures dependency injection.

## Usage

### In BFF Application

```typescript
// app.module.ts
import { AccountRepositoryModule } from '@piar/infra-backend-repositories/account';

@Module({
  imports: [AccountRepositoryModule],
})
export class AppModule {}
```

### In Use Cases

```typescript
import { AccountPort } from '@piar/domain-models';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('AccountPort')
    private readonly accountRepository: AccountPort
  ) {}

  async execute(email: string, password: string) {
    const account = await this.accountRepository.getByEmail(email);
    if (!account) {
      throw new NotFoundError('Account', email);
    }
    // ...
  }
}
```

## Adding New Entities

1. Create entity folder: `src/{entity}/`
2. Create 4 files: `schema.ts`, `repository.ts`, `factory.ts`, `provider.ts`
3. Implement domain port interface
4. Export from `src/{entity}/index.ts`
5. Add export to main `src/index.ts`
6. Add to package.json exports

## Development

```bash
# Build
pnpm --filter @piar/infra-backend-repositories build

# Watch mode
pnpm --filter @piar/infra-backend-repositories dev

# Test
pnpm --filter @piar/infra-backend-repositories test
```
