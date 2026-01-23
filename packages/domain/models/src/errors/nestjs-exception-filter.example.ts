import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApplicationError } from '@piar/domain-models';

/**
 * Global exception filter that handles all exceptions
 * Converts ApplicationError instances to proper HTTP responses
 * 
 * Usage in main.ts:
 * app.useGlobalFilters(new AllExceptionsFilter());
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Handle ApplicationError (our custom errors)
    if (exception instanceof ApplicationError) {
      const errorResponse = {
        ...exception.toJSON(),
        path: request.url,
      };

      this.logger.error(
        `[${exception.code}] ${exception.message}`,
        exception.stack
      );

      return response.status(exception.statusCode).json(errorResponse);
    }

    // Handle NestJS HttpException
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      this.logger.error(
        `HTTP ${status}: ${exception.message}`,
        exception.stack
      );

      return response.status(status).json({
        statusCode: status,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
        details: typeof exceptionResponse === 'object' ? exceptionResponse : {},
      });
    }

    // Handle unknown errors
    this.logger.error('Unhandled exception', exception);

    return response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
