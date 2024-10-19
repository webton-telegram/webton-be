import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { Response } from 'express';

@Controller()
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Post('task')
  task(@Body() body: any, @Res() res: Response): any {
    this.workerService.task(body);
    res.status(HttpStatus.OK).send('good');
  }
}
