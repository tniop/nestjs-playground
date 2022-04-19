import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.getUser(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }

  @Get('posts/:id')
  getPostByUserId(@Param('id') userId: number) {
    return this.userService.getPostByUserId(userId);
  }

  @Get('posts/title/:id')
  getPostTitleByUserId(@Param('id') userId: number) {
    return this.userService.getPostTitleByUserId(userId);
  }

  @Post('posts')
  createUserAndPosts(
    @Body() data: [userData: CreateUserDto, postDatas: CreatePostDto[]],
  ) {
    const [userData, postDatas] = data;
    return this.userService.createUserAndPosts(userData, postDatas);
  }
}
