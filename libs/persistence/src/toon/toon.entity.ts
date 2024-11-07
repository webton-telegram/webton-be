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
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { EpisodeEntity } from '../episode/episode.entity';

@Entity('toon')
export class ToonEntity {
  @PrimaryGeneratedColumn('increment')
  @IsOptional()
  id?: number;

  @Column('int')
  viewCount!: number;

  @Column('int')
  likeCount!: number;

  @Column('varchar')
  title!: string;

  @Column('varchar')
  description!: string;

  @Column('varchar')
  thumbnailUrl!: string;

  @Column('int')
  userId!: number;

  @ManyToOne(() => UserEntity, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  author?: UserEntity;

  @OneToMany(() => EpisodeEntity, (episode) => episode.toon)
  episodes?: EpisodeEntity[];

  @CreateDateColumn({ type: 'timestamptz' })
  @IsOptional()
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @IsOptional()
  updatedAt?: Date;

  static async from(params: InstanceType<typeof ToonEntity>) {
    const instance = plainToInstance(this, {
      ...params,
    });

    await ClassValidator.validate(instance);

    return instance;
  }
}
