import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApplicationError } from '@piar/domain-models';

/**
 * Interceptor that catches errors in the response pipeline
 * Ensures errors are properly logged and formatted
 */
@Injectable()
export class ErrorResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // If it's already an ApplicationError, just re-throw it
        // The ApplicationErrorFilter will handle it
        if (error instanceof ApplicationError) {
          return throwError(() => error);
        }

        // Log unexpected errors
        const request = context.switchToHttp().getRequest();
        this.logger.error(
          `Unexpected error in ${request.method} ${request.url}`,
          error instanceof Error ? error.stack : error,
        );

        // Re-throw to let GlobalExceptionFilter handle it
        return throwError(() => error);
      }),
    );
  }
}
