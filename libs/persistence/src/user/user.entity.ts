import { ClassValidator } from '@app/utils/ClassValidator';
import { plainToInstance } from 'class-transformer';
import { IsOptional } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToOne,
} from 'typeorm';
import { WalletEntity } from '../wallet/wallet.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  @IsOptional()
  id?: number;

  @Column('varchar')
  socialId!: string;

  @Column('varchar', { nullable: true })
  @IsOptional()
  firstName?: string;

  @Column('varchar', { nullable: true })
  @IsOptional()
  lastName?: string;

  @Column('varchar', { nullable: true })
  @IsOptional()
  userName?: string;

  @Column('varchar', { nullable: true })
  @IsOptional()
  languageCode?: string;

  @OneToOne(() => WalletEntity, (wallet) => wallet.user)
  wallet?: WalletEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  @IsOptional()
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @IsOptional()
  updatedAt?: Date;

  static async from(params: InstanceType<typeof UserEntity>) {
    const instance = plainToInstance(this, {
      ...params,
    });

    await ClassValidator.validate(instance);

    return instance;
  }
}
