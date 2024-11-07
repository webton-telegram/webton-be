import { Controller, Get, Query, Inject, UseGuards } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ToonService } from './toon.service';
import { ResponseData } from '@app/common/decorators/response-data.decorator';
import { ResponseList } from '@app/common/decorators/response-list.decorators';
import {
  Episode,
  EpisodeListRequestDto,
  Toon,
  ToonDetailRequestDto,
  ToonLink,
  ToonLinkRequestDto,
  ToonListRequestDto,
} from './dto/toon.dto';
import { ResponseListDto } from '@app/common/dto/response-list.dto';
import { ResponseDataDto } from '@app/common/dto/response-data.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller({
  path: 'toon',
})
export class ToonController {
  constructor(
    @Inject(REQUEST)
    private readonly req: Request,

    private readonly toonService: ToonService,
  ) {}

  @ApiTags('Toon')
  @ApiOperation({
    summary: 'Get Webtoon List',
  })
  @ResponseList(Toon)
  @Get('list')
  async getToons(
    @Query() dto: ToonListRequestDto,
  ): Promise<ResponseListDto<Toon>> {
    const [toons, total] = await this.toonService.getToons(dto);

    return new ResponseListDto(toons, total);
  }

  @ApiTags('Toon')
  @ApiOperation({
    summary: 'Get Webtoon Detail',
  })
  @ResponseData(Toon)
  @Get('')
  async getToon(
    @Query() dto: ToonDetailRequestDto,
  ): Promise<ResponseDataDto<Toon>> {
    const toon = await this.toonService.getToon(dto.id);

    return new ResponseDataDto(toon);
  }

  @ApiTags('Toon')
  @ApiOperation({
    summary: 'Get Episode List',
  })
  @ResponseList(Episode)
  @Get('episode/list')
  async getEpisodes(
    @Query() dto: EpisodeListRequestDto,
  ): Promise<ResponseListDto<Episode>> {
    const [episodes, total] = await this.toonService.getEpisodesByToonId(dto);

    return new ResponseListDto(episodes, total);
  }

  @ApiTags('Toon')
  @ApiOperation({
    summary: 'Get Episode Image Links',
  })
  @ResponseData(ToonLink)
  @UseGuards(AuthGuard)
  @Get('episode')
  async getEpisodeLink(
    @Query() dto: ToonLinkRequestDto,
  ): Promise<ResponseDataDto<ToonLink>> {
    const { userEntity } = this.req;

    const result = await this.toonService.getToonLink(
      dto.episodeId,
      userEntity,
    );

    return new ResponseDataDto(result);
  }
}
