import { HttpException, HttpStatus } from '@nestjs/common';

export class ServiceException extends HttpException {
  constructor(
    public readonly code: ServiceExceptionCode,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    message?: string,
  ) {
    super(message ?? code.toString(), status);
  }

  getCode() {
    return this.code;
  }
}

export enum ServiceExceptionCode {
  Unauthorized = 'UNAUTHORIZED',
  MissingAuthToken = 'MISSING_AUTHENTICATION_TOKEN',
  InvalidAccessToken = 'INVALID_ACCESS_TOKEN',
  TokenExpired = 'TOKEN_EXPIRED',
  FailedDecryption = 'FAILED_DECRYPTION',
  InvalidUser = 'INVALID_USER',

  PermissionDenied = 'PERMISSION_DENIED',
  DeletedContent = 'DELETED_CONTENT',

  ContentNotFound = 'CONTENT_NOT_FOUND',
  DuplicateRequest = 'DUPLICATE_REQUEST',

  BadRequest = 'BAD_REQUEST',
}
