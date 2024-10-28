import { JwtService } from '@nestjs/jwt';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { JWT, LoginRequest, LoginResponse, User } from './dto/auth.dto';
import { UserRepositoryService } from '@app/persistence/user/user.repository.service';
import { ConfigService } from '@app/common/config/config.service';
import {
  ServiceException,
  ServiceExceptionCode,
} from '@app/common/ServiceException';
import { GetUserByIdDto } from '@app/persistence/user/user.repository.dto';
import { UserEntity } from '@app/persistence/user/user.entity';
import { TelegramService } from '../telegram/telegram.service';
import { TelegramLoginData } from '../telegram/dto/telegram.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepositoryService: UserRepositoryService,
    private readonly telegramService: TelegramService,

    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async getUserById(id: number): Promise<User> {
    const queryDto = await GetUserByIdDto.from({ id });
    const userEntity = await this.userRepositoryService.getUserById(queryDto);

    const user = await User.fromEntity(userEntity);

    return user;
  }

  async signIn(dto: LoginRequest): Promise<LoginResponse> {
    const loginData = await TelegramLoginData.from({ ...dto });

    const isVerified = await this.telegramService.verify(loginData);

    if (!isVerified) {
      throw new ServiceException(
        ServiceExceptionCode.InvalidUser,
        HttpStatus.UNAUTHORIZED,
      );
    }

    let userEntity = await this.userRepositoryService.findUserBySocialId(
      dto.id.toString(),
    );

    if (!userEntity) {
      const entity = await UserEntity.from({
        socialId: dto.id.toString(),
        firstName: dto.first_name,
        lastName: dto.last_name,
        photoUrl: dto.photo_url,
        userName: dto.username,
      });
      userEntity = await this.userRepositoryService.saveUser(entity);
    }

    const user = await User.fromEntity(userEntity!);
    const jwt: JWT = await this.generateLoginJwt(user);

    return {
      ...jwt,
      user,
    };
  }

  async generateLoginJwt(user: User): Promise<JWT> {
    const payload = JSON.parse(JSON.stringify(user));

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: ConfigService.getConfig().JWT_ACCESS_EXPIRES_IN,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: ConfigService.getConfig().JWT_REFRESH_EXPIRES_IN,
    });

    const result = {
      accessToken,
      refreshToken,
    };

    return result;
  }
}
