import { Module } from '@nestjs/common';
import { ToonController } from './toon.controller';
import { ToonService } from './toon.service';
import { PersistenceModule } from '@app/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  controllers: [ToonController],
  providers: [ToonService],
  exports: [ToonService],
})
export class ToonModule {}
