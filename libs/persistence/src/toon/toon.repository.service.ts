import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { ServiceError } from 'src/types/exception';
// import { ExceptionCode, ExceptionMessage } from 'src/constant/exception';
import {
  ServiceException,
  ServiceExceptionCode,
} from '@app/common/ServiceException';
import { ToonEntity } from './toon.entity';
import { OrderBy, Sort } from 'apps/api-gateway/src/toon/dto/toon.dto';

@Injectable()
export class ToonRepositoryService {
  constructor(
    @InjectRepository(ToonEntity)
    private toonRepository: Repository<ToonEntity>,
  ) {}

  async getToonById(id: number): Promise<ToonEntity> {
    const toon = await this.findToonById(id);

    if (!toon) {
      throw new ServiceException(ServiceExceptionCode.ContentNotFound);
    }

    return toon;
  }

  async findToonById(id: number): Promise<ToonEntity | null> {
    const toon = await this.toonRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.author', 'a')
      .where('t.id = :id', { id })
      .getOne();

    return toon;
  }

  async getToons(params: {
    page: number;
    limit: number;
    searchText?: string;
    orderBy: OrderBy;
    sort: Sort;
  }): Promise<[ToonEntity[], number]> {
    const query = this.toonRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.author', 'a');

    if (params.searchText) {
      query.andWhere('t.title ILIKE :searchText', {
        searchText: `%${params.searchText}%`,
      });
    }

    let orderBy;

    if (params.orderBy === OrderBy.Latest) {
      orderBy = 't.createdAt';
    } else if (params.orderBy === OrderBy.Popular) {
      orderBy = 't.viewCount';
    }

    query.orderBy(orderBy!, params.sort === Sort.ASC ? 'ASC' : 'DESC');
    query.skip(params.page * params.limit).take(params.limit);

    return await query.getManyAndCount();
  }
}
