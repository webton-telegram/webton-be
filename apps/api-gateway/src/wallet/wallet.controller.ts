import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { ResponseData } from '@app/common/decorators/response-data.decorator';
import { ResponseDataDto } from '@app/common/dto/response-data.dto';
import { AuthGuard } from '../auth/auth.guard';
import {
  CheckProofRequestDto,
  Payload,
  WithdrawRequestDto,
  WithdrawResult,
} from './dto/wallet.dto';
import { TonService } from '../ton/ton.service';

@Controller({
  path: 'wallet',
})
export class WalletController {
  constructor(
    @Inject(REQUEST)
    private req: Request,

    @Inject(WalletService)
    private readonly walletService: WalletService,

    @Inject(TonService)
    private readonly tonService: TonService,
  ) {}

  @ApiTags('Wallet')
  @ApiOperation({
    summary: 'Generate payload',
  })
  @ApiBearerAuth()
  @Get()
  @ResponseData(Payload)
  async generatePayload(): Promise<ResponseDataDto<Payload>> {
    const payload = await this.walletService.generatePayload();
    return new ResponseDataDto(payload);
  }

  @ApiTags('Wallet')
  @ApiOperation({
    summary: 'Connect Wallet',
  })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  @ResponseData(Boolean)
  async connectWallet(
    @Body() params: CheckProofRequestDto,
  ): Promise<ResponseDataDto<boolean>> {
    const { userEntity } = this.req;
    const isVerified = await this.walletService.connectWallet(
      userEntity,
      params,
    );
    return new ResponseDataDto(isVerified);
  }

  @ApiTags('Wallet')
  @ApiOperation({
    summary: 'Withdraw Point',
  })
  @ApiBearerAuth()
  @Post('withdraw')
  @UseGuards(AuthGuard)
  @ResponseData(WithdrawResult)
  async withdraw(
    @Body() params: WithdrawRequestDto,
  ): Promise<ResponseDataDto<WithdrawResult>> {
    const { userEntity } = this.req;
    const result = await this.walletService.withdraw(userEntity, params.amount);
    return new ResponseDataDto(result);
  }
}
