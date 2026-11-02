import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApplicationError } from '@piar/domain-models';

/**
 * Interceptor that catches errors in the response pipeline
 * Ensures errors are properly logged and formatted
 */
@Injectable()
export class ErrorResponseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // If it's already an ApplicationError, just re-throw it
        // The ApplicationErrorFilter will handle it
        if (error instanceof ApplicationError) {
          return throwError(() => error);
        }

        return throwError(() => error);
      }),
    );
  }
}
