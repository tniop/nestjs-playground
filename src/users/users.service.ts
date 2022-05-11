import { BadRequestException, Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly PrismaService: PrismaService) {}
  async create(userData: CreateUserDto): Promise<Users> {
    const existUser = await this.PrismaService.users.findUnique({
      where: { email: userData.email },
    });

    if (existUser) {
      throw new BadRequestException('already exist email.');
    }

    const user = await this.PrismaService.users.create({ data: userData });

    return user;
  }

  async findAll(): Promise<Users[]> {
    return await this.PrismaService.users.findMany();
  }

  async findOne(email: string): Promise<Users> {
    return await this.PrismaService.users.findUnique({
      where: { email: email },
    });
  }
}
