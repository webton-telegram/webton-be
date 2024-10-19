import { ServiceExceptionCode } from '../ServiceException';

export class ResponseExceptionDto {
  result: boolean;
  code?: ServiceExceptionCode;
  tradeId?: string;
  message?: string;

  constructor(code?: ServiceExceptionCode, traceId?: string, message?: string) {
    this.result = false;
    this.code = code;
    this.tradeId = traceId;
    this.message = message;
  }
}
