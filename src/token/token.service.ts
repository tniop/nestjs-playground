import { BadRequestException, Injectable } from '@nestjs/common';
import { UserTokens } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';

@Injectable()
export class TokenService {
  constructor(private readonly PrismaService: PrismaService) {}

  async create(createTokenDto: CreateTokenDto): Promise<UserTokens> {
    console.log(createTokenDto);

    try {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

      const ticket = await client.verifyIdToken({
        idToken: createTokenDto.token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
      console.log(ticket);
      console.log(payload);
      console.log(userid);

      const existToken = await this.PrismaService.userTokens.findUnique({
        where: { email: payload.email },
      });

      if (existToken) {
        existToken.email = 'exist';
        return existToken;
      }

      const user = await this.PrismaService.userTokens.create({
        data: {
          name: payload.name,
          email: payload.email,
          subId: payload.sub,
          accessToken: payload.aud,
          photo: payload.picture,
        },
      });
      return user;
    } catch (e) {
      throw new Error(e);
    }
  }

  async findAll(): Promise<UserTokens[]> {
    return await this.PrismaService.userTokens.findMany();
  }
}
