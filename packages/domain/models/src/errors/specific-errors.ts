import { ApplicationError } from './application-error';
import { ErrorCode } from './error-codes';

/**
 * Authentication errors
 */
export class UnauthorizedError extends ApplicationError {
  constructor(message = 'Unauthorized', details?: Record<string, unknown>) {
    super(ErrorCode.UNAUTHORIZED, message, details);
    this.name = 'UnauthorizedError';
  }
}

export class InvalidCredentialsError extends ApplicationError {
  constructor(message = 'Invalid credentials', details?: Record<string, unknown>) {
    super(ErrorCode.INVALID_CREDENTIALS, message, details);
    this.name = 'InvalidCredentialsError';
  }
}

export class TokenExpiredError extends ApplicationError {
  constructor(message = 'Token expired', details?: Record<string, unknown>) {
    super(ErrorCode.TOKEN_EXPIRED, message, details);
    this.name = 'TokenExpiredError';
  }
}

export class ForbiddenError extends ApplicationError {
  constructor(message = 'Forbidden', details?: Record<string, unknown>) {
    super(ErrorCode.FORBIDDEN, message, details);
    this.name = 'ForbiddenError';
  }
}

/**
 * Resource errors
 */
export class NotFoundError extends ApplicationError {
  constructor(resource: string, identifier?: string | number) {
    const message = identifier
      ? `${resource} with id '${identifier}' not found`
      : `${resource} not found`;
    super(ErrorCode.NOT_FOUND, message, { resource, identifier });
    this.name = 'NotFoundError';
  }
}

export class ResourceAlreadyExistsError extends ApplicationError {
  constructor(resource: string, identifier?: string | number) {
    const message = identifier
      ? `${resource} with id '${identifier}' already exists`
      : `${resource} already exists`;
    super(ErrorCode.RESOURCE_ALREADY_EXISTS, message, { resource, identifier });
    this.name = 'ResourceAlreadyExistsError';
  }
}

/**
 * Validation errors
 */
export class ValidationError extends ApplicationError {
  constructor(message = 'Validation failed', validationErrors?: Record<string, string[]>) {
    super(ErrorCode.VALIDATION_ERROR, message, { validationErrors });
    this.name = 'ValidationError';
  }
}

/**
 * Business logic errors
 */
export class BusinessRuleViolationError extends ApplicationError {
  constructor(rule: string, message?: string) {
    super(
      ErrorCode.BUSINESS_RULE_VIOLATION,
      message || `Business rule violation: ${rule}`,
      { rule }
    );
    this.name = 'BusinessRuleViolationError';
  }
}
