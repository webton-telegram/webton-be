import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PersistenceModule } from '@app/persistence/persistence.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [PersistenceModule, TelegramModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
