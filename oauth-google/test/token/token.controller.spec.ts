import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { CreateTokenUserDto } from 'src/token/dto/create-token-user.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { TokenController } from '../../src/token/token.controller';
import { TokenService } from '../../src/token/token.service';

const userInfo: CreateTokenUserDto = {
  email: 'controller_test@test.com',
  name: 'controller_test',
  idToken: 'controller_test_token',
  photo: 'controller_test_photo_url',
};

const validateSuccess = jest.fn().mockResolvedValue(userInfo);

describe('TokenController', () => {
  let controller: TokenController;

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  beforeEach(async () => {
    await prisma.userTokens.deleteMany({});

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenController],
      providers: [TokenService, PrismaService],
    }).compile();

    controller = module.get<TokenController>(TokenController);
  });

  afterAll(async () => {
    await prisma.userTokens.deleteMany({});
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should fail if invalid id token', async () => {
      try {
        await controller.login({ token: 'invalid_token' });
      } catch (e) {
        expect(e.message).toEqual(
          'Error: Wrong number of segments in token: invalid_token',
        );
      }
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('findOne', () => {
    it('should throw a NotFoundException if user email not exist', async () => {
      try {
        await controller.findOne('invalid@email.com');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('invalid@email.com is not found.');
      }
    });
  });

  describe('remove', () => {
    it('should throw a NotFoundException if user email not exist', async () => {
      try {
        await controller.remove('invalid@email.com');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('invalid@email.com is not found.');
      }
    });
  });
});
