import type { DynamicQuery } from '@piar/domain-dynamic-form';

function cleanFilters(filters: DynamicQuery['filters']): DynamicQuery['filters'] | undefined {
  if (!filters) return undefined;

  const entries = Object.entries(filters).filter(([, v]) => {
    if (v == null) return false;

    if (Array.isArray(v)) {
      const compact = v.filter((x) => x != null && String(x) !== '');
      return compact.length > 0;
    }

    if (typeof v === 'string') return v.trim().length > 0;

    return true;
  });

  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries) as DynamicQuery['filters'];
}

/**
 * Converts a `DynamicQuery` into querystring params expected by the backend controllers.
 */
export function buildDynamicTableSearchParams(query: DynamicQuery): URLSearchParams {
  const params = new URLSearchParams();

  params.set('page', String(query.page));
  params.set('limit', String(query.limit));

  if (query.searchQuery) params.set('searchQuery', query.searchQuery);

  if (query.sort?.key) {
    params.set('sortKey', query.sort.key);
    params.set('sortDirection', query.sort.direction === 'desc' ? 'desc' : 'asc');
  }

  const cleanedFilters = cleanFilters(query.filters);
  if (cleanedFilters) {
    params.set('filters', JSON.stringify(cleanedFilters));
  }

  return params;
}

export function buildDynamicTableUrl(path: string, query: DynamicQuery): string {
  const params = buildDynamicTableSearchParams(query);
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}
