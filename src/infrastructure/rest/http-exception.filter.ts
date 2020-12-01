import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SentryService } from '@ntegral/nestjs-sentry';

import { DomainException } from 'domain/exceptions/DomainException';

/**
 * Http Error Filter.
 * Gets an HttpException in code and creates an error response
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  constructor(private readonly sentry: SentryService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = exception.getStatus();

    if (exception instanceof DomainException)
      response.status(statusCode).json({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });

    if (statusCode !== HttpStatus.UNPROCESSABLE_ENTITY)
      response.status(statusCode).json({
        statusCode,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });

    const exceptionResponse: any = exception.getResponse();

    response.status(statusCode).json({
      statusCode,
      error: exceptionResponse.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });

    this.sentry.instance().captureException(exception);
  }
}
