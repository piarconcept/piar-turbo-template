import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { HealthModule } from '@piar/health-api';
import { ApplicationErrorFilter, GlobalExceptionFilter } from '@piar/infra-backend-common-error';
import { TypeormModule } from '@piar/infra-backend-common-typeorm';
import {
  ContactSubmissionRepository,
  ContactSubmissionRepositoryProviderModule,
  DynamicPageRepository,
  DynamicPageRepositoryProviderModule,
} from '@piar/infra-backend-repositories';
import { WebContactSubmissionModule } from '@piar/contact-api';
import { WebDynamicPageModule } from '@piar/dynamic-page-api';
import { ContactSubmissionPort, DynamicPagePort } from '@piar/domain-models';
import { loadConfigurationParams } from './config';

const ENV_FILE = '.env';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      load: [() => loadConfigurationParams()],
      envFilePath: [ENV_FILE],
    }),
    HealthModule.register(),
    TypeormModule.forRoot(),
    ContactSubmissionRepositoryProviderModule,
    DynamicPageRepositoryProviderModule,
    WebContactSubmissionModule.register({
      contactSubmissionPort: {
        provide: ContactSubmissionPort,
        useClass: ContactSubmissionRepository,
      },
    }),
    WebDynamicPageModule.register({
      dynamicPagePort: {
        provide: DynamicPagePort,
        useClass: DynamicPageRepository,
      },
    }),
  ],
  controllers: [],
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
