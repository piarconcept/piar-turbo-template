import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { HealthModule } from '@piar/health-api';
import { loadConfigurationParams } from './config';
import {
  AccountRepository,
  AccountRepositoryProviderModule,
} from '@piar/infra-backend-repositories';
import { AuthModule } from '@piar/auth-api';
import { AccountPort } from '@piar/domain-models';
import { ApplicationErrorFilter, GlobalExceptionFilter } from '@piar/infra-backend-common-error';

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
    AuthModule.register({
      accountPort: {
        provide: AccountPort,
        useClass: AccountRepository,
      },
    }),

    // Providers
    AccountRepositoryProviderModule,
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
