import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepositoryService } from './user/user.repository.service';
import { UserEntity } from './user/user.entity';
import { WalletEntity } from './wallet/wallet.entity';
import { ToonEntity } from './toon/toon.entity';
import { EpisodeEntity } from './episode/episode.entity';
import { HistoryLikeEntity } from './history-like/history-like.entity';
import { HistoryViewEntity } from './history-view/history-view.entity';
import { WalletRepositoryService } from './wallet/wallet.repository.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      WalletEntity,
      ToonEntity,
      EpisodeEntity,
      HistoryLikeEntity,
      HistoryViewEntity,
    ]),
  ],
  providers: [UserRepositoryService, WalletRepositoryService],
  exports: [UserRepositoryService, WalletRepositoryService],
})
export class PersistenceModule {}
