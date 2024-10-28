import { ClassValidator } from '@app/utils/ClassValidator';
import { plainToInstance } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TelegramLoginData {
  @IsNumber()
  id!: number;

  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  photo_url?: string;

  @IsNumber()
  auth_date!: number;

  @IsString()
  hash!: string;

  static async from(params: InstanceType<typeof TelegramLoginData>) {
    const instance = plainToInstance(this, {
      ...params,
    });

    await ClassValidator.validate(instance);

    return instance;
  }
}
