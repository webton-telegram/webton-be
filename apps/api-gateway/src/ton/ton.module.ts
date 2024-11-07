import { Module } from '@nestjs/common';
import { TonService } from './ton.service';
import { PersistenceModule } from '@app/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  providers: [TonService],
  controllers: [],
  exports: [TonService],
})
export class TonModule {}
