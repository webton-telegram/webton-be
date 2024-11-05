import { UserEntity } from '@app/persistence/user/user.entity';
import { ClassValidator } from '@app/utils/ClassValidator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string | undefined;
  username?: string | undefined;
  language_code?: string | undefined;
}

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
  languageCode?: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsOptional()
  walletAddress?: string;

  @ApiProperty()
  @Expose()
  @IsDate()
  createdAt!: Date;

  static async fromEntity(entity: UserEntity) {
    const instance = plainToInstance(
      this,
      {
        ...entity,
        walletAddress: entity.wallet?.address,
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
  @IsString()
  telegramInitData!: string;
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
