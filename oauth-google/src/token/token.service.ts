import { Injectable, NotFoundException } from '@nestjs/common';
import { UserTokens } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTokenRequestDto } from './dto/create-token-request.dto';
import { CreateTokenUserDto } from './dto/create-token-user.dto';

@Injectable()
export class TokenService {
  constructor(private readonly PrismaService: PrismaService) {}

  async validate(
    createTokenDto: CreateTokenRequestDto,
  ): Promise<CreateTokenUserDto> {
    try {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

      const ticket = await client.verifyIdToken({
        idToken: createTokenDto.token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      return {
        name: payload.name,
        email: payload.email,
        idToken: createTokenDto.token,
        photo: payload.picture,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  async login(
    userInfo: CreateTokenUserDto,
  ): Promise<{ userTokens: UserTokens; exist: boolean }> {
    const existToken = await this.PrismaService.userTokens.findUnique({
      where: { email: userInfo.email },
    });

    if (existToken) {
      const updateToken = await this.PrismaService.userTokens.update({
        where: {
          email: userInfo.email,
        },
        data: {
          name: userInfo.name,
          idToken: userInfo.idToken,
          photo: userInfo.photo,
        },
      });
      return { userTokens: updateToken, exist: true };
    } else {
      const user = await this.PrismaService.userTokens.create({
        data: {
          name: userInfo.name,
          email: userInfo.email,
          idToken: userInfo.idToken,
          photo: userInfo.photo,
        },
      });
      return { userTokens: user, exist: false };
    }
  }

  async findAll(): Promise<UserTokens[]> {
    return await this.PrismaService.userTokens.findMany();
  }

  async findOne(email: string): Promise<UserTokens> {
    const user = await this.PrismaService.userTokens.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException(`${email} is not found.`);
    }

    return user;
  }

  async deleteUser(email: string): Promise<UserTokens> {
    const user = await this.PrismaService.userTokens.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException(`${email} is not found.`);
    }

    return await this.PrismaService.userTokens.delete({
      where: {
        email: email,
      },
    });
  }
}
