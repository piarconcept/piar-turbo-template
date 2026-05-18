import type { DynamicQuery, PaginatedResult } from './types';

export type Id = string;

/**
 * Generic CRUD port used by dynamic forms/tables.
 */
export interface DynamicCrudPort<TEntity, TId = Id, TQuery extends DynamicQuery = DynamicQuery> {
  /**
   * Query-based list operation (pagination/search/sort/filters). Implementations
   * must apply this at the persistence boundary instead of loading the full
   * collection and slicing in memory.
   */
  list(query: TQuery): Promise<PaginatedResult<TEntity>>;

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
