import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EpisodeEntity } from './episode.entity';
import {
  ServiceException,
  ServiceExceptionCode,
} from '@app/common/ServiceException';
import { Sort } from 'apps/api-gateway/src/toon/dto/toon.dto';

@Injectable()
export class EpisodeRepositoryService {
  constructor(
    @InjectRepository(EpisodeEntity)
    private episodeRepository: Repository<EpisodeEntity>,
  ) {}

  async getEpisodeById(id: number): Promise<EpisodeEntity> {
    const episode = await this.findEpisodeById(id);

    if (!episode) {
      throw new ServiceException(ServiceExceptionCode.ContentNotFound);
    }

    return episode;
  }

  async findEpisodeById(id: number): Promise<EpisodeEntity | null> {
    const episode = await this.episodeRepository
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.toon', 't')
      .leftJoinAndSelect('t.author', 'a')
      .where('e.id = :id', { id })
      .getOne();

    return episode;
  }

  async findEpisodeByToonIdAndEpisodeNumber(
    toonId: number,
    episodeNumber: number,
  ): Promise<EpisodeEntity | null> {
    const episode = await this.episodeRepository
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.toon', 't')
      .leftJoinAndSelect('t.author', 'a')
      .where('e.toonId = :toonId', { toonId })
      .andWhere('e.episodeNumber = :episodeNumber', { episodeNumber })
      .getOne();

    return episode;
  }

  async getEpisodesByToonId(params: {
    page: number;
    limit: number;
    sort: Sort;
    toonId: number;
  }): Promise<[EpisodeEntity[], number]> {
    const query = this.episodeRepository
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.toon', 't')
      .leftJoinAndSelect('t.author', 'a')
      .where('e.toonId = :toonId', { toonId: params.toonId })
      .orderBy('e.episodeNumber', params.sort === Sort.ASC ? 'ASC' : 'DESC')
      .skip(params.page * params.limit)
      .take(params.limit);

    return await query.getManyAndCount();
  }
}
