import type { DynamicQuery, PaginatedResult } from '@piar/domain-dynamic-form';
import type { HttpClient } from '@piar/infra-client-common-http';
import { buildDynamicTableUrl } from './query-params';
import type { DynamicTableClient } from './types';

export interface CreateDynamicTableClientConfig {
  /** Resource path, e.g. `/clients` */
  path: string;
}

/**
 * Creates a minimal typed client for REST endpoints like:
 * GET /resource?page=1&limit=10&searchQuery=...&sortKey=...&sortDirection=...&filters=...
 */
export function createDynamicTableClient<TEntity>(
  http: HttpClient,
  config: CreateDynamicTableClientConfig,
): DynamicTableClient<TEntity> {
  return {
    async list(query: DynamicQuery): Promise<PaginatedResult<TEntity>> {
      const url = buildDynamicTableUrl(config.path, query);
      return http.get<PaginatedResult<TEntity>>(url);
    },
  };
}
