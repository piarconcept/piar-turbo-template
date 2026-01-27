import { isApplicationError } from '../shared/http-error-deserializer';

/**
 * Extract error information for Server Components
 * Returns error data that can be passed to error UI components
 *
 * @example
 * ```tsx
 * import { ErrorPage } from '@piar/ui-components';
 *
 * export default async function Page() {
 *   try {
 *     const data = await fetchData();
 *     return <div>{data}</div>;
 *   } catch (error) {
 *     const errorData = extractServerError(error);
 *     return <ErrorPage {...errorData} />;
 *   }
 * }
 * ```
 */
export function extractServerError(error: unknown): {
  message: string;
  statusCode?: number;
  code?: number;
  i18nKey?: string;
  details?: Record<string, unknown>;
} {
  if (isApplicationError(error)) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: parseInt(error.code),
      i18nKey: error.i18nKey,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'An unexpected error occurred',
  };
}

/**
 * Log error on the server
 * Can be extended to send to monitoring services
 */
export function logServerError(error: unknown, context?: Record<string, unknown>) {
  if (isApplicationError(error)) {
    console.error('[Server Error]', {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      i18nKey: error.i18nKey,
      context,
    });
  } else if (error instanceof Error) {
    console.error('[Server Error]', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      context,
    });
  } else {
    console.error('[Server Error]', { error: String(error), context });
  }
}
