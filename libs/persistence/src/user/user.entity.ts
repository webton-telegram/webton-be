import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column('varchar', { length: 200, nullable: true })
  email?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt?: Date;

  static async from(params: { id?: number; email?: string }) {
    const instance = plainToInstance(this, {
      ...params,
    });

    const validated = await validate(instance);
    if (validated.length > 0) {
      const messages = validated
        .map((e) => Object.entries(e.constraints)[0][1])
        .toString();
      throw new Error(messages);
    }

    return instance;
  }
}
