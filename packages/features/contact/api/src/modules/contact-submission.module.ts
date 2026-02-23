import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ContactSubmissionPort } from '@piar/domain-models';
import { ContactSubmissionRepositoryAdapter } from '@piar/contact-infra-backend';
import {
  CreateContactSubmissionUseCase,
  CreateContactSubmissionUseCaseExecuter,
  DeleteContactSubmissionUseCase,
  DeleteContactSubmissionUseCaseExecuter,
  GetContactSubmissionUseCase,
  GetContactSubmissionUseCaseExecuter,
  ListContactSubmissionsUseCase,
  ListContactSubmissionsUseCaseExecuter,
  UpdateContactSubmissionUseCase,
  UpdateContactSubmissionUseCaseExecuter,
} from '../use-cases';
import { ContactSubmissionController } from '../controllers';

export interface ContactSubmissionModuleOptions {
  contactSubmissionPort: Provider<ContactSubmissionPort>;
}

@Module({
  controllers: [ContactSubmissionController],
})
export class ContactSubmissionModule {
  static register(options: ContactSubmissionModuleOptions): DynamicModule {
    return {
      module: ContactSubmissionModule,
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
        {
          provide: ListContactSubmissionsUseCase,
          useFactory: (repository: ContactSubmissionRepositoryAdapter) =>
            new ListContactSubmissionsUseCaseExecuter(repository),
          inject: [ContactSubmissionRepositoryAdapter],
        },
        {
          provide: GetContactSubmissionUseCase,
          useFactory: (repository: ContactSubmissionRepositoryAdapter) =>
            new GetContactSubmissionUseCaseExecuter(repository),
          inject: [ContactSubmissionRepositoryAdapter],
        },
        {
          provide: DeleteContactSubmissionUseCase,
          useFactory: (repository: ContactSubmissionRepositoryAdapter) =>
            new DeleteContactSubmissionUseCaseExecuter(repository),
          inject: [ContactSubmissionRepositoryAdapter],
        },
        {
          provide: UpdateContactSubmissionUseCase,
          useFactory: (repository: ContactSubmissionRepositoryAdapter) =>
            new UpdateContactSubmissionUseCaseExecuter(repository),
          inject: [ContactSubmissionRepositoryAdapter],
        },
      ],
      exports: [],
    };
  }
}
