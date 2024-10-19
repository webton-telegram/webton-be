import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { ServiceException } from '../ServiceException';
import { ConfigService } from '../config/config.service';
import { ResponseExceptionDto } from '../dto/response-exception.dto';
// import { ExceptionCode, ExceptionMessage } from 'src/constant/exception';
// import { ReportProvider } from 'src/provider/report.provider';

@Catch()
export class ExceptionFilter extends BaseExceptionFilter {
  catch(exception: ServiceException | Error, host: ArgumentsHost) {
    const status =
      exception instanceof ServiceException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const code =
      exception instanceof ServiceException ? exception.getCode() : undefined;

    const http = host.switchToHttp();
    const { id, method, body, query, params, url, headers, _startTime } =
      http.getRequest();
    const response = host.switchToHttp().getResponse<Response>();

    Logger.error(exception.stack);
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      // ReportProvider.report(exception, {
      //   method,
      //   body,
      //   query,
      //   params,
      //   url,
      //   headers,
      //   startTime: _startTime,
      // });
    }

    response
      .status(status)
      .json(
        new ResponseExceptionDto(
          code,
          id,
          !ConfigService.isProduction() ? exception.message : undefined,
        ),
      );
  }
}
