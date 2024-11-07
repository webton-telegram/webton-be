import {
  ServiceException,
  ServiceExceptionCode,
} from '@app/common/ServiceException';
import { UserRepositoryService } from '@app/persistence/user/user.repository.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './dto/auth.dto';
import { GetUserByIdDto } from '@app/persistence/user/user.repository.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(UserRepositoryService)
    private readonly userRepositoryService: UserRepositoryService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // Check jwt exists
    // const token: string =
    //   req.headers.authorization?.split(' ')[1] || req.headers.authorization!;
    // if (!token) {
    //   throw new ServiceException(
    //     ServiceExceptionCode.MissingAuthToken,
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }

    // // Verify auth token
    // try {
    //   this.jwtService.verify(token);
    // } catch (e) {
    //   throw new ServiceException(
    //     ServiceExceptionCode.TokenExpired,
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }

    // // Get payload by auth token
    // const payload = this.jwtService.decode(token) as User;

    // const queryDto = await GetUserByIdDto.from({ id: payload.id });
    const queryDto = await GetUserByIdDto.from({ id: 2 });
    const userEntity = await this.userRepositoryService.getUserById(queryDto);

    if (!userEntity) {
      throw new ServiceException(
        ServiceExceptionCode.InvalidAccessToken,
        HttpStatus.UNAUTHORIZED,
      );
    }

    // UserEntity into request
    req.userEntity = userEntity;

    return true;
  }
}
