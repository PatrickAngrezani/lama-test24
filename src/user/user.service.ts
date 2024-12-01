import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
  Request,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<UserEntity> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const user = this.repository.create(createUserDto);
      await this.repository.save(user);

      return user;
    } catch (error) {
      throw new BadRequestException('Failed to create user. Please try again.');
    }
  }

  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    id: string,
    @Response() res,
    @Request() req,
  ) {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }

    const tokenVerified = speakeasy.totp.verify({
      secret: req.body.secret,
      encoding: 'base32',
      token: req.body.token,
      window: 0,
    });

    if (!tokenVerified) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    this.verifyUpdatedFields(user, updateUserDto.email, updateUserDto?.phone);

    const emailUpdated = req.body.email;
    const phoneUpdated = req.body?.phone;
    const passwordUpdated = req.body.password;

    user.email = emailUpdated;
    user.phone = phoneUpdated || user.phone;
    user.password = bcrypt.hashSync(passwordUpdated, 8);

    await this.repository.save(user);

    return user;
  }

  async deleteAll() {
    return await this.repository.delete({});
  }

  async deleteOne(id: string) {
    return await this.repository.delete(id);
  }

  verifyUpdatedFields(user: UserEntity, email: string, phone?: string) {
    if (email === user.email) {
      throw new Error('Email must be different to update the user.');
    }

    if (phone && phone === user.phone) {
      throw new Error('Phone must be different to update the user');
    }

    if (email && phone && (email === user.email || phone === user.phone)) {
      throw new Error(
        'Both email and phone must be different to update the user',
      );
    }

    return true;
  }
}
