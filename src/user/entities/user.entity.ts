import { IsEmail, IsNotEmpty, IsPhoneNumber, Validate } from 'class-validator';
import { Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import * as speakeasy from 'speakeasy';

const secret: speakeasy.GeneratedSecret = speakeasy.generateSecret();

export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @Validate(Unique)
  @Column({
    name: 'user',
    type: 'varchar',
    unique: true,
    length: 20,
  })
  user: string;

  @IsNotEmpty()
  @Validate(Unique)
  @IsEmail()
  @Column({
    name: 'email',
    type: 'varchar',
    unique: true,
    length: 100,
  })
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('BR')
  @Column({
    name: 'phone',
    type: 'varchar',
    length: 13,
  })
  phone: number;

  @Column({
    name: 'qrCode',
    type: 'varchar',
    length: 32,
  })
  qrCode: string = secret.otpauth_url;

  @Column({
    name: 'verified',
    type: 'boolean',
  })
  verified = false;

  @Column({
    name: 'logged',
    type: 'boolean',
  })
  logged = false;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  password: string;

  @Column({
    name: 'access_token',
    type: 'varchar',
    nullable: true,
  })
  accessToken: string | null = null;

  @Column({
    name: 'crypto_wallet',
    type: 'double precision',
    nullable: true,
  })
  cryptoBalance: number = null;

  @Column({
    name: 'fiat_wallet',
    type: 'double precision',
    nullable: true,
  })
  fiatBalance: number = null;
}
