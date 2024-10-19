import { Controller, Get, HttpStatus, Inject, Query } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AssetService } from './asset.service';
import { GetAssetRequest, Asset } from './dto/asset.dto';
import { ResponseData } from '@app/common/decorators/response-data.decorator';
import { ResponseDataDto } from '@app/common/dto/response-data.dto';
import { ResponseException } from '@app/common/decorators/response-exception.decorator';
import {
  ServiceException,
  ServiceExceptionCode,
} from '@app/common/ServiceException';

@Controller({
  path: 'asset',
})
export class AsseetController {
  constructor(
    @Inject(REQUEST)
    private req: Request,

    @Inject(AssetService)
    private readonly assetService: AssetService,
  ) {}

  @ApiTags('Asset')
  @ApiOperation({
    summary: '에셋 조회',
  })
  // @ApiBearerAuth()
  @ApiHeader({ name: 'service-id', required: true })
  @ResponseData(Asset)
  // @ResponseException(HttpStatus.CONFLICT, ServiceExceptionCode.DuplicateRequest)
  @Get()
  async getAsset(
    @Query() dto: GetAssetRequest,
  ): Promise<ResponseDataDto<Asset>> {
    await this.assetService.getAsset();
    const result = await Asset.from({ id: 1 });
    return new ResponseDataDto(result);
  }
}
