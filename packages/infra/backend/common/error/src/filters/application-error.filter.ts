import { randomUUID } from 'node:crypto';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ApplicationError } from '@piar/domain-models';
import { serializeApplicationError, serializeHttpError } from './safe-error-response';

function requestContext(request: { method?: string; route?: { path?: string } }) {
  return {
    method: request.method ?? 'UNKNOWN',
    route: request.route?.path ?? 'unmatched',
  };
}

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

    const eventId = randomUUID();
    const errorResponse = serializeApplicationError(exception, eventId);

    this.logger.error({
      eventId,
      ...requestContext(request),
      code: exception.code,
      statusCode: exception.statusCode,
    });

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
    const eventId = randomUUID();

    // Check if it's an HttpException (NestJS built-in)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      this.logger.error({
        eventId,
        ...requestContext(request),
        status,
      });
      response.status(status).json(serializeHttpError(status, eventId));
      return;
    }

    // Check if it's already an ApplicationError
    if (
      exception instanceof ApplicationError ||
      ((exception as ApplicationError).code !== undefined &&
        (exception as ApplicationError).message !== undefined)
    ) {
      const exc = exception as ApplicationError;
      const errorResponse = serializeApplicationError(exc, eventId);

      this.logger.error({
        eventId,
        ...requestContext(request),
        code: exc.code,
        statusCode: exc.statusCode,
      });

      response.status(exc.statusCode).json(errorResponse);
      return;
    }

    this.logger.error({
      eventId,
      ...requestContext(request),
      statusCode: 500,
      errorType: exception instanceof Error ? exception.name : 'UnknownError',
    });
    response.status(500).json(serializeHttpError(500, eventId));
  }
}
