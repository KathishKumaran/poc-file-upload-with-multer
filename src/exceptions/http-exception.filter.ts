import logger from 'src/config/logger';

import { isAxiosError } from 'axios';
import { FastifyError } from 'fastify';
import { AbstractHttpAdapter } from '@nestjs/core';

import {
  Catch,
  HttpException,
  ArgumentsHost,
  ExceptionFilter,
} from '@nestjs/common';

import {
  PrismaClientRustPanicError,
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientInitializationError,
} from '@prisma/client/runtime/library';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: AbstractHttpAdapter) {}
  catch(exception: FastifyError, host: ArgumentsHost): void {
    let errorMessage: unknown;
    let httpStatus: number;
    const httpAdapter = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      errorMessage = exception.getResponse()['message'];
    } else if (exception instanceof PrismaClientRustPanicError) {
      httpStatus = 400;
      logger.error({ err: exception.message });
      errorMessage =
        'Sorry! something went to wrong on our end, Please try again later';
    } else if (exception instanceof PrismaClientValidationError) {
      httpStatus = 404;
      logger.error({ err: exception.message });
      errorMessage =
        'Sorry! something went to wrong on our end, Please try again later';
    } else if (exception instanceof PrismaClientKnownRequestError) {
      httpStatus = 400;
      logger.error({ err: exception.message });
      errorMessage =
        'Sorry! something went to wrong on our end, Please try again later';
    } else if (exception instanceof PrismaClientUnknownRequestError) {
      httpStatus = 400;
      logger.error({ err: exception.message });
      errorMessage =
        'Sorry! something went to wrong on our end, Please try again later';
    } else if (exception instanceof PrismaClientInitializationError) {
      httpStatus = 400;
      logger.error({ err: exception.message });
      errorMessage =
        'Sorry! something went to wrong on our end, Please try again later';
    } else if (exception.statusCode === 413) {
      logger.error({ err: exception.message });
      errorMessage = 'Request file too large';
    } else if (
      exception.statusCode &&
      exception.statusCode >= 400 &&
      exception.statusCode <= 499
    ) {
      httpStatus = exception.statusCode;
      errorMessage = exception.message;
    } else if (isAxiosError(exception)) {
      if (exception.response) {
        httpStatus = exception.response.status;
        exception.response.data.errorMessage
          ? (errorMessage = exception.response?.data?.errorMessage)
          : exception.response?.data?.error
            ? (errorMessage = exception.response?.data?.error)
            : (errorMessage = exception.response?.data?.message);
      } else {
        httpStatus = 500;
        errorMessage = [
          'Sorry! something went to wrong on our end, Please try again later',
        ];
        logger.error({ err: exception });
      }
    } else {
      httpStatus = 500;
      errorMessage = [
        'Sorry! something went to wrong on our end, Please try again later',
      ];
      logger.error({ err: exception });
    }
    const errorResponse = {
      errors: typeof errorMessage === 'string' ? [errorMessage] : errorMessage,
    };
    logger.error({ msg: errorMessage });
    httpAdapter.reply(ctx.getResponse(), errorResponse, httpStatus);
  }
}
