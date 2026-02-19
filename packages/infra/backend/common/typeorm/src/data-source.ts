import 'reflect-metadata';
import { DataSource } from 'typeorm';

/**
 * Standalone DataSource used by migration scripts.
 * This is intentionally minimal and relies on DATABASE_URL.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  migrationsRun: false,
  synchronize: false,
  logging: false,
  entities: [],
  migrations: [],
});
