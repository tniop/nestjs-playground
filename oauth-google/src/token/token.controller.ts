import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { CreateTokenRequestDto } from './dto/create-token-request.dto';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserTokens } from '@prisma/client';
import { TimeoutInterceptor } from '../interceptor/timeout.interceptor';

@ApiTags('Token')
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  @UseInterceptors(TimeoutInterceptor)
  @ApiOperation({
    summary: '유저 생성 API',
    description: 'token으로 유저를 생성한다.',
  })
  @ApiCreatedResponse({ description: 'token으로 유저를 생성한다.' })
  async login(
    @Body() CreateTokenRequestDto: CreateTokenRequestDto,
  ): Promise<{ userTokens: UserTokens; exist: boolean }> {
    return await this.tokenService.login(
      await this.tokenService.validate(CreateTokenRequestDto),
    );
  }

  @Get()
  @ApiOperation({
    summary: '유저 조회 API',
    description: '유저 목록을 가져온다.',
  })
  @ApiCreatedResponse({ description: '유저 목록을 가져온다.' })
  async findAll(): Promise<UserTokens[]> {
    return await this.tokenService.findAll();
  }

  @Get()
  @ApiOperation({
    summary: '유저 조회 API',
    description: '유저를 가져온다.',
  })
  @ApiCreatedResponse({ description: '유저를 가져온다.' })
  async findOne(@Body() email: string): Promise<UserTokens> {
    return await this.tokenService.findOne(email);
  }

  @Delete()
  @ApiOperation({
    summary: '유저 삭제 API',
    description: '유저를 삭제한다.',
  })
  @ApiCreatedResponse({ description: '유저를 삭제한다.' })
  remove(@Body() email: string) {
    return this.tokenService.deleteUser(email);
  }
}
