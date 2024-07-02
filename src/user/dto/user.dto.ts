import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsEnum,
  IsBoolean,
  MinLength,
} from 'class-validator';
import { Gender, UserRoles } from '../constants/users.constant';
import { PartialType } from '@nestjs/mapped-types';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  hashedPassword: string;

  @IsEnum(UserRoles)
  role: UserRoles;

  @IsString()
  profilePic: string;

  @IsBoolean()
  isDeleted: boolean = false;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
