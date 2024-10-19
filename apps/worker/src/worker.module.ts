import { Module } from '@nestjs/common';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionFilter } from '@app/common/filters/exception.filter';
import { getLoggerModule } from '@app/logger/logger.module';
import { getTypeOrmModule } from '@app/database-config/getTypeOrmModule';

@Module({
  imports: [getLoggerModule(), getTypeOrmModule()],
  controllers: [WorkerController],
  providers: [
    WorkerService,
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export class WorkerModule {}
