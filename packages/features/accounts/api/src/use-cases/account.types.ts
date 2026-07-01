import type { AccountEntityProps } from '@piar/domain-models';

export type AccountRole = NonNullable<AccountEntityProps['role']>;
export type SortDirection = 'asc' | 'desc';

export interface AccountSort {
  key: string;
  direction: SortDirection;
}

export interface AccountListQuery {
  page: number;
  limit: number;
  searchQuery?: string;
  sort?: AccountSort;
  filters?: Record<string, unknown>;
}

export type AccountPublic = Omit<AccountEntityProps, 'passwordHash'>;

export interface PaginatedAccounts {
  rows: AccountPublic[];
  total: number;
}
