import { ToonRepositoryService } from '@app/persistence/toon/toon.repository.service';
import { Injectable } from '@nestjs/common';
import AWS from 'aws-sdk';
import {
  Episode,
  EpisodeListRequestDto,
  Toon,
  ToonLink,
  ToonListRequestDto,
} from './dto/toon.dto';
import { EpisodeRepositoryService } from '@app/persistence/episode/episode.repository.service';
import { ConfigService } from '@app/common/config/config.service';
import { UserEntity } from '@app/persistence/user/user.entity';
import { UserRepositoryService } from '@app/persistence/user/user.repository.service';

@Injectable()
export class ToonService {
  constructor(
    private readonly toonRepositoryService: ToonRepositoryService,
    private readonly episodeRepositoryService: EpisodeRepositoryService,
    private readonly userRepositoryService: UserRepositoryService,
  ) {}

  async getToons(dto: ToonListRequestDto): Promise<[Toon[], number]> {
    const [toonEntities, total] =
      await this.toonRepositoryService.getToons(dto);

    const toons = await Promise.all(
      toonEntities.map((e) => Toon.fromEntity(e)),
    );

    return [toons, total];
  }

  async getToon(id: number): Promise<Toon> {
    const toonEntity = await this.toonRepositoryService.getToonById(id);

    const toon = await Toon.fromEntity(toonEntity);

    return toon;
  }

  async getEpisodesByToonId(
    dto: EpisodeListRequestDto,
  ): Promise<[Episode[], number]> {
    const [episodeEntities, total] =
      await this.episodeRepositoryService.getEpisodesByToonId(dto);

    const episodes = await Promise.all(
      episodeEntities.map((e) => Episode.fromEntity(e)),
    );

    return [episodes, total];
  }

  async getToonLink(id: number, userEntity: UserEntity): Promise<ToonLink> {
    const episodeEntity =
      await this.episodeRepositoryService.getEpisodeById(id);

    const { bucket, ...awsConfig } = ConfigService.getConfig().AWS_S3;

    const s3 = new AWS.S3(awsConfig);

    const url = s3.getSignedUrl('getObject', {
      Bucket: bucket,
      Key: episodeEntity.contentPath,
      Expires: 3600, // 1h
    });

    //TODO increase view count

    userEntity.updatePoint(1);
    await this.userRepositoryService.saveUser(userEntity);

    const toonLink = await ToonLink.from({ url });

    return toonLink;
  }
}
