import { DynamicModule, Module, Provider } from '@nestjs/common';
import { AccountPort } from '@piar/domain-models';
import { SearchController } from '../controllers';
import { SearchBackofficeUseCase, SearchBackofficeUseCaseExecuter } from '../use-cases';

export interface SearchModuleOptions {
  accountPort: Provider<AccountPort>;
}

@Module({
  controllers: [SearchController],
})
export class SearchModule {
  static register(options: SearchModuleOptions): DynamicModule {
    return {
      module: SearchModule,
      imports: [],
      providers: [
        options.accountPort,
        SearchBackofficeUseCaseExecuter,
        {
          provide: SearchBackofficeUseCase,
          useExisting: SearchBackofficeUseCaseExecuter,
        },
      ],
      exports: [],
    };
  }
}
