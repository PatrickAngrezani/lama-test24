import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Validate,
} from 'class-validator';
import { Unique } from 'typeorm';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Validate(Unique)
  user: string;

  @IsEmail()
  @IsNotEmpty()
  @Validate(Unique)
  email: string;

  @IsPhoneNumber('BR')
  @IsNotEmpty()
  @Validate(Unique)
  phone: string;
}
