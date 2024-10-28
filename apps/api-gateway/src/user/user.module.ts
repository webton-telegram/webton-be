import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PersistenceModule } from '@app/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
