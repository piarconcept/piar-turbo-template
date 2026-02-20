export type SortDirection = 'asc' | 'desc';

export interface SortState {
  key: string;
  direction: SortDirection;
}

export type FilterValue = string | number | boolean | null;

export type FiltersState = Record<string, FilterValue | FilterValue[]>;

export interface DynamicQuery {
  page: number;
  limit: number;
  searchQuery?: string;
  sort?: SortState;
  filters?: FiltersState;
}

export interface PaginatedResult<TEntity> {
  rows: TEntity[];
  total: number;
}
