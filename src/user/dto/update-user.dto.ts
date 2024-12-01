import { IsEmail, IsNotEmpty, IsPhoneNumber, Validate } from 'class-validator';
import { Unique } from 'typeorm';

export class UpdateUserDto {
  @IsNotEmpty()
  secret: string;

  @IsNotEmpty()
  token: string;

  @IsEmail()
  @IsNotEmpty()
  @Validate(Unique)
  email: string;

  @IsPhoneNumber('BR')
  @Validate(Unique)
  phone: string;

  @IsNotEmpty()
  password: string;
}
