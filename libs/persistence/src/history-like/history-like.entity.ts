import { ClassValidator } from '@app/utils/ClassValidator';
import { plainToInstance } from 'class-transformer';
import { IsOptional } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { EpisodeEntity } from '../episode/episode.entity';

@Entity('history_like')
export class HistoryLikeEntity {
  @PrimaryGeneratedColumn('increment')
  @IsOptional()
  id?: number;

  @Column('int')
  episodeId!: number;

  @Column('int')
  userId!: number;

  @ManyToOne(() => EpisodeEntity, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  episode?: EpisodeEntity;

  @ManyToOne(() => UserEntity, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  user?: UserEntity;

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
