import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { TypeORMError, EntityNotFoundError, QueryFailedError } from 'typeorm';
import { ValidationError } from 'class-validator';

type MyResponseObj = {
  statusCode: number;
  path: string;
  response: string | object;
};

@Catch()
export class ExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status;
    let message;

    console.error(exception);
    // Check the type of the error and set the corresponding status code and error message
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else if (exception instanceof ValidationError) {
      // Handling validation errors for class-validator
      status = HttpStatus.BAD_REQUEST;
      message = `Validation failed for property: ${exception.property}`;
    } else if (exception instanceof EntityNotFoundError) {
      // Handling EntityNotFoundError
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    } else if (exception instanceof QueryFailedError) {
      // Handling QueryFailedError
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof TypeORMError) {
      // Handling TypeORMError
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    // Set the response object and send it to the client
    const responseObj: MyResponseObj = {
      statusCode: status,
      path: request.url,
      response: message,
    };

    response.status(status).json(responseObj);
  }
}
