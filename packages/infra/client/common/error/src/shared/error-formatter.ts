import { ApplicationError } from '@piar/domain-models';

/**
 * Translation function type (from next-intl or similar)
 */
export type TranslationFunction = (key: string, defaultValue?: string) => string;

/**
 * Format error message for display to user
 * Uses i18nKey if available, otherwise falls back to message
 */
export function formatErrorMessage(
  error: ApplicationError | Error,
  t?: TranslationFunction,
): string {
  if (error instanceof ApplicationError) {
    // Use i18nKey if available and translation function provided
    if (error.i18nKey && t) {
      return t(error.i18nKey, error.message);
    }
    return error.message;
  }

  // Generic error
  return error.message || 'An unexpected error occurred';
}

/**
 * Format error for logging/debugging
 */
export function formatErrorForLogging(error: unknown): Record<string, unknown> {
  if (error instanceof ApplicationError) {
    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      i18nKey: error.i18nKey,
      timestamp: error.timestamp,
    };
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    error: String(error),
  };
}

/**
 * Get user-friendly error title based on status code
 */
export function getErrorTitle(error: ApplicationError, t?: TranslationFunction): string {
  const statusCode = error.statusCode;

  if (t) {
    // Try to get translated title
    const key = `errors.titles.${statusCode}`;
    const translated = t(key);
    if (translated !== key) return translated;
  }

  // Fallback to default titles
  switch (statusCode) {
    case 400:
      return 'Bad Request';
    case 401:
      return 'Unauthorized';
    case 403:
      return 'Forbidden';
    case 404:
      return 'Not Found';
    case 409:
      return 'Conflict';
    case 422:
      return 'Validation Error';
    case 500:
      return 'Server Error';
    default:
      return 'Error';
  }
}
