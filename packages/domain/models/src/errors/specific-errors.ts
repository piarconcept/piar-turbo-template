import { ApplicationError } from './application-error';
import { ErrorCode } from './error-codes';

/**
 * Authentication errors
 */
export class UnauthorizedError extends ApplicationError {
  constructor(message = 'Unauthorized', details?: Record<string, unknown>, i18nKey?: string) {
    super(ErrorCode.UNAUTHORIZED, message, details, i18nKey);
    this.name = 'UnauthorizedError';
  }
}

export class InvalidCredentialsError extends ApplicationError {
  constructor(message = 'Invalid credentials', details?: Record<string, unknown>, i18nKey?: string) {
    super(ErrorCode.INVALID_CREDENTIALS, message, details, i18nKey);
    this.name = 'InvalidCredentialsError';
  }
}

export class TokenExpiredError extends ApplicationError {
  constructor(message = 'Token expired', details?: Record<string, unknown>, i18nKey?: string) {
    super(ErrorCode.TOKEN_EXPIRED, message, details, i18nKey);
    this.name = 'TokenExpiredError';
  }
}

export class ForbiddenError extends ApplicationError {
  constructor(message = 'Forbidden', details?: Record<string, unknown>, i18nKey?: string) {
    super(ErrorCode.FORBIDDEN, message, details, i18nKey);
    this.name = 'ForbiddenError';
  }
}

/**
 * Resource errors
 */
export class NotFoundError extends ApplicationError {
  constructor(resource: string, identifier?: string | number, i18nKey?: string) {
    const message = identifier
      ? `${resource} with id '${identifier}' not found`
      : `${resource} not found`;
    super(ErrorCode.NOT_FOUND, message, { resource, identifier }, i18nKey);
    this.name = 'NotFoundError';
  }
}

export class ResourceAlreadyExistsError extends ApplicationError {
  constructor(resource: string, identifier?: string | number, i18nKey?: string) {
    const message = identifier
      ? `${resource} with id '${identifier}' already exists`
      : `${resource} already exists`;
    super(ErrorCode.RESOURCE_ALREADY_EXISTS, message, { resource, identifier }, i18nKey);
    this.name = 'ResourceAlreadyExistsError';
  }
}

/**
 * Validation errors
 */
export class ValidationError extends ApplicationError {
  constructor(message = 'Validation failed', validationErrors?: Record<string, string[]>, i18nKey?: string) {
    super(ErrorCode.VALIDATION_ERROR, message, { validationErrors }, i18nKey);
    this.name = 'ValidationError';
  }
}

/**
 * Business logic errors
 */
export class BusinessRuleViolationError extends ApplicationError {
  constructor(rule: string, message?: string, i18nKey?: string) {
    super(
      ErrorCode.BUSINESS_RULE_VIOLATION,
      message || `Business rule violation: ${rule}`,
      { rule },
      i18nKey
    );
    this.name = 'BusinessRuleViolationError';
  }
}

/**
 * Server errors
 */
export class InternalServerError extends ApplicationError {
  constructor(message = 'Internal server error', details?: Record<string, unknown>, i18nKey?: string) {
    super(ErrorCode.INTERNAL_SERVER_ERROR, message, details, i18nKey);
    this.name = 'InternalServerError';
  }
}
