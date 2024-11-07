import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { PersistenceModule } from '@app/persistence/persistence.module';
import { TonModule } from '../ton/ton.module';

@Module({
  imports: [PersistenceModule, TonModule],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
