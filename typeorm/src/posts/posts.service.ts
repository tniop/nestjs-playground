import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { title, content, published } = createPostDto;
    const post = this.postsRepository.create({
      title,
      content,
      published,
    });
    await this.postsRepository.save(post);
    return post;
  }

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find();
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne(id);

    if (!post) {
      throw new NotFoundException(`Post ID ${id} not found.`);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postsRepository.findOne(id);

    if (!post) {
      throw new NotFoundException(`Post ID ${id} not found.`);
    }

    const { title, content, published } = updatePostDto;
    post.title = title;
    post.content = content;
    post.published = published;

    return await this.postsRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const post = await this.postsRepository.findOne({
      where: { id: id },
    });

    if (!post) {
      throw new NotFoundException(`Post ID ${id} not found.`);
    }

    await this.postsRepository.delete(id);
  }

  async getPostByUserId(userId: number): Promise<Post[]> {
    const user = await this.postsRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User ID ${userId} not found.`);
    }

    return await this.postsRepository.find({
      where: {
        authorId: userId,
      },
    });
  }
}
