export class ListData<T> {
  total!: number;
  list!: Array<T>;
}

export class ResponseListDto<T> {
  result: boolean;
  data: ListData<T>;

  constructor(list: Array<T> | null, total?: number, result = true) {
    this.result = result;
    this.data = {
      total: total ? total : list ? list.length : 0,
      list: list || [],
    };
  }
}
