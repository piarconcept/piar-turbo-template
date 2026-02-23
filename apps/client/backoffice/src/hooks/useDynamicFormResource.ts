'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { HttpClientError } from '@piar/infra-client-common-http';
import { HttpClient } from '@piar/infra-client-common-http';

export interface UseDynamicFormResourceOptions<_TEntity> {
  /** Resource path in BFF, e.g. `/clients` */
  path: string;
  /** Access token used to send the Authorization header */
  accessToken?: string;
  /** Base URL for the Backoffice BFF (optional override) */
  baseUrl?: string;
  /** ID of the entity to fetch in edit mode (optional) */
  id?: string;
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

export function useDynamicFormResource<TEntity>({
  path,
  accessToken,
  baseUrl: baseUrlProp,
  id,
}: UseDynamicFormResourceOptions<TEntity>) {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<HttpClientError | null>(null);
  const [entity, setEntity] = useState<TEntity | null>(null);

  const findById = useCallback(async () => {
    if (!accessToken) return null;

    setLoading(true);
    setError(null);

    try {
      const result = await http.get<TEntity>(`${path}/${id}`);
      setEntity(result);
      return result;
    } catch (e) {
      const parsed = parseHttpClientError(e);
      setError(
        parsed ?? {
          i18nKey: 'server_error',
          message: e instanceof Error ? e.message : String(e),
        },
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, [accessToken, http, id, path]);

  const create = useCallback(
    async (payload: unknown) => {
      if (!accessToken) return null;

      setLoading(true);
      setError(null);

      try {
        return await http.post<TEntity>(path, payload);
      } catch (e) {
        const parsed = parseHttpClientError(e);
        setError(
          parsed ?? {
            i18nKey: 'server_error',
            message: e instanceof Error ? e.message : String(e),
          },
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [accessToken, http, path],
  );

  const update = useCallback(
    async (id: string, payload: unknown) => {
      if (!accessToken) return null;

      setLoading(true);
      setError(null);

      try {
        return await http.patch<TEntity>(`${path}/${id}`, payload);
      } catch (e) {
        const parsed = parseHttpClientError(e);
        setError(
          parsed ?? {
            i18nKey: 'server_error',
            message: e instanceof Error ? e.message : String(e),
          },
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [accessToken, http, path],
  );

  const remove = useCallback(
    async (id: string) => {
      if (!accessToken) return null;

      setLoading(true);
      setError(null);

      try {
        await http.delete(`${path}/${id}`);
        return true;
      } catch (e) {
        const parsed = parseHttpClientError(e);
        setError(
          parsed ?? {
            i18nKey: 'server_error',
            message: e instanceof Error ? e.message : String(e),
          },
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [accessToken, http, path],
  );

  useEffect(() => {
    if (id) {
      void findById();
    }
  }, [findById, id]);

  const clearError = useCallback(() => setError(null), []);

  return { create, update, remove, loading, error, clearError, findById, entity };
}
