import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface TypeOrmEnvConfig {
  /** Postgres URL in the form: postgres://user:pass@host:5432/db */
  databaseUrl?: string;
  /** Enable DB connection for this service. Default: false when databaseUrl is missing. */
  enabled?: boolean;
}

export interface CreateTypeOrmModuleOptionsParams {
  env: TypeOrmEnvConfig;
  /** Entity globs or classes; leave empty to rely on explicit entity registration in feature modules. */
  entities?: TypeOrmModuleOptions['entities'];
  /** Migration globs or classes */
  migrations?: TypeOrmModuleOptions['migrations'];
  /** Optional schema name */
  schema?: string;
  /** Extra TypeORM options (excluding connection `type` and `url`) */
  extra?: Omit<Partial<TypeOrmModuleOptions>, 'type' | 'url'>;
}
