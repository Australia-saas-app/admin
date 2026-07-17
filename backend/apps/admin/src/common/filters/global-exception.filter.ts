import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        error = (exceptionResponse as any).error || 'Error';
      } else {
        message = exceptionResponse;
      }
    } else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      message = this.handleDatabaseError(exception);
      error = 'Database Error';
    } else if (exception instanceof Error) {
      message = exception.message;
      
      if (message.includes('relation') && message.includes('does not exist')) {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        message = `Database table not found. Please run migrations or enable synchronize.`;
        error = 'Database Configuration Error';
      } else if (message.includes('duplicate key')) {
        status = HttpStatus.CONFLICT;
        message = 'Duplicate entry. The record already exists.';
        error = 'Conflict Error';
      } else if (message.includes('invalid input syntax')) {
        status = HttpStatus.BAD_REQUEST;
        message = 'Invalid data format.';
        error = 'Validation Error';
      }
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      error,
      message: Array.isArray(message) ? message : [message],
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : '',
    );

    response.status(status).json(errorResponse);
  }

  private handleDatabaseError(error: QueryFailedError): string {
    const message = error.message;

    if (message.includes('relation') && message.includes('does not exist')) {
      return `Database table not found. Please run migrations or enable synchronize.`;
    }

    if (message.includes('duplicate key')) {
      return 'Duplicate entry. The record already exists.';
    }

    if (message.includes('violates foreign key constraint')) {
      return 'Referenced record does not exist.';
    }

    if (message.includes('null value')) {
      return 'Required field is missing.';
    }

    return 'Database operation failed.';
  }
}
