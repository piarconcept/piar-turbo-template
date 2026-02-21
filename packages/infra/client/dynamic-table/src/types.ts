import type { DynamicQuery, PaginatedResult } from '@piar/domain-dynamic-form';

/**
 * Minimal contract for a backend DynamicTable endpoint.
 */
export interface DynamicTableClient<TEntity> {
  list: (query: DynamicQuery) => Promise<PaginatedResult<TEntity>>;
}
