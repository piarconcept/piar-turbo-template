import type { DynamicQuery, PaginatedResult } from './types';

export type Id = string;

/**
 * Generic CRUD port used by dynamic forms/tables.
 *
 * Note: domain model ports in this monorepo historically exposed a BasePort with
 * methods like `getAll/getById/create/update/delete/upsert`.
 *
 * This interface is shaped to be compatible with that style while also
 * supporting a query-based `list` for dynamic tables.
 */
export interface DynamicCrudPort<TEntity, TId = Id, TQuery extends DynamicQuery = DynamicQuery> {
  /**
   * Simple list operation.
   * Prefer `list(query)` when building dynamic tables.
   */
  getAll(): Promise<TEntity[]>;

  /**
   * Query-based list operation (pagination/search/sort/filters).
   */
  list?(query: TQuery): Promise<PaginatedResult<TEntity>>;

  getById(id: TId): Promise<TEntity | null>;

  /**
   * Create an entity.
   * Payload type is intentionally `TEntity` to align with existing BasePort.
   */
  create(entity: TEntity): Promise<TEntity>;

  /**
   * Update an entity.
   * Payload type is intentionally `TEntity` to align with existing BasePort.
   */
  update(entity: TEntity): Promise<TEntity>;

  /**
   * Optional upsert operation.
   */
  upsert?(entity: TEntity): Promise<TEntity>;

  delete(id: TId): Promise<void>;
}
