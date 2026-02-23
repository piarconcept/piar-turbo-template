import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DynamicPagePort } from '@piar/domain-models';
import { DynamicPageRepositoryAdapter } from '@piar/dynamic-page-infra-backend';
import {
  CreateDynamicPageUseCase,
  CreateDynamicPageUseCaseExecuter,
  DeleteDynamicPageUseCase,
  DeleteDynamicPageUseCaseExecuter,
  GetDynamicPageByCodeUseCase,
  GetDynamicPageByCodeUseCaseExecuter,
  GetDynamicPageBySlugUseCase,
  GetDynamicPageBySlugUseCaseExecuter,
  GetDynamicPageUseCase,
  GetDynamicPageUseCaseExecuter,
  ListDynamicPagesUseCase,
  ListDynamicPagesUseCaseExecuter,
  NormalizeDynamicPagesUseCase,
  NormalizeDynamicPagesUseCaseExecuter,
  UpdateDynamicPageUseCase,
  UpdateDynamicPageUseCaseExecuter,
} from '../use-cases';
import { DynamicPageController } from '../controllers';

export interface DynamicPageModuleOptions {
  dynamicPagePort: Provider<DynamicPagePort>;
}

@Module({
  controllers: [DynamicPageController],
})
export class DynamicPageModule {
  static register(options: DynamicPageModuleOptions): DynamicModule {
    return {
      module: DynamicPageModule,
      imports: [],
      providers: [
        // Infrastructure Ports
        options.dynamicPagePort,
        // Repositories
        {
          provide: DynamicPageRepositoryAdapter,
          useFactory: (dynamicPagePort: DynamicPagePort) =>
            new DynamicPageRepositoryAdapter(dynamicPagePort),
          inject: [DynamicPagePort],
        },
        // Use Cases
        {
          provide: ListDynamicPagesUseCase,
          useFactory: (repository: DynamicPageRepositoryAdapter) =>
            new ListDynamicPagesUseCaseExecuter(repository),
          inject: [DynamicPageRepositoryAdapter],
        },
        {
          provide: GetDynamicPageUseCase,
          useFactory: (repository: DynamicPageRepositoryAdapter) =>
            new GetDynamicPageUseCaseExecuter(repository),
          inject: [DynamicPageRepositoryAdapter],
        },
        {
          provide: GetDynamicPageByCodeUseCase,
          useFactory: (repository: DynamicPageRepositoryAdapter) =>
            new GetDynamicPageByCodeUseCaseExecuter(repository),
          inject: [DynamicPageRepositoryAdapter],
        },
        {
          provide: GetDynamicPageBySlugUseCase,
          useFactory: (repository: DynamicPageRepositoryAdapter) =>
            new GetDynamicPageBySlugUseCaseExecuter(repository),
          inject: [DynamicPageRepositoryAdapter],
        },
        {
          provide: CreateDynamicPageUseCase,
          useFactory: (repository: DynamicPageRepositoryAdapter) =>
            new CreateDynamicPageUseCaseExecuter(repository),
          inject: [DynamicPageRepositoryAdapter],
        },
        {
          provide: UpdateDynamicPageUseCase,
          useFactory: (repository: DynamicPageRepositoryAdapter) =>
            new UpdateDynamicPageUseCaseExecuter(repository),
          inject: [DynamicPageRepositoryAdapter],
        },
        {
          provide: DeleteDynamicPageUseCase,
          useFactory: (repository: DynamicPageRepositoryAdapter) =>
            new DeleteDynamicPageUseCaseExecuter(repository),
          inject: [DynamicPageRepositoryAdapter],
        },
        {
          provide: NormalizeDynamicPagesUseCase,
          useFactory: (repository: DynamicPageRepositoryAdapter) =>
            new NormalizeDynamicPagesUseCaseExecuter(repository),
          inject: [DynamicPageRepositoryAdapter],
        },
      ],
      exports: [],
    };
  }
}
