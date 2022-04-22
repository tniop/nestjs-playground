import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { PostService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDtoSnakeToCamelCasePipe } from './pipe/CreatePostDtoSnakeToCamelCasePipe';
import { UpdatePostDtoSnakeToCamelCasePipe } from './pipe/UpdatePostDtoSnakeToCamelCasePipe';
import { toSnake } from 'snake-camel';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UsePipes(new CreatePostDtoSnakeToCamelCasePipe())
  async create(@Body() createPostDto: CreatePostDto): Promise<any> {
    return toSnake(await this.postService.createPost(createPostDto));
  }

  @Get()
  async findAll(): Promise<any> {
    return (await this.postService.getAllPosts()).map(toSnake);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any> {
    return toSnake(await this.postService.getPost(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body(UpdatePostDtoSnakeToCamelCasePipe) updatePostDto: UpdatePostDto,
  ): Promise<any> {
    return toSnake(await this.postService.updatePost(id, updatePostDto));
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<any> {
    return toSnake(await this.postService.deletePost(id));
  }

  @Get('user/:id')
  async getUserByPostId(@Param('id') postId: number): Promise<any> {
    return toSnake(await this.postService.getUserByPostId(postId));
  }

  @Get('user/name/:id')
  async getUserNameByPostId(@Param('id') postId: number): Promise<any> {
    return toSnake(this.postService.getUserNameByPostId(postId));
  }
}
