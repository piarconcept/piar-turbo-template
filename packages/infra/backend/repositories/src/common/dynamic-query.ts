import type { DynamicQuery, FilterValue } from '@piar/domain-dynamic-form';
import type { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

const DEFAULT_LIST_LIMIT = 10;
const MAX_LIST_LIMIT = 100;

export interface ListWindow {
  page: number;
  limit: number;
  skip: number;
}

interface DefaultSort {
  key: string;
  direction: 'ASC' | 'DESC';
}

type ColumnMap = Record<string, string>;

export function resolveListWindow(query: DynamicQuery): ListWindow {
  const page = Number.isFinite(query.page) && query.page > 0 ? Math.floor(query.page) : 1;
  const rawLimit =
    Number.isFinite(query.limit) && query.limit > 0 ? Math.floor(query.limit) : DEFAULT_LIST_LIMIT;
  const limit = Math.min(rawLimit, MAX_LIST_LIMIT);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

export function applyTextSearch<TEntity extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<TEntity>,
  alias: string,
  columns: string[],
  searchQuery?: string,
): void {
  const normalizedQuery = searchQuery?.trim().toLowerCase();
  if (!normalizedQuery || columns.length === 0) return;

  const pattern = `%${escapeLikePattern(normalizedQuery)}%`;
  const conditions = columns.map(
    (column) => `LOWER(${alias}.${column}) LIKE :searchQuery ESCAPE '\\'`,
  );

  queryBuilder.andWhere(`(${conditions.join(' OR ')})`, { searchQuery: pattern });
}

export function applyAllowedFilters<TEntity extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<TEntity>,
  alias: string,
  filters: DynamicQuery['filters'],
  allowedColumns: ColumnMap,
): void {
  if (!filters) return;

  Object.entries(filters).forEach(([key, value]) => {
    const column = allowedColumns[key];
    if (!column) return;

    const values = normalizeFilterValues(value);
    if (!values || values.length === 0) return;

    const parameterName = `filter_${key.replace(/[^a-zA-Z0-9_]/g, '_')}`;
    if (values.length === 1) {
      queryBuilder.andWhere(`${alias}.${column} = :${parameterName}`, {
        [parameterName]: values[0],
      });
      return;
    }

    queryBuilder.andWhere(`${alias}.${column} IN (:...${parameterName})`, {
      [parameterName]: values,
    });
  });
}

export function applyAllowedSort<TEntity extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<TEntity>,
  alias: string,
  sort: DynamicQuery['sort'],
  allowedColumns: ColumnMap,
  defaultSort: DefaultSort,
): void {
  const requestedColumn = sort?.key ? allowedColumns[sort.key] : undefined;
  const column = requestedColumn ?? allowedColumns[defaultSort.key];
  if (!column) return;

  const direction = requestedColumn
    ? sort?.direction === 'desc'
      ? 'DESC'
      : 'ASC'
    : defaultSort.direction;

  queryBuilder.orderBy(`${alias}.${column}`, direction);
}

function normalizeFilterValues(
  value: FilterValue | FilterValue[] | undefined,
): FilterValue[] | undefined {
  const values = Array.isArray(value) ? value : [value];
  const filtered = values.filter((item): item is FilterValue => {
    if (item === undefined || item === null) return false;
    if (typeof item === 'string') return item.trim().length > 0;
    return true;
  });

  return filtered.length > 0 ? filtered : undefined;
}

function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`);
}
