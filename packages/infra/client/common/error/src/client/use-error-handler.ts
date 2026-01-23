'use client';

import { useState, useCallback } from 'react';
import { ApplicationError } from '@piar/domain-models';
import { deserializeJsonError, isApplicationError } from '../shared/http-error-deserializer';

export interface UseErrorHandlerReturn {
  error: ApplicationError | Error | null;
  handleError: (error: unknown) => void;
  clearError: () => void;
  isError: boolean;
}

/**
 * React hook for handling errors in client components
 * 
 * @example
 * ```tsx
 * function LoginForm() {
 *   const { error, handleError, clearError } = useErrorHandler();
 *   
 *   const onSubmit = async () => {
 *     try {
 *       await api.login();
 *     } catch (err) {
 *       handleError(err);
 *     }
 *   };
 *   
 *   return (
 *     <>
 *       {error && <ErrorMessage error={error} onClose={clearError} />}
 *       <form onSubmit={onSubmit}>...</form>
 *     </>
 *   );
 * }
 * ```
 */
export function useErrorHandler(): UseErrorHandlerReturn {
  const [error, setError] = useState<ApplicationError | Error | null>(null);

  const handleError = useCallback((err: unknown) => {
    if (isApplicationError(err)) {
      setError(err);
    } else if (err instanceof Error) {
      setError(err);
    } else if (typeof err === 'object' && err !== null) {
      // Try to deserialize from JSON response
      const deserialized = deserializeJsonError(err);
      setError(deserialized);
    } else {
      setError(new Error(String(err)));
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
    isError: error !== null,
  };
}

/**
 * Hook for handling async operations with error handling
 * 
 * @example
 * ```tsx
 * function DataComponent() {
 *   const { execute, loading, error } = useAsyncError(async () => {
 *     return await api.fetchData();
 *   });
 *   
 *   useEffect(() => {
 *     execute();
 *   }, []);
 *   
 *   if (loading) return <Spinner />;
 *   if (error) return <ErrorDisplay error={error} />;
 *   return <div>...</div>;
 * }
 * ```
 */
export function useAsyncError<T>(
  asyncFn: () => Promise<T>
): {
  execute: () => Promise<void>;
  data: T | null;
  loading: boolean;
  error: ApplicationError | Error | null;
  clearError: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const result = await asyncFn();
      setData(result);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [asyncFn, handleError, clearError]);

  return { execute, data, loading, error, clearError };
}
