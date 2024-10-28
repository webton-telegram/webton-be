import { UserEntity } from '@app/persistence/user/user.entity';

declare global {
  namespace Express {
    interface Request {
      userEntity: UserEntity;
    }
  }
}
