import { Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PrismaService } from '../prisma/prisma.service';
import { Post } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly PrismaService: PrismaService) {}

  async createPost(postData: CreatePostDto): Promise<Post> {
    const userId = postData.authorId;
    const user = await this.PrismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User ID ${userId} not found.`);
    }

    return await this.PrismaService.post.create({ data: postData });
  }

  async getAllPosts(): Promise<Post[]> {
    return await this.PrismaService.post.findMany();
  }

  async getPost(id: number): Promise<Post> {
    const post = await this.PrismaService.post.findUnique({
      where: { id: id },
    });

    if (!post) {
      throw new NotFoundException(`Post ID ${id} not found.`);
    }

    return post;
  }

  async updatePost(id: number, postData: UpdatePostDto): Promise<Post> {
    const postId = await this.PrismaService.post.findUnique({
      where: { id: id },
    });

    if (!postId) {
      throw new NotFoundException(`Post ID ${id} not found.`);
    }

    return await this.PrismaService.post.update({
      where: {
        id: id,
      },
      data: postData,
    });
  }

  async deletePost(id: number): Promise<Post> {
    const postId = await this.PrismaService.post.findUnique({
      where: { id: id },
    });

    if (!postId) {
      throw new NotFoundException(`Post ID ${id} not found.`);
    }

    return await this.PrismaService.post.delete({
      where: {
        id: id,
      },
    });
  }
}
