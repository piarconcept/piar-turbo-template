import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ContactSubmissionPort } from '@piar/domain-models';
import { ContactSubmissionRepositoryAdapter } from '@piar/contact-infra-backend';
import {
  CreateContactSubmissionUseCase,
  CreateContactSubmissionUseCaseExecuter,
} from '../use-cases';
import { WebContactSubmissionController } from '../controllers';

export interface WebContactSubmissionModuleOptions {
  contactSubmissionPort: Provider<ContactSubmissionPort>;
}

@Module({
  controllers: [WebContactSubmissionController],
})
export class WebContactSubmissionModule {
  static register(options: WebContactSubmissionModuleOptions): DynamicModule {
    return {
      module: WebContactSubmissionModule,
      imports: [],
      providers: [
        options.contactSubmissionPort,
        {
          provide: ContactSubmissionRepositoryAdapter,
          useFactory: (contactSubmissionPort: ContactSubmissionPort) =>
            new ContactSubmissionRepositoryAdapter(contactSubmissionPort),
          inject: [ContactSubmissionPort],
        },
        {
          provide: CreateContactSubmissionUseCase,
          useFactory: (repository: ContactSubmissionRepositoryAdapter) =>
            new CreateContactSubmissionUseCaseExecuter(repository),
          inject: [ContactSubmissionRepositoryAdapter],
        },
      ],
      exports: [],
    };
  }
}
