import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { UserTokens } from '@prisma/client';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  @ApiOperation({
    summary: '유저 생성 API',
    description: 'token으로 유저를 생성한다.',
  })
  @ApiCreatedResponse({ description: 'token으로 유저를 생성한다.' })
  async create(
    @Body() createTokenDto: CreateTokenDto,
  ): Promise<{ userTokens: UserTokens; exist: boolean }> {
    return await this.tokenService.create(createTokenDto);
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
}
