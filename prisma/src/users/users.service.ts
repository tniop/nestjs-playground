import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PrismaService } from '../prisma/prisma.service';
import { Users } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreatePostUserDto } from 'src/posts/dto/create-post-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly PrismaService: PrismaService) {}

  async createUser(userData: CreateUserDto): Promise<Users> {
    const existUser = await this.PrismaService.users.findUnique({
      where: { email: userData.email },
    });

    if (existUser) {
      throw new BadRequestException('already exist email.');
    }

    return await this.PrismaService.users.create({ data: userData });
  }

  async getAllUsers(): Promise<Users[]> {
    return await this.PrismaService.users.findMany();
  }

  async getUser(id: number): Promise<Users> {
    const user = await this.PrismaService.users.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException(`User ID ${id} not found.`);
    }

    return user;
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<Users> {
    const user = await this.PrismaService.users.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException(`User ID ${id} not found.`);
    }

    return await this.PrismaService.users.update({
      where: {
        id: id,
      },
      data: userData,
    });
  }

  async deleteUser(id: number): Promise<Users> {
    const user = await this.PrismaService.users.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException(`User ID ${id} not found.`);
    }

    return await this.PrismaService.users.delete({
      where: {
        id: id,
      },
    });
  }

  async getPostByUserId(userId: number): Promise<Users> {
    const user = await this.PrismaService.users.findUnique({
      where: { id: userId },
      include: {
        posts: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User ID ${userId} not found.`);
    }

    return user;
  }

  async getPostTitleByUserId(userId: number): Promise<Users> {
    const user = await this.PrismaService.users.findUnique({
      where: { id: userId },
      include: {
        posts: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User ID ${userId} not found.`);
    }

    return user;
  }

  async createUserAndPosts(
    userData: CreateUserDto,
    postDatas: CreatePostUserDto[],
  ): Promise<Users> {
    const existUser = await this.PrismaService.users.findUnique({
      where: { email: userData.email },
    });

    if (existUser) {
      throw new BadRequestException('already exist email.');
    }

    const userAndPost = await this.PrismaService.users.create({
      data: {
        ...userData,
        posts: {
          create: [...postDatas],
        },
      },
      include: { posts: true },
    });
    // const { id: uId, email, name } = userData;
    // const { id: pId, title, content, published } = postData;
    // const userAndPost = await this.PrismaService.user.create({
    //   data: {
    //     id: uId,
    //     email,
    //     name,
    //     posts: {
    //       create: [{ id: pId, title, content, published }],
    //     },
    //   },
    //   include: { posts: true },
    // });
    return userAndPost;
  }
}
