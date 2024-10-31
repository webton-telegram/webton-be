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
import { ToonEntity } from '../toon/toon.entity';

@Entity('episode')
export class EpisodeEntity {
  @PrimaryGeneratedColumn('increment')
  @IsOptional()
  id?: number;

  @Column('int')
  episodeNumber!: number;

  @Column('int')
  viewCount!: number;

  @Column('int')
  likeCount!: number;

  @Column('varchar')
  title!: string;

  @Column('varchar')
  thumbnailUrl!: string;

  @Column('varchar')
  contentPath!: string;

  @Column('int')
  toonId!: number;

  @ManyToOne(() => ToonEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  toon?: ToonEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  @IsOptional()
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @IsOptional()
  updatedAt?: Date;

  static async from(params: InstanceType<typeof EpisodeEntity>) {
    const instance = plainToInstance(this, {
      ...params,
    });

    await ClassValidator.validate(instance);

    return instance;
  }
}
