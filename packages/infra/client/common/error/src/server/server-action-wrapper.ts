import { ErrorCode } from '@piar/domain-models';
import { isApplicationError } from '../shared/http-error-deserializer';
import { logServerError } from './error-handler';

/**
 * Result type for Server Actions
 */
export type ServerActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string; code?: ErrorCode; i18nKey?: string } };

/**
 * Wrap a Server Action with error handling
 * Ensures errors are properly caught and serialized
 * 
 * @example
 * ```tsx
 * export const loginAction = wrapServerAction(async (formData: FormData) => {
 *   const email = formData.get('email') as string;
 *   const password = formData.get('password') as string;
 *   
 *   const result = await authService.login({ email, password });
 *   return { userId: result.userId };
 * });
 * 
 * // In component:
 * const result = await loginAction(formData);
 * if (result.success) {
 *   // Handle success
 * } else {
 *   // Handle error: result.error.message
 * }
 * ```
 */
export function wrapServerAction<TArgs extends unknown[], TReturn>(
  action: (...args: TArgs) => Promise<TReturn>
): (...args: TArgs) => Promise<ServerActionResult<TReturn>> {
  return async (...args: TArgs) => {
    try {
      const data = await action(...args);
      return { success: true, data };
    } catch (error) {
      // Log error on server
      logServerError(error, { action: action.name, args });

      // Serialize error for client
      if (isApplicationError(error)) {
        return {
          success: false,
          error: {
            message: error.message,
            code: error.code,
            i18nKey: error.i18nKey,
          },
        };
      }

      // Generic error
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  };
}

/**
 * Unwrap a Server Action result
 * Throws error if not successful, returns data otherwise
 * 
 * @example
 * ```tsx
 * const data = unwrapServerActionResult(await loginAction(formData));
 * // If error, will throw. Otherwise, data is typed correctly.
 * ```
 */
export function unwrapServerActionResult<T>(result: ServerActionResult<T>): T {
  if (result.success) {
    return result.data;
  }
  throw new Error(result.error.message);
}
