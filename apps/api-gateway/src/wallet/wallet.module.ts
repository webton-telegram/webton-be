import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { PersistenceModule } from '@app/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
