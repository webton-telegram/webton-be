import { IsNumber } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ClassValidator } from '@app/utils/ClassValidator';
export class GetUserByIdDto {
  @IsNumber()
  id!: number;

  static async from(params: { id: number }) {
    const instance = plainToInstance(this, {
      ...params,
    });

    await ClassValidator.validate(instance);

    return instance;
  }
}
