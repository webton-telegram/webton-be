import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepositoryService } from './user/user.repository.service';
import { UserEntity } from './user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserRepositoryService],
  exports: [UserRepositoryService],
})
export class PersistenceModule {}
