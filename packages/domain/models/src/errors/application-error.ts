import { ErrorCode, ErrorCodeHttpStatus } from './error-codes';

/**
 * Serializable error interface
 * Can be sent from backend to frontend
 */
export interface SerializableError {
  code: ErrorCode;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Base application error entity
 * Pure domain error that can be serialized and shared between backend and frontend
 */
export class ApplicationError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;
  public readonly timestamp: string;

  constructor(
    code: ErrorCode,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApplicationError';
    this.code = code;
    this.statusCode = ErrorCodeHttpStatus[code];
    this.details = details;
    this.timestamp = new Date().toISOString();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApplicationError);
    }
  }

  /**
   * Serialize to JSON for transport
   */
  toJSON(): SerializableError {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp,
    };
  }

  /**
   * Create from serialized error (e.g., from API response)
   */
  static fromJSON(json: SerializableError): ApplicationError {
    return new ApplicationError(json.code, json.message, json.details);
  }
}
