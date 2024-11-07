import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionFilter } from '@app/common/filters/exception.filter';
import { HealthController } from './health/health.controller';
import { getLoggerModule } from '@app/logger/logger.module';
import { getTypeOrmModule } from '@app/database-config/getTypeOrmModule';
import { AuthModule } from './auth/auth.module';
import { TelegramModule } from './telegram/telegram.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@app/common/config/config.service';
import { WalletModule } from './wallet/wallet.module';
import { UserModule } from './user/user.module';
import { TonModule } from './ton/ton.module';
import { ToonModule } from './toon/toon.module';

@Module({
  imports: [
    {
      ...JwtModule.register({ secret: ConfigService.getConfig().JWT_SECRET }),
      global: true,
    },
    getLoggerModule(),
    getTypeOrmModule(),
    AuthModule,
    TelegramModule,
    WalletModule,
    UserModule,
    TonModule,
    ToonModule,
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
