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
import { console } from 'inspector';

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

    // Check the type of th error and set the corresponding status code and error message
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else if (exception instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.property;
    } else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = exception.message;
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
    super.catch(exception, host);
  }
}
