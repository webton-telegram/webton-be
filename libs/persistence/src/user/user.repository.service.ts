import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { ServiceError } from 'src/types/exception';
// import { ExceptionCode, ExceptionMessage } from 'src/constant/exception';
import { GetUserByIdDto } from './user.repository.dto';
import { UserEntity } from './user.entity';
import {
  ServiceException,
  ServiceExceptionCode,
} from '@app/common/ServiceException';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getUserById(dto: GetUserByIdDto): Promise<UserEntity> {
    const user = await this.findUserById(dto);

    if (!user) {
      throw new ServiceException(ServiceExceptionCode.ContentNotFound);
    }

    return user;
  }

  async findUserById(dto: GetUserByIdDto): Promise<UserEntity | null> {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.wallet', 'w')
      .where('u.id = :id', { id: dto.id })
      .getOne();

    return user;
  }

  async getUserBySocialId(socialId: string): Promise<UserEntity> {
    const user = await this.findUserBySocialId(socialId);

    if (!user) {
      throw new ServiceException(ServiceExceptionCode.ContentNotFound);
    }

    return user;
  }

  async findUserBySocialId(socialId: string): Promise<UserEntity | null> {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.wallet', 'w')
      .where('u.socialId = :socialId', { socialId })
      .getOne();

    return user;
  }

  async saveUser(userEntity: UserEntity): Promise<UserEntity> {
    const user = await this.userRepository.save(userEntity);
    return user;
  }
}
