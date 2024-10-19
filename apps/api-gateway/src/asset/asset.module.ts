import { Module } from '@nestjs/common';
import { AsseetController } from './asset.controller';
import { AssetService } from './asset.service';

@Module({
  imports: [],
  providers: [AssetService],
  controllers: [AsseetController],
})
export class AssetModule {}
