import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { HealthModule } from '@piar/health-api';
import { ApplicationErrorFilter, GlobalExceptionFilter } from '@piar/infra-backend-common-error';
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
  exports: [
    ConfigModule,
  ],
})
export class AppModule {}
