import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from '@prisma/client';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '유저 생성 API', description: '유저를 생성한다.' })
  @ApiCreatedResponse({ description: '유저를 생성한다.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: '유저 조회 API', description: '유저 목록을 가져온다.' })
  @ApiCreatedResponse({ description: '유저 목록을 가져온다.' })
  async findAll(): Promise<Users[]> {
    return await this.usersService.findAll();
  }
}
