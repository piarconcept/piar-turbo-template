import type { DynamicQuery, PaginatedResult, SortState, FiltersState, FilterValue } from './types';

function normalizeFilterValue(v: FilterValue | FilterValue[] | undefined) {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v : [v];
}

function matchesFilters<TEntity extends Record<string, unknown>>(
  row: TEntity,
  filters?: FiltersState,
) {
  if (!filters) return true;

  for (const [key, expected] of Object.entries(filters)) {
    const expectedList = normalizeFilterValue(expected);

    // null means "All" in many UIs
    if (!expectedList || expectedList.length === 0) continue;
    if (expectedList.length === 1 && expectedList[0] === null) continue;

    const actual = row[key];

    // If filter is array: match any
    const ok = expectedList.some((e) => {
      if (e === null) return true;
      if (typeof actual === 'boolean') return actual === e;
      if (typeof actual === 'number') return actual === e;
      if (typeof actual === 'string') return actual === String(e);
      return actual === e;
    });

    if (!ok) return false;
  }

  return true;
}

function matchesSearch<TEntity extends Record<string, unknown>>(
  row: TEntity,
  searchQuery?: string,
  searchKeys?: string[],
) {
  const q = (searchQuery ?? '').trim().toLowerCase();
  if (!q) return true;

  const keys = searchKeys && searchKeys.length > 0 ? searchKeys : Object.keys(row);

  return keys.some((key) => {
    const v = row[key];
    if (v == null) return false;
    if (typeof v === 'string') return v.toLowerCase().includes(q);
    if (typeof v === 'number') return String(v).includes(q);
    return false;
  });
}

function sortRows<TEntity extends Record<string, unknown>>(rows: TEntity[], sort?: SortState) {
  if (!sort) return rows;

  const { key, direction } = sort;
  const sign = direction === 'desc' ? -1 : 1;

  return [...rows].sort((a, b) => {
    const av = a[key];
    const bv = b[key];

    if (av == null && bv == null) return 0;
    if (av == null) return -1 * sign;
    if (bv == null) return 1 * sign;

    // Date
    if (av instanceof Date && bv instanceof Date) return (av.getTime() - bv.getTime()) * sign;

    // Number
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * sign;

    // Boolean
    if (typeof av === 'boolean' && typeof bv === 'boolean') {
      return (Number(av) - Number(bv)) * sign;
    }

    return String(av).localeCompare(String(bv)) * sign;
  });
}

export interface ApplyDynamicQueryOptions<TEntity> {
  /** Which keys should be searched. If omitted, all enumerable keys in the row are searched. */
  searchKeys?: Array<keyof TEntity & string>;
}

/**
 * Apply pagination/search/sort/filters from DynamicQuery to a list of rows.
 * Pure function: no framework dependencies.
 */
export function applyDynamicQuery<TEntity extends Record<string, unknown>>(
  rows: TEntity[],
  query: DynamicQuery,
  options: ApplyDynamicQueryOptions<TEntity> = {},
): PaginatedResult<TEntity> {
  const page = Number.isFinite(query.page) && query.page > 0 ? query.page : 1;
  const limit = Number.isFinite(query.limit) && query.limit > 0 ? query.limit : 10;

  const filtered = rows
    .filter((r) => matchesFilters(r, query.filters))
    .filter((r) => matchesSearch(r, query.searchQuery, options.searchKeys as string[] | undefined));

  const sorted = sortRows(filtered, query.sort);

  const start = (page - 1) * limit;
  const paginated = sorted.slice(start, start + limit);

  return {
    rows: paginated,
    total: sorted.length,
  };
}
