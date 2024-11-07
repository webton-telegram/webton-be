import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionLogEntity } from './transaction-log.entity';
import {
  ServiceException,
  ServiceExceptionCode,
} from '@app/common/ServiceException';
import { GetTransactionLogByIdDto } from './transaction-log.repository.dto';

@Injectable()
export class TransactionLogRepositoryService {
  constructor(
    @InjectRepository(TransactionLogEntity)
    private transactionLogRepository: Repository<TransactionLogEntity>,
  ) {}

  async getTransactionLog(
    dto: GetTransactionLogByIdDto,
  ): Promise<TransactionLogEntity> {
    const entity = await this.findTransactionLog(dto);

    if (!entity) {
      throw new ServiceException(
        ServiceExceptionCode.ContentNotFound,
        HttpStatus.NOT_FOUND,
      );
    }

    return entity;
  }

  async findTransactionLog(
    dto: GetTransactionLogByIdDto,
  ): Promise<TransactionLogEntity | null> {
    let queryBuilder = this.transactionLogRepository
      .createQueryBuilder('tl')
      .where('tl.id = :id', { id: dto.id });

    if (dto.status) {
      queryBuilder = queryBuilder.andWhere('tl.status = :status', {
        status: dto.status,
      });
    }

    const entity = await queryBuilder.getOne();

    return entity;
  }

  async saveTransactionLogs(
    entities: TransactionLogEntity[],
  ): Promise<TransactionLogEntity[]> {
    const savedEntities = await this.transactionLogRepository.save(entities);
    return savedEntities;
  }
}
