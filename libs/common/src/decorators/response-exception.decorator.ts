import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ServiceExceptionCode } from '../ServiceException';

export const ResponseException = (
  status: HttpStatus,
  code: ServiceExceptionCode,
) =>
  applyDecorators(
    HttpCode(status),
    ApiResponse({
      status,
      schema: {
        allOf: [
          {
            properties: {
              result: {
                type: 'boolean',
                example: false,
              },
              code: {
                type: 'string',
                example: code,
              },
              traceId: {
                type: 'string',
                example: '',
              },
              message: {
                type: 'string',
                example: '',
              },
            },
          },
        ],
      },
    }),
  );
