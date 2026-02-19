import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';

import type { CreateTypeOrmModuleOptionsParams, TypeOrmEnvConfig } from './types';

const getEnvConfig = (configService?: ConfigService): TypeOrmEnvConfig => {
  // Keep compatibility with the current template config shape.
  const databaseUrl =
    configService?.get<string>('DBconfig.database_url') ?? process.env.DATABASE_URL;

  const enabled = Boolean(databaseUrl);

  return { databaseUrl, enabled };
};

export const createTypeOrmModuleOptions = (
  params: CreateTypeOrmModuleOptionsParams,
): TypeOrmModuleOptions => {
  const { env, entities, migrations, schema, extra } = params;

  if (!env.databaseUrl) {
    throw new Error('DATABASE_URL is required when database is enabled');
  }

  return {
    type: 'postgres',
    url: env.databaseUrl,
    schema,
    entities,
    migrations,
    migrationsRun: true,
    synchronize: false,
    logging: false,
    ...extra,
  } as TypeOrmModuleOptions;
};

@Module({})
export class TypeormModule {
  /**
   * Conditionally enables TypeORM.
   * - If DATABASE_URL is not provided, the returned module uses a "disabled" config.
   * - Consumers should not inject repositories when DB is disabled.
   */
  static forRoot(params?: Omit<CreateTypeOrmModuleOptionsParams, 'env'>): DynamicModule {
    return {
      module: TypeormModule,
      imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            const env = getEnvConfig(configService);

            if (!env.enabled) {
              return {
                type: 'postgres',
                url: 'postgres://disabled:disabled@127.0.0.1:5432/disabled',
                entities: [],
                migrations: [],
                synchronize: false,
                migrationsRun: false,
                logging: false,
              } satisfies TypeOrmModuleOptions;
            }

            return createTypeOrmModuleOptions({
              env,
              entities: params?.entities,
              migrations: params?.migrations,
              schema: params?.schema,
              extra: params?.extra,
            });
          },
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}
