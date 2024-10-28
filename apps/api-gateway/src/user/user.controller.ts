import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { ResponseData } from '@app/common/decorators/response-data.decorator';
import { ResponseDataDto } from '@app/common/dto/response-data.dto';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../auth/dto/auth.dto';

@Controller({
  path: 'user',
})
export class UserController {
  constructor(
    @Inject(REQUEST)
    private req: Request,

    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @ApiTags('User')
  @ApiOperation({
    summary: 'Get my profile',
  })
  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard)
  @ResponseData(User)
  async getMyInfo(): Promise<ResponseDataDto<User>> {
    const { userEntity } = this.req;
    const user = await User.fromEntity(userEntity);
    return new ResponseDataDto(user);
  }
}
