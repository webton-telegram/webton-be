import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionStatus } from './transaction-log.enum';
import { ClassValidator } from '@app/utils/ClassValidator';
import { plainToInstance } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@Entity('transaction_log')
export class TransactionLogEntity {
  @PrimaryGeneratedColumn('increment')
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @Column('varchar')
  toWalletAddress!: string;

  @IsString()
  @Column('varchar')
  amount!: string;

  @IsString()
  @IsOptional()
  @Column('varchar', { nullable: true })
  transactionHash?: string;

  @IsEnum(TransactionStatus)
  @IsOptional()
  @Column('enum', {
    enum: TransactionStatus,
    default: TransactionStatus.Pending,
  })
  status!: TransactionStatus;

  @IsDate()
  @IsOptional()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt?: Date;

  static async from(params: {
    id?: string;
    toWalletAddress: string;
    amount: string;
    transactionHash?: string;
    status?: TransactionStatus;
  }) {
    const instance = plainToInstance(this, {
      ...params,
    });

    ClassValidator.validate(instance);

    return instance;
  }

  setTransactionHash(transactionHash: string) {
    this.transactionHash = transactionHash;
  }

  setStatus(status: TransactionStatus) {
    this.status = status;
  }
}
