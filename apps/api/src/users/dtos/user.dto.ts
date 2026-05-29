import { Expose, plainToInstance } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserDto {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Expose()
  @IsString()
  @IsOptional()
  name?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  avatarUrl?: string | null;

  @Expose()
  @IsDate()
  createdAt!: Date;

  @Expose()
  @IsDate()
  updatedAt!: Date;

  static from(user: {
    id: number;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): UserDto {
    return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
  }
}
