import { Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';

@Injectable()
export class UserService {
  constructor(private readonly PrismaService: PrismaService) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    return await this.PrismaService.user.create({ data: userData });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.PrismaService.user.findMany();
  }

  async getUser(id: number): Promise<User> {
    const user = await this.PrismaService.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException(`User ID ${id} not found.`);
    }

    return user;
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<User> {
    const user = await this.PrismaService.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException(`User ID ${id} not found.`);
    }

    return await this.PrismaService.user.update({
      where: {
        id: id,
      },
      data: userData,
    });
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.PrismaService.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException(`User ID ${id} not found.`);
    }

    return await this.PrismaService.user.delete({
      where: {
        id: id,
      },
    });
  }

  async getPostByUserId(userId: number): Promise<User> {
    const user = await this.PrismaService.user.findUnique({
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

  async getPostTitleByUserId(userId: number): Promise<User> {
    const user = await this.PrismaService.user.findUnique({
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

  async createUserAndPost(
    userData: CreateUserDto,
    postData: CreatePostDto,
  ): Promise<User> {
    const userAndPost = await this.PrismaService.user.create({
      data: {
        ...userData,
        posts: {
          create: [postData],
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
