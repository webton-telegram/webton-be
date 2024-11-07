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
import { TransactionLogEntity } from './transaction-log/transaction-log.entity';
import { TransactionLogRepositoryService } from './transaction-log/transaction-log.repository.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      WalletEntity,
      ToonEntity,
      EpisodeEntity,
      HistoryLikeEntity,
      HistoryViewEntity,
      TransactionLogEntity,
    ]),
  ],
  providers: [
    UserRepositoryService,
    WalletRepositoryService,
    TransactionLogRepositoryService,
  ],
  exports: [
    UserRepositoryService,
    WalletRepositoryService,
    TransactionLogRepositoryService,
  ],
})
export class PersistenceModule {}
