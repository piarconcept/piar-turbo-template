import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ApplicationError, InternalServerError } from '@piar/domain-models';

/**
 * Global exception filter for ApplicationError
 * Catches domain errors and transforms them into HTTP responses
 */
@Catch(ApplicationError)
export class ApplicationErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApplicationErrorFilter.name);

  catch(exception: ApplicationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const errorResponse = exception.toJSON();

    // Log the error for monitoring
    this.logger.error(`${request.method} ${request.url} - ${exception.message}`, {
      code: exception.code,
      statusCode: exception.statusCode,
      details: exception.details,
      i18nKey: exception.i18nKey,
      stack: exception.stack,
    });

    // Send error response to client
    response.status(exception.statusCode).json(errorResponse);
  }
}

/**
 * Fallback exception filter for unexpected errors
 * Converts all non-ApplicationError exceptions into domain errors
 * This ensures the frontend ALWAYS receives structured error responses
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // Check if it's an HttpException (NestJS built-in)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      this.logger.error(`${request.method} ${request.url} - HTTP Exception`, {
        status,
        response: exceptionResponse,
      });

      // Convert HttpException to domain error
      const message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'HTTP Exception';

      const domainError = new InternalServerError(message, {
        originalStatus: status,
        originalResponse: exceptionResponse,
      });

      response.status(status).json(domainError.toJSON());
      return;
    }

    // Check if it's already an ApplicationError
    if (
      exception instanceof ApplicationError ||
      ((exception as ApplicationError).code !== undefined &&
        (exception as ApplicationError).message !== undefined)
    ) {
      const errorResponse = (exception as ApplicationError).toJSON();
      const exc = exception as ApplicationError;

      this.logger.error(`${request.method} ${request.url} - Application Error`, {
        code: exc.code,
        statusCode: exc.statusCode,
        details: exc.details,
        i18nKey: exc.i18nKey,
        stack: exc.stack,
      });

      response.status(exc.statusCode).json(errorResponse);
      return;
    }

    // Unknown error - convert to InternalServerError (domain error)
    const errorMessage =
      exception instanceof Error ? exception.message : 'An unexpected error occurred';

    this.logger.error(
      `${request.method} ${request.url} - Unexpected error`,
      exception instanceof Error ? exception.stack : exception,
    );

    const domainError = new InternalServerError(errorMessage, {
      originalError: exception instanceof Error ? exception.name : 'UnknownError',
    });

    response.status(500).json(domainError.toJSON());
  }
}
