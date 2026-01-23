import { useState, useCallback } from 'react';
import { ApplicationError, SerializableError, ErrorCode } from '@piar/domain-models';

/**
 * Hook for handling API errors in React components
 * 
 * Usage:
 * ```tsx
 * const { error, handleError, clearError, isAuthError } = useApiError();
 * 
 * try {
 *   const data = await fetchData();
 * } catch (err) {
 *   handleError(err);
 * }
 * 
 * if (isAuthError) {
 *   // Redirect to login
 * }
 * ```
 */
export function useApiError() {
  const [error, setError] = useState<ApplicationError | null>(null);

  const handleError = useCallback((error: unknown) => {
    if (error instanceof ApplicationError) {
      setError(error);
      return;
    }

    // If it's a serialized error from API
    if (error && typeof error === 'object' && 'code' in error) {
      const appError = ApplicationError.fromJSON(error as SerializableError);
      setError(appError);
      return;
    }

    // Unknown error
    setError(ApplicationError.fromError(error));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Helper computed values
  const isAuthError = error?.code === ErrorCode.UNAUTHORIZED || 
                      error?.code === ErrorCode.TOKEN_EXPIRED ||
                      error?.code === ErrorCode.INVALID_CREDENTIALS;

  const isNotFoundError = error?.code === ErrorCode.NOT_FOUND ||
                          error?.code === ErrorCode.RESOURCE_NOT_FOUND;

  const isValidationError = error?.code === ErrorCode.VALIDATION_ERROR;

  return {
    error,
    handleError,
    clearError,
    isAuthError,
    isNotFoundError,
    isValidationError,
  };
}

/**
 * Hook for making API calls with automatic error handling
 * 
 * Usage:
 * ```tsx
 * const { data, loading, error, execute } = useApiCall(
 *   async () => fetch('/api/users').then(r => r.json())
 * );
 * 
 * // In component
 * useEffect(() => {
 *   execute();
 * }, []);
 * ```
 */
export function useApiCall<T>(
  apiCall: () => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: ApplicationError) => void;
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const { error, handleError, clearError } = useApiError();

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      
      const result = await apiCall();
      setData(result);
      
      if (options?.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    } catch (err) {
      handleError(err);
      
      if (options?.onError && err instanceof ApplicationError) {
        options.onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, handleError, clearError, options]);

  return {
    data,
    loading,
    error,
    execute,
    clearError,
  };
}

/**
 * Utility function to handle fetch responses and extract errors
 * 
 * Usage:
 * ```tsx
 * const response = await fetch('/api/users');
 * const data = await handleApiResponse(response);
 * ```
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    try {
      const errorData: SerializableError = await response.json();
      throw ApplicationError.fromJSON(errorData);
    } catch (err) {
      if (err instanceof ApplicationError) {
        throw err;
      }
      // If JSON parsing fails, create a generic error
      throw new ApplicationError(
        ErrorCode.UNKNOWN_ERROR,
        `HTTP ${response.status}: ${response.statusText}`
      );
    }
  }

  return response.json();
}
