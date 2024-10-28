import { Body, Controller, Inject, Post } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse } from './dto/auth.dto';

import { ResponseData } from '@app/common/decorators/response-data.decorator';
import { ResponseDataDto } from '@app/common/dto/response-data.dto';

@Controller({
  path: 'auth',
})
export class AuthController {
  constructor(
    @Inject(REQUEST)
    private req: Request,

    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @ApiTags('Auth')
  @ApiOperation({
    summary: 'sign in',
  })
  @Post()
  @ResponseData(LoginResponse)
  async signIn(
    @Body() params: LoginRequest,
  ): Promise<ResponseDataDto<LoginResponse>> {
    const signInResponse = await this.authService.signIn(params);
    return new ResponseDataDto(signInResponse);
  }
}
