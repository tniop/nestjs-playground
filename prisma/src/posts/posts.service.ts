import { Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PrismaService } from '../prisma/prisma.service';
import { Posts } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly PrismaService: PrismaService) {}

  async createPost(postData: CreatePostDto): Promise<Posts> {
    const userId = postData.authorId;
    const user = await this.PrismaService.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User ID ${userId} not found.`);
    }

    return await this.PrismaService.posts.create({ data: postData });
  }

  async getAllPosts(): Promise<Posts[]> {
    return await this.PrismaService.posts.findMany();
  }

  async getPost(id: number): Promise<Posts> {
    const post = await this.PrismaService.posts.findUnique({
      where: { id: id },
    });

    if (!post) {
      throw new NotFoundException(`Post ID ${id} not found.`);
    }

    return post;
  }

  async updatePost(id: number, postData: UpdatePostDto): Promise<Posts> {
    const postId = await this.PrismaService.posts.findUnique({
      where: { id: id },
    });

    if (!postId) {
      throw new NotFoundException(`Post ID ${id} not found.`);
    }

    return await this.PrismaService.posts.update({
      where: {
        id: id,
      },
      data: postData,
    });
  }

  async deletePost(id: number): Promise<Posts> {
    const postId = await this.PrismaService.posts.findUnique({
      where: { id: id },
    });

    if (!postId) {
      throw new NotFoundException(`Post ID ${id} not found.`);
    }

    return await this.PrismaService.posts.delete({
      where: {
        id: id,
      },
    });
  }

  async getUserByPostId(postId: number): Promise<Posts> {
    const post = await this.PrismaService.posts.findUnique({
      where: { id: postId },
      include: {
        author: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post ID ${postId} not found.`);
    }

    return post;
  }

  async getUserNameByPostId(postId: number): Promise<Posts> {
    const post = await this.PrismaService.posts.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post ID ${postId} not found.`);
    }

    return post;
  }
}
