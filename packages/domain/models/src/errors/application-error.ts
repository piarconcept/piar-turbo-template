import { ErrorCode, ErrorCodeHttpStatus } from './error-codes';

/**
 * Serializable error details that can be sent to the frontend
 */
export interface SerializableError {
  code: ErrorCode;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
  timestamp: string;
  path?: string;
}

/**
 * Base application error class
 * This error can be serialized and sent from backend to frontend
 */
export class ApplicationError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;
  public readonly timestamp: string;
  public readonly path?: string;

  constructor(
    code: ErrorCode,
    message: string,
    details?: Record<string, unknown>,
    path?: string
  ) {
    super(message);
    this.name = 'ApplicationError';
    this.code = code;
    this.statusCode = ErrorCodeHttpStatus[code];
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.path = path;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApplicationError);
    }
  }

  /**
   * Converts the error to a serializable JSON object
   * This can be sent over HTTP to the frontend
   */
  toJSON(): SerializableError {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp,
      path: this.path,
    };
  }

  /**
   * Creates an ApplicationError from a serializable error object
   * Useful for recreating errors on the frontend from API responses
   */
  static fromJSON(json: SerializableError): ApplicationError {
    const error = new ApplicationError(
      json.code,
      json.message,
      json.details,
      json.path
    );
    // Override timestamp with the one from JSON
    (error as { timestamp: string }).timestamp = json.timestamp;
    return error;
  }

  /**
   * Creates an ApplicationError from an unknown error
   * Useful for catching and wrapping unexpected errors
   */
  static fromError(error: unknown, code = ErrorCode.UNKNOWN_ERROR): ApplicationError {
    if (error instanceof ApplicationError) {
      return error;
    }

    if (error instanceof Error) {
      return new ApplicationError(code, error.message, {
        originalError: error.name,
        stack: error.stack,
      });
    }

    return new ApplicationError(code, String(error));
  }
}
