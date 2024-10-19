import { ClassValidator } from '@app/utils/ClassValidator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetAssetRequest {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  id!: number;
}

export class Asset {
  @ApiProperty()
  @Expose()
  id!: number;

  static async from(params: { id: number }) {
    const instance = plainToInstance(this, {
      ...params,
    });

    await ClassValidator.validate(instance);

    return instance;
  }
}
