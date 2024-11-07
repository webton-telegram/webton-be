import { Expose, plainToInstance, Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsDate,
  IsOptional,
  IsEnum,
  IsInstance,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ToonEntity } from '@app/persistence/toon/toon.entity';
import { User } from '../../auth/dto/auth.dto';
import { ClassValidator } from '@app/utils/ClassValidator';
import { EpisodeEntity } from '@app/persistence/episode/episode.entity';

export enum OrderBy {
  Latest = 'latest',
  Popular = 'popular',
}

export enum Sort {
  DESC = 'DESC',
  ASC = 'ASC',
}

export class ToonDetailRequestDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: 'Toon Id' })
  id!: number;
}

export class ToonLinkRequestDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: 'Episode Id' })
  episodeId!: number;
}

export class ToonListRequestDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    required: true,
    type: Number,
    description: 'Page number (starts from 0)',
  })
  page!: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    required: true,
    type: Number,
    description: 'Number of items per page',
  })
  limit!: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'Search text (Webtoon name)',
  })
  searchText?: string;

  @IsEnum(OrderBy)
  @ApiProperty({
    required: true,
    enum: OrderBy,
    description: 'Order by criteria',
  })
  orderBy!: OrderBy;

  @IsEnum(Sort)
  @ApiProperty({
    required: true,
    enum: Sort,
    description: 'Sort order (ASC or DESC)',
  })
  sort!: Sort;
}

export class EpisodeListRequestDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    required: true,
    type: Number,
    description: 'Page number (starts from 0)',
  })
  page!: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    required: true,
    type: Number,
    description: 'Number of items per page',
  })
  limit!: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    required: true,
    type: Number,
    description: 'Toon Id',
  })
  toonId!: number;
}

export class Episode {
  @IsNumber()
  @Expose()
  @ApiProperty()
  id!: number;

  @IsNumber()
  @Expose()
  @ApiProperty()
  episodeNumber!: number;

  @IsNumber()
  @Expose()
  @ApiProperty()
  viewCount!: number;

  @IsNumber()
  @Expose()
  @ApiProperty()
  likeCount!: number;

  @IsString()
  @Expose()
  @ApiProperty()
  title!: string;

  @IsString()
  @Expose()
  @ApiProperty()
  thumbnailUrl!: string;

  @IsDate()
  @Expose()
  @ApiProperty()
  createdAt!: Date;

  static async fromEntity(params: EpisodeEntity) {
    const instance = plainToInstance(
      this,
      {
        ...params,
      },
      { excludeExtraneousValues: true },
    );

    await ClassValidator.validate(instance);

    return instance;
  }
}

export class Toon {
  @IsNumber()
  @Expose()
  @ApiProperty()
  id!: number;

  @IsNumber()
  @Expose()
  @ApiProperty()
  viewCount!: number;

  @IsNumber()
  @Expose()
  @ApiProperty()
  likeCount!: number;

  @IsString()
  @Expose()
  @ApiProperty()
  title!: string;

  @IsString()
  @Expose()
  @ApiProperty()
  description!: string;

  @IsString()
  @Expose()
  @ApiProperty()
  thumbnailUrl!: string;

  @IsDate()
  @Expose()
  @ApiProperty()
  createdAt!: Date;

  @IsInstance(User)
  @Expose()
  @ApiProperty()
  author!: User;

  static async fromEntity(entity: ToonEntity) {
    const instance = plainToInstance(
      this,
      {
        ...entity,
        author: await User.fromEntity(entity.author!),
      },
      { excludeExtraneousValues: true },
    );

    await ClassValidator.validate(instance);

    return instance;
  }
}

export class ToonLink {
  @IsString()
  @Expose()
  @ApiProperty()
  url!: number;

  static async from(params: { url: string }) {
    const instance = plainToInstance(
      this,
      {
        ...params,
      },
      { excludeExtraneousValues: true },
    );

    await ClassValidator.validate(instance);

    return instance;
  }
}
