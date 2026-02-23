'use client';

import { useEffect, useMemo, useState } from 'react';
import type { HttpClientError } from '@piar/infra-client-common-http';

export type SearchCollectionKey = 'accounts';

export interface BackofficeSearchItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  path: string;
  updatedAt?: string;
}

export interface BackofficeSearchCollection {
  key: SearchCollectionKey;
  total: number;
  items: BackofficeSearchItem[];
}

export interface BackofficeSearchResponse {
  query: string;
  total: number;
  collections: BackofficeSearchCollection[];
}

export interface UseBackofficeSearchOptions {
  query: string;
  locale?: string;
  accessToken?: string;
  baseUrl?: string;
  limitPerCollection?: number;
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

function resolveBackofficeBaseUrl(baseUrl?: string): string {
  const envBaseUrl = process.env.NEXT_PUBLIC_BACKOFFICE_BFF_URL;
  const runtimeBaseUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
  const localFallback = process.env.NODE_ENV !== 'production' ? 'http://localhost:5050' : undefined;
  return (baseUrl ?? envBaseUrl ?? localFallback ?? runtimeBaseUrl ?? '').replace(/\/$/, '');
}

function buildApiUrl(baseUrl: string, path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (!baseUrl) return normalizedPath;
  return `${baseUrl}${normalizedPath}`;
}

export function useBackofficeSearch({
  query,
  locale,
  accessToken,
  baseUrl: baseUrlProp,
  limitPerCollection = 6,
}: UseBackofficeSearchOptions) {
  const [data, setData] = useState<BackofficeSearchResponse>({
    query: '',
    total: 0,
    collections: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<HttpClientError | null>(null);

  const baseUrl = useMemo(() => resolveBackofficeBaseUrl(baseUrlProp), [baseUrlProp]);
  const normalizedQuery = query.trim();

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!normalizedQuery) {
        setData({ query: '', total: 0, collections: [] });
        setError(null);
        setLoading(false);
        return;
      }

      if (!accessToken) {
        setError({
          i18nKey: 'unauthorized',
          message: 'Missing access token',
          statusCode: 401,
        });
        setData({ query: normalizedQuery, total: 0, collections: [] });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const url = new URL(
          buildApiUrl(baseUrl, '/search'),
          typeof window !== 'undefined' ? window.location.origin : 'http://localhost',
        );
        url.searchParams.set('q', normalizedQuery);
        url.searchParams.set('limitPerCollection', String(limitPerCollection));
        if (locale) {
          url.searchParams.set('locale', locale);
        }

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          const fallback: HttpClientError = {
            i18nKey: 'server_error',
            message: 'Search request failed',
            statusCode: response.status,
          };

          try {
            const payload = (await response.json()) as HttpClientError;
            throw new Error(JSON.stringify({ ...fallback, ...payload }));
          } catch {
            throw new Error(JSON.stringify(fallback));
          }
        }

        const payload = (await response.json()) as BackofficeSearchResponse;
        if (!active) return;
        setData(payload);
      } catch (e) {
        if (!active) return;
        const parsed = parseHttpClientError(e);
        setError(
          parsed ?? {
            i18nKey: 'server_error',
            message: e instanceof Error ? e.message : String(e),
          },
        );
        setData({ query: normalizedQuery, total: 0, collections: [] });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [accessToken, baseUrl, limitPerCollection, locale, normalizedQuery]);

  return { data, loading, error };
}
