import { UserEntity } from '@app/persistence/user/user.entity';
import { ClassValidator } from '@app/utils/ClassValidator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class User {
  @ApiProperty()
  @Expose()
  @IsNumber()
  id!: number;

  @ApiProperty()
  @Expose()
  @Type(() => Number)
  @IsNumber()
  socialId!: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsOptional()
  photoUrl?: string;

  @ApiProperty()
  @Expose()
  @IsDate()
  createdAt!: Date;

  static async fromEntity(entity: UserEntity) {
    const instance = plainToInstance(
      this,
      {
        ...entity,
      },
      {
        excludeExtraneousValues: true,
      },
    );

    await ClassValidator.validate(instance);

    return instance;
  }
}

export class LoginRequest {
  @ApiProperty()
  @IsNumber()
  id!: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  photo_url?: string;

  @ApiProperty()
  @IsNumber()
  auth_date!: number;

  @ApiProperty()
  @IsString()
  hash!: string;
}

export class LoginResponse {
  @ApiProperty({ description: 'expires in 1d', nullable: true })
  accessToken!: string | null;

  @ApiProperty({ description: 'expires in 30d', nullable: true })
  refreshToken!: string | null;

  @ApiProperty()
  user!: User;
}

export class JWT {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;
}
