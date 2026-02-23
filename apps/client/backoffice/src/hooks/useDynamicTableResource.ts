'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { DynamicQuery, PaginatedResult } from '@piar/domain-dynamic-form';
import type { HttpClientError } from '@piar/infra-client-common-http';
import { HttpClient } from '@piar/infra-client-common-http';

export interface UseDynamicTableResourceOptions<_TEntity> {
  /** Resource path in BFF, e.g. `/clients` */
  path: string;
  /** Access token used to send the Authorization header */
  accessToken?: string;
  /** Base URL for the Backoffice BFF (optional override) */
  baseUrl?: string;
  /** Default query for the table */
  initialQuery?: DynamicQuery;
}

function parseHttpClientError(e: unknown): HttpClientError | null {
  const message = e instanceof Error ? e.message : String(e);

  try {
    const parsed = JSON.parse(message) as HttpClientError;
    if (parsed && typeof parsed === 'object' && 'i18nKey' in parsed) return parsed;
    return null;
  } catch {
    return null;
  }
}

/**
 * Parse DynamicQuery from URL search params
 */
function parseQueryFromUrl(searchParams: URLSearchParams, defaults: DynamicQuery): DynamicQuery {
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');
  const search = searchParams.get('search');
  const sortKey = searchParams.get('sortKey');
  const sortDir = searchParams.get('sortDir');

  const query: DynamicQuery = {
    page: page ? parseInt(page, 10) : (defaults.page ?? 1),
    limit: limit ? parseInt(limit, 10) : (defaults.limit ?? 10),
    filters: defaults.filters ?? {},
  };

  if (search) {
    query.searchQuery = search;
  }

  if (sortKey && (sortDir === 'asc' || sortDir === 'desc')) {
    query.sort = { key: sortKey, direction: sortDir };
  } else if (defaults.sort) {
    query.sort = defaults.sort;
  }

  // Parse filters from URL (format: filter_<key>=<value>)
  searchParams.forEach((value, key) => {
    if (key.startsWith('filter_')) {
      const filterKey = key.substring(7); // Remove 'filter_' prefix
      if (query.filters) {
        query.filters[filterKey] = value;
      }
    }
  });

  return query;
}

/**
 * Build URL search params from DynamicQuery
 * Only includes non-default values
 */
function buildUrlParams(query: DynamicQuery, defaults: DynamicQuery): URLSearchParams {
  const params = new URLSearchParams();

  // Only add page if different from default
  if (query.page !== defaults.page) {
    params.set('page', query.page.toString());
  }

  // Only add limit if different from default
  if (query.limit !== defaults.limit) {
    params.set('limit', query.limit.toString());
  }

  // Add search if present
  if (query.searchQuery) {
    params.set('search', query.searchQuery);
  }

  // Add sort if present
  if (
    query.sort &&
    (!defaults.sort ||
      query.sort.key !== defaults.sort.key ||
      query.sort.direction !== defaults.sort.direction)
  ) {
    params.set('sortKey', query.sort.key);
    params.set('sortDir', query.sort.direction);
  }

  // Add filters
  if (query.filters) {
    Object.entries(query.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(`filter_${key}`, String(value));
      }
    });
  }

  return params;
}

export function useDynamicTableResource<TEntity>({
  path,
  accessToken,
  baseUrl: baseUrlProp,
  initialQuery,
}: UseDynamicTableResourceOptions<TEntity>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const envBaseUrl = process.env.NEXT_PUBLIC_BACKOFFICE_BFF_URL;
  const runtimeBaseUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
  const localFallback = process.env.NODE_ENV !== 'production' ? 'http://localhost:5050' : undefined;
  const baseUrl = (baseUrlProp ?? envBaseUrl ?? localFallback ?? runtimeBaseUrl ?? '').replace(
    /\/$/,
    '',
  );

  const http = useMemo(() => {
    const client = new HttpClient(baseUrl);
    if (accessToken) client.setBearerToken(accessToken);
    return client;
  }, [baseUrl, accessToken]);

  const defaults: DynamicQuery = useMemo(
    () =>
      initialQuery ?? {
        page: 1,
        limit: 10,
        filters: {},
      },
    [initialQuery],
  );

  // Parse query from URL on mount and when URL changes
  const query = useMemo(() => parseQueryFromUrl(searchParams, defaults), [searchParams, defaults]);

  const [data, setData] = useState<PaginatedResult<TEntity>>({ rows: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<HttpClientError | null>(null);

  // Use ref to track last fetched query to prevent duplicate fetches
  const lastQueryRef = useRef<string>('');
  const isFetchingRef = useRef(false);

  // Fetch data when query changes
  useEffect(() => {
    // Don't fetch if already fetching or if no access token
    if (isFetchingRef.current || !accessToken) return;

    // Serialize query to compare with last fetch
    const queryString = JSON.stringify(query);
    if (queryString === lastQueryRef.current) return;

    const fetchData = async () => {
      isFetchingRef.current = true;
      lastQueryRef.current = queryString;
      setLoading(true);
      setError(null);

      try {
        const { createDynamicTableClient } = await import('@piar/infra-client-dynamic-table');
        const client = createDynamicTableClient<TEntity>(http, { path });
        const res = await client.list(query);
        setData(res);
      } catch (e) {
        const parsed = parseHttpClientError(e);
        setError(
          parsed ?? {
            i18nKey: 'server_error',
            message: e instanceof Error ? e.message : String(e),
          },
        );
        setData({ rows: [], total: 0 });
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    void fetchData();
  }, [query, accessToken, http, path]);

  // Update URL when query changes
  const onQueryChange = useCallback(
    (next: DynamicQuery) => {
      const params = buildUrlParams(next, defaults);
      const paramsString = params.toString();

      // Build new URL with current pathname and new query params
      const newUrl = paramsString ? `${pathname}?${paramsString}` : pathname;

      // Use router.push to update URL without full page reload
      router.push(newUrl, { scroll: false });
    },
    [router, defaults, pathname],
  );

  // Manual refetch function
  const refetch = useCallback(() => {
    // Reset last query to force refetch
    lastQueryRef.current = '';
    // Trigger the effect by creating a new query reference
    const queryString = JSON.stringify(query);
    lastQueryRef.current = queryString;
  }, [query]);

  return {
    query,
    onQueryChange,
    rows: data.rows as unknown as Array<Record<string, unknown>>,
    total: data.total,
    loading,
    error,
    refetch,
  };
}
