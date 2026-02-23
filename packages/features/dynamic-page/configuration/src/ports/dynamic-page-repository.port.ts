import type { DynamicQuery, PaginatedResult } from '@piar/domain-dynamic-form';
import type { DynamicPageEntity, DynamicPageEntityProps } from '@piar/domain-models';

/**
 * Dynamic page creation payload.
 */
export type CreateDynamicPagePayload = Omit<
  DynamicPageEntityProps,
  'id' | 'createdAt' | 'updatedAt'
>;

/**
 * Dynamic page update payload.
 */
export type UpdateDynamicPagePayload = Partial<CreateDynamicPagePayload> & {
  id: string;
};

/**
 * Dynamic page repository port (interface)
 * Defines the contract for dynamic page CRUD operations.
 */
export interface IDynamicPageRepository {
  list(query: DynamicQuery): Promise<PaginatedResult<DynamicPageEntity>>;
  getById(id: string): Promise<DynamicPageEntity | null>;
  getByPageCode(pageCode: string): Promise<DynamicPageEntity | null>;
  getBySlug(slug: string): Promise<DynamicPageEntity | null>;
  create(payload: CreateDynamicPagePayload): Promise<DynamicPageEntity>;
  update(payload: UpdateDynamicPagePayload): Promise<DynamicPageEntity>;
  delete(id: string): Promise<void>;
}

export const IDynamicPageRepository = Symbol('IDynamicPageRepository');
