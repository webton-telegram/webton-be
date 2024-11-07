import { IsEnum, IsOptional, IsString } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ClassValidator } from '@app/utils/ClassValidator';
import { TransactionStatus } from './transaction-log.enum';
export class GetTransactionLogByIdDto {
  @IsString()
  id!: string;

  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus;

  static async from(params: { id: string; status?: TransactionStatus }) {
    const instance = plainToInstance(this, {
      ...params,
    });

    await ClassValidator.validate(instance);

    return instance;
  }
}
