export type BaseSortDirection = 'asc' | 'desc';

export interface BaseSort {
  key: string;
  direction: BaseSortDirection;
}

export type BaseFilterValue = string | number | boolean | null;

export type BaseFilters = Record<string, BaseFilterValue | BaseFilterValue[]>;

export interface BaseListQuery {
  page: number;
  limit: number;
  searchQuery?: string;
  sort?: BaseSort;
  filters?: BaseFilters;
}

export interface BasePaginatedResult<T> {
  rows: T[];
  total: number;
}

export interface BasePort<T, TQuery extends BaseListQuery = BaseListQuery> {
  list(query: TQuery): Promise<BasePaginatedResult<T>>;
  getById(id: string): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  upsert(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}
