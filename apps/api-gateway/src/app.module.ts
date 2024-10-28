import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionFilter } from '@app/common/filters/exception.filter';
import { HealthController } from './health/health.controller';
import { AssetModule } from './asset/asset.module';
import { getLoggerModule } from '@app/logger/logger.module';
import { getTypeOrmModule } from '@app/database-config/getTypeOrmModule';
import { AuthModule } from './auth/auth.module';
import { TelegramModule } from './telegram/telegram.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@app/common/config/config.service';

@Module({
  imports: [
    {
      ...JwtModule.register({ secret: ConfigService.getConfig().JWT_SECRET }),
      global: true,
    },
    getLoggerModule(),
    getTypeOrmModule(),
    AssetModule,
    AuthModule,
    TelegramModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export class AppModule {}
