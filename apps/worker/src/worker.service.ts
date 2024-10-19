import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WorkerService {
  task(body: any): any {
    Logger.log(`data >> ${JSON.stringify(body)}`);
    return true;
  }
}
