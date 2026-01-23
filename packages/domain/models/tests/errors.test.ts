import { describe, it, expect } from 'vitest';
import {
  ApplicationError,
  ErrorCode,
  UnauthorizedError,
  NotFoundError,
  ValidationError,
  ResourceAlreadyExistsError,
  BusinessRuleViolationError,
} from '../src/errors';

describe('ApplicationError', () => {
  it('should create an error with code and message', () => {
    const error = new ApplicationError(
      ErrorCode.BAD_REQUEST,
      'Invalid input'
    );

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApplicationError);
    expect(error.code).toBe(ErrorCode.BAD_REQUEST);
    expect(error.message).toBe('Invalid input');
    expect(error.statusCode).toBe(400);
    expect(error.timestamp).toBeDefined();
  });

  it('should include details if provided', () => {
    const details = { field: 'email', value: 'invalid' };
    const error = new ApplicationError(
      ErrorCode.VALIDATION_ERROR,
      'Validation failed',
      details
    );

    expect(error.details).toEqual(details);
  });

  it('should serialize to JSON', () => {
    const error = new ApplicationError(
      ErrorCode.NOT_FOUND,
      'User not found',
      { userId: '123' },
      '/api/users/123'
    );

    const json = error.toJSON();

    expect(json).toEqual({
      code: ErrorCode.NOT_FOUND,
      message: 'User not found',
      statusCode: 404,
      details: { userId: '123' },
      timestamp: error.timestamp,
      path: '/api/users/123',
    });
  });

  it('should create error from JSON', () => {
    const json = {
      code: ErrorCode.UNAUTHORIZED,
      message: 'Token expired',
      statusCode: 401,
      timestamp: '2026-01-23T10:00:00.000Z',
      path: '/api/protected',
    };

    const error = ApplicationError.fromJSON(json);

    expect(error.code).toBe(ErrorCode.UNAUTHORIZED);
    expect(error.message).toBe('Token expired');
    expect(error.statusCode).toBe(401);
    expect(error.timestamp).toBe('2026-01-23T10:00:00.000Z');
    expect(error.path).toBe('/api/protected');
  });

  it('should create error from Error instance', () => {
    const originalError = new Error('Something went wrong');
    const appError = ApplicationError.fromError(originalError);

    expect(appError).toBeInstanceOf(ApplicationError);
    expect(appError.code).toBe(ErrorCode.UNKNOWN_ERROR);
    expect(appError.message).toBe('Something went wrong');
    expect(appError.details?.originalError).toBe('Error');
  });

  it('should return same error if already ApplicationError', () => {
    const original = new ApplicationError(ErrorCode.BAD_REQUEST, 'Test');
    const result = ApplicationError.fromError(original);

    expect(result).toBe(original);
  });

  it('should handle unknown error types', () => {
    const error = ApplicationError.fromError('String error');

    expect(error.message).toBe('String error');
    expect(error.code).toBe(ErrorCode.UNKNOWN_ERROR);
  });
});

describe('UnauthorizedError', () => {
  it('should create with default message', () => {
    const error = new UnauthorizedError();

    expect(error.code).toBe(ErrorCode.UNAUTHORIZED);
    expect(error.message).toBe('Unauthorized access');
    expect(error.statusCode).toBe(401);
  });

  it('should create with custom message', () => {
    const error = new UnauthorizedError('Please login first');

    expect(error.message).toBe('Please login first');
  });
});

describe('NotFoundError', () => {
  it('should create error without identifier', () => {
    const error = new NotFoundError('User');

    expect(error.code).toBe(ErrorCode.RESOURCE_NOT_FOUND);
    expect(error.message).toBe('User not found');
    expect(error.statusCode).toBe(404);
    expect(error.details).toEqual({ resource: 'User', identifier: undefined });
  });

  it('should create error with identifier', () => {
    const error = new NotFoundError('Product', 'ABC123');

    expect(error.message).toBe("Product with identifier 'ABC123' not found");
    expect(error.details).toEqual({ resource: 'Product', identifier: 'ABC123' });
  });

  it('should work with numeric identifiers', () => {
    const error = new NotFoundError('Order', 42);

    expect(error.message).toBe("Order with identifier '42' not found");
    expect(error.details).toEqual({ resource: 'Order', identifier: 42 });
  });
});

describe('ValidationError', () => {
  it('should create with default message', () => {
    const error = new ValidationError();

    expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
    expect(error.message).toBe('Validation failed');
    expect(error.statusCode).toBe(400);
  });

  it('should include validation errors', () => {
    const validationErrors = {
      email: ['Email is required', 'Email must be valid'],
      password: ['Password must be at least 8 characters'],
    };

    const error = new ValidationError('Invalid form data', validationErrors);

    expect(error.message).toBe('Invalid form data');
    expect(error.details).toEqual({ validationErrors });
  });
});

describe('ResourceAlreadyExistsError', () => {
  it('should create error without identifier', () => {
    const error = new ResourceAlreadyExistsError('Account');

    expect(error.message).toBe('Account already exists');
    expect(error.code).toBe(ErrorCode.RESOURCE_ALREADY_EXISTS);
    expect(error.statusCode).toBe(409);
  });

  it('should create error with identifier', () => {
    const error = new ResourceAlreadyExistsError('Email', 'user@example.com');

    expect(error.message).toBe("Email with identifier 'user@example.com' already exists");
  });
});

describe('BusinessRuleViolationError', () => {
  it('should create with rule name only', () => {
    const error = new BusinessRuleViolationError('minimum-balance');

    expect(error.code).toBe(ErrorCode.BUSINESS_RULE_VIOLATION);
    expect(error.message).toBe('Business rule violation: minimum-balance');
    expect(error.statusCode).toBe(422);
    expect(error.details?.rule).toBe('minimum-balance');
  });

  it('should create with custom message', () => {
    const error = new BusinessRuleViolationError(
      'minimum-balance',
      'Account balance cannot be negative'
    );

    expect(error.message).toBe('Account balance cannot be negative');
    expect(error.details?.rule).toBe('minimum-balance');
  });
});

describe('Error serialization and deserialization', () => {
  it('should maintain error information through JSON round-trip', () => {
    const original = new ValidationError('Invalid input', {
      email: ['Required field'],
    });

    const json = original.toJSON();
    const restored = ApplicationError.fromJSON(json);

    expect(restored.code).toBe(original.code);
    expect(restored.message).toBe(original.message);
    expect(restored.statusCode).toBe(original.statusCode);
    expect(restored.details).toEqual(original.details);
  });
});
