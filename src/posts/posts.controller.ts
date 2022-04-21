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

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UsePipes(new CreatePostDtoSnakeToCamelCasePipe())
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Get()
  findAll() {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postService.getPost(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body(UpdatePostDtoSnakeToCamelCasePipe) updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.postService.deletePost(id);
  }

  @Get('user/:id')
  getUserByPostId(@Param('id') postId: number) {
    return this.postService.getUserByPostId(postId);
  }

  @Get('user/name/:id')
  getUserNameByPostId(@Param('id') postId: number) {
    return this.postService.getUserNameByPostId(postId);
  }
}
