import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { toSnake } from 'snake-camel';
import { PostShowDto } from './dto/show.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto): Promise<PostShowDto> {
    return toSnake(
      await this.postService.createPost(createPostDto),
    ) as PostShowDto;
  }

  @Get()
  async findAll(): Promise<PostShowDto[]> {
    return (await this.postService.getAllPosts()).map(toSnake) as PostShowDto[];
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PostShowDto> {
    return toSnake(await this.postService.getPost(id)) as PostShowDto;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostShowDto> {
    return toSnake(
      await this.postService.updatePost(id, updatePostDto),
    ) as PostShowDto;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<PostShowDto> {
    return toSnake(await this.postService.deletePost(id)) as PostShowDto;
  }

  @Get('user/:id')
  async getUserByPostId(@Param('id') postId: number): Promise<PostShowDto> {
    return toSnake(
      await this.postService.getUserByPostId(postId),
    ) as PostShowDto;
  }

  @Get('user/name/:id')
  async getUserNameByPostId(@Param('id') postId: number): Promise<PostShowDto> {
    return toSnake(this.postService.getUserNameByPostId(postId)) as PostShowDto;
  }
}
