export class ResponseDataDto<T> {
  result: boolean;
  data: T;

  constructor(data: T, result = true) {
    this.result = result;
    this.data = data;
  }
}
