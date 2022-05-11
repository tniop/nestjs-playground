import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ForbiddenException } from '../filter/forbidden.exception';
import { HttpExceptionFilter } from '../filter/http-exception.filter';
import { LoggingInterceptor } from '../interceptor/logging.interceptor';

// @UseInterceptors(LoggingInterceptor)
@ApiTags('User')
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
  @ApiBearerAuth('token')
  @UseInterceptors(LoggingInterceptor)
  @ApiOperation({
    summary: '유저 조회 API',
    description: '유저 목록을 가져온다.',
  })
  @ApiCreatedResponse({ description: '유저 목록을 가져온다.' })
  async findAll(): Promise<Users[]> {
    return await this.usersService.findAll();
  }

  @Get('test') // filter test api
  // @UseFilters(new HttpExceptionFilter())
  async testExceptionFilter() {
    // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    // throw new HttpException(
    //   {
    //     status: HttpStatus.FORBIDDEN,
    //     error: 'This is a custom message',
    //   },
    //   403,
    // );
    throw new ForbiddenException();
  }
}
