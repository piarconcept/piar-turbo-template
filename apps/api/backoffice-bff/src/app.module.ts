import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { HealthModule } from '@piar/health-api';
import { loadConfigurationParams } from './config';
import {
  AccountRepository,
  AccountRepositoryProviderModule,
  ContactSubmissionRepository,
  ContactSubmissionRepositoryProviderModule,
  DynamicPageRepository,
  DynamicPageRepositoryProviderModule,
} from '@piar/infra-backend-repositories';
import { AuthModule } from '@piar/auth-api';
import { ContactSubmissionModule } from '@piar/contact-api';
import { DynamicPageModule } from '@piar/dynamic-page-api';
import { AccountPort, ContactSubmissionPort, DynamicPagePort } from '@piar/domain-models';
import { ApplicationErrorFilter, GlobalExceptionFilter } from '@piar/infra-backend-common-error';
import { TypeormModule } from '@piar/infra-backend-common-typeorm';
import { AccountsModule } from './accounts/accounts.module';
import { SearchModule } from './search/search.module';

const ENV_FILE = '.env';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      load: [() => loadConfigurationParams()],
      envFilePath: [ENV_FILE],
    }),

    // Modules
    HealthModule.register(),
    TypeormModule.forRoot(),
    AuthModule.register({
      accountPort: {
        provide: AccountPort,
        useClass: AccountRepository,
      },
    }),
    ContactSubmissionModule.register({
      contactSubmissionPort: {
        provide: ContactSubmissionPort,
        useClass: ContactSubmissionRepository,
      },
    }),
    DynamicPageModule.register({
      dynamicPagePort: {
        provide: DynamicPagePort,
        useClass: DynamicPageRepository,
      },
    }),
    AccountsModule,
    SearchModule,

    // Providers
    AccountRepositoryProviderModule,
    ContactSubmissionRepositoryProviderModule,
    DynamicPageRepositoryProviderModule,
  ],
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
  exports: [ConfigModule],
})
export class AppModule {}
