import { ApplicationError, ErrorCode } from '@piar/domain-models';

const SAFE_ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred',
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'Internal server error',
  [ErrorCode.BAD_REQUEST]: 'Bad request',
  [ErrorCode.VALIDATION_ERROR]: 'Validation failed',
  [ErrorCode.UNAUTHORIZED]: 'Unauthorized',
  [ErrorCode.FORBIDDEN]: 'Forbidden',
  [ErrorCode.INVALID_CREDENTIALS]: 'Invalid credentials',
  [ErrorCode.TOKEN_EXPIRED]: 'Token expired',
  [ErrorCode.TOKEN_INVALID]: 'Invalid token',
  [ErrorCode.NOT_FOUND]: 'Resource not found',
  [ErrorCode.RESOURCE_ALREADY_EXISTS]: 'Resource already exists',
  [ErrorCode.BUSINESS_RULE_VIOLATION]: 'Business rule violation',
  [ErrorCode.OPERATION_NOT_ALLOWED]: 'Operation not allowed',
};

const HTTP_ERROR_DETAILS: Record<number, { code: ErrorCode; message: string }> = {
  400: { code: ErrorCode.BAD_REQUEST, message: 'Bad request' },
  401: { code: ErrorCode.UNAUTHORIZED, message: 'Unauthorized' },
  403: { code: ErrorCode.FORBIDDEN, message: 'Forbidden' },
  404: { code: ErrorCode.NOT_FOUND, message: 'Resource not found' },
  409: { code: ErrorCode.RESOURCE_ALREADY_EXISTS, message: 'Resource already exists' },
  422: { code: ErrorCode.BUSINESS_RULE_VIOLATION, message: 'Unprocessable request' },
  429: { code: ErrorCode.BAD_REQUEST, message: 'Too many requests' },
};

export interface SafeErrorResponse {
  code: ErrorCode;
  message: string;
  statusCode: number;
  details: { eventId: string };
  timestamp: string;
  i18nKey?: string;
}

export function serializeApplicationError(
  exception: ApplicationError,
  eventId: string,
): SafeErrorResponse {
  return {
    code: exception.code,
    message: SAFE_ERROR_MESSAGES[exception.code],
    statusCode: exception.statusCode,
    details: { eventId },
    timestamp: exception.timestamp,
    ...(exception.i18nKey ? { i18nKey: exception.i18nKey } : {}),
  };
}

export function serializeHttpError(statusCode: number, eventId: string): SafeErrorResponse {
  const safeStatus = statusCode >= 400 && statusCode < 600 ? statusCode : 500;
  const fallback = {
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
  };
  const error = safeStatus < 500 ? (HTTP_ERROR_DETAILS[safeStatus] ?? fallback) : fallback;

  return {
    ...error,
    statusCode: safeStatus,
    details: { eventId },
    timestamp: new Date().toISOString(),
  };
}
