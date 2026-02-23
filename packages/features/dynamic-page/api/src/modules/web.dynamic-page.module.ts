import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DynamicPagePort } from '@piar/domain-models';
import { WebDynamicPageController } from '../controllers';
import {
  GetPublicDynamicPageBySlugUseCase,
  GetPublicDynamicPageBySlugUseCaseExecuter,
} from '../use-cases';

export interface WebDynamicPageModuleOptions {
  dynamicPagePort: Provider<DynamicPagePort>;
}

@Module({
  controllers: [WebDynamicPageController],
})
export class WebDynamicPageModule {
  static register(options: WebDynamicPageModuleOptions): DynamicModule {
    return {
      module: WebDynamicPageModule,
      imports: [],
      providers: [
        options.dynamicPagePort,
        {
          provide: GetPublicDynamicPageBySlugUseCase,
          useFactory: (dynamicPagePort: DynamicPagePort) =>
            new GetPublicDynamicPageBySlugUseCaseExecuter(dynamicPagePort),
          inject: [DynamicPagePort],
        },
      ],
      exports: [],
    };
  }
}
