import { ApplicationError, SerializableError } from '@piar/domain-models';

/**
 * Deserialize HTTP error response to ApplicationError
 * Works on both client and server (isomorphic)
 */
export function deserializeHttpError(
  response: Response | { data?: unknown; error?: unknown }
): ApplicationError | Error {
  try {
    // Handle fetch Response
    if (response instanceof Response) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        // Will be parsed by caller
        return new Error('HTTP error - use with response.json()');
      }
      return new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Handle axios-like response or error object
    const errorData = response.error || response.data;
    
    if (errorData && isSerializableError(errorData)) {
      return ApplicationError.fromJSON(errorData);
    }

    return new Error('Unknown error format');
  } catch {
    return new Error('Failed to deserialize error');
  }
}

/**
 * Deserialize JSON error response
 */
export function deserializeJsonError(json: unknown): ApplicationError | Error {
  if (isSerializableError(json)) {
    return ApplicationError.fromJSON(json);
  }
  return new Error('Invalid error format');
}

/**
 * Type guard for SerializableError
 */
function isSerializableError(obj: unknown): obj is SerializableError {
  return (
    obj !== null &&
    obj !== undefined &&
    typeof obj === 'object' &&
    'code' in obj &&
    'message' in obj &&
    'statusCode' in obj &&
    'timestamp' in obj
  );
}

/**
 * Check if error is an ApplicationError
 */
export function isApplicationError(error: unknown): error is ApplicationError {
  return error instanceof ApplicationError;
}
