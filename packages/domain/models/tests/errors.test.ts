import { describe, it, expect } from 'vitest';
import {
  ApplicationError,
  ErrorCode,
  UnauthorizedError,
  NotFoundError,
  ValidationError,
  ResourceAlreadyExistsError,
} from '../src/errors';

describe('ApplicationError', () => {
  it('should create error with code and message', () => {
    const error = new ApplicationError(ErrorCode.BAD_REQUEST, 'Invalid input');

    expect(error).toBeInstanceOf(Error);
    expect(error.code).toBe(ErrorCode.BAD_REQUEST);
    expect(error.message).toBe('Invalid input');
    expect(error.statusCode).toBe(400);
    expect(error.timestamp).toBeDefined();
  });

  it('should include details', () => {
    const details = { field: 'email' };
    const error = new ApplicationError(ErrorCode.VALIDATION_ERROR, 'Invalid', details);

    expect(error.details).toEqual(details);
  });

  it('should serialize to JSON', () => {
    const error = new ApplicationError(ErrorCode.NOT_FOUND, 'User not found', { id: '123' });
    const json = error.toJSON();

    expect(json).toEqual({
      code: ErrorCode.NOT_FOUND,
      message: 'User not found',
      statusCode: 404,
      details: { id: '123' },
      timestamp: error.timestamp,
    });
  });

  it('should create from JSON', () => {
    const json = {
      code: ErrorCode.UNAUTHORIZED,
      message: 'Token expired',
      statusCode: 401,
      timestamp: '2026-01-23T10:00:00.000Z',
    };

    const error = ApplicationError.fromJSON(json);

    expect(error.code).toBe(ErrorCode.UNAUTHORIZED);
    expect(error.message).toBe('Token expired');
    expect(error.statusCode).toBe(401);
  });
});

describe('UnauthorizedError', () => {
  it('should create with default message', () => {
    const error = new UnauthorizedError();

    expect(error.code).toBe(ErrorCode.UNAUTHORIZED);
    expect(error.message).toBe('Unauthorized');
    expect(error.statusCode).toBe(401);
  });

  it('should create with custom message', () => {
    const error = new UnauthorizedError('Please login');

    expect(error.message).toBe('Please login');
  });
});

describe('NotFoundError', () => {
  it('should create without identifier', () => {
    const error = new NotFoundError('User');

    expect(error.message).toBe('User not found');
    expect(error.details).toEqual({ resource: 'User', identifier: undefined });
  });

  it('should create with identifier', () => {
    const error = new NotFoundError('Product', 'ABC123');

    expect(error.message).toBe("Product with id 'ABC123' not found");
    expect(error.details).toEqual({ resource: 'Product', identifier: 'ABC123' });
  });
});

describe('ValidationError', () => {
  it('should create with validation errors', () => {
    const validationErrors = {
      email: ['Email is required'],
      password: ['Too short'],
    };

    const error = new ValidationError('Invalid form', validationErrors);

    expect(error.message).toBe('Invalid form');
    expect(error.details).toEqual({ validationErrors });
  });
});

describe('ResourceAlreadyExistsError', () => {
  it('should create with identifier', () => {
    const error = new ResourceAlreadyExistsError('Email', 'user@example.com');

    expect(error.message).toBe("Email with id 'user@example.com' already exists");
    expect(error.statusCode).toBe(409);
  });
});
