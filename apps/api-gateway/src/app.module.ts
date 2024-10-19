import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionFilter } from '@app/common/filters/exception.filter';
import { HealthController } from './health/health.controller';
import { AssetModule } from './asset/asset.module';
import { getLoggerModule } from '@app/logger/logger.module';
import { getTypeOrmModule } from '@app/database-config/getTypeOrmModule';

@Module({
  imports: [getLoggerModule(), getTypeOrmModule(), AssetModule],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export class AppModule {}
