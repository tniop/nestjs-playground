import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { TokenService } from './token.service';

const token: CreateTokenDto = {
  token: process.env.TEST_TOKEN,
};

const invalidToken: CreateTokenDto = {
  token: 'invalid_token',
};

describe('TokenService', () => {
  let service: TokenService;

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
      providers: [TokenService, PrismaService],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  afterAll(async () => {
    await prisma.userTokens.deleteMany({});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const result = await service.create(token);
      const users = await service.findOne(process.env.TEST_EMAIL);

      expect(result.userTokens.id).toEqual(users.id);
      expect(result.userTokens.email).toEqual(process.env.TEST_EMAIL);
      expect(result.userTokens.name).toEqual(process.env.TEST_NAME);
      expect(result.exist).toEqual(false);
    });

    it('should update if user email exists', async () => {
      await service.create(token);
      const result = await service.create(token);

      expect(result.exist).toEqual(true);
    });

    it('should fail if invalid id token', async () => {
      try {
        await service.create(invalidToken);
      } catch (e) {
        expect(e.message).toEqual(
          'Error: Wrong number of segments in token: invalid_token',
        );
      }
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await service.findAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      await service.create(token);
      const result = await service.findOne(process.env.TEST_EMAIL);

      expect(result.id).toBeDefined();
      expect(result.email).toEqual(process.env.TEST_EMAIL);
      expect(result.name).toEqual(process.env.TEST_NAME);
    });

    it('should throw a NotFoundException if user email not exist', async () => {
      try {
        await service.findOne('invalid@email.com');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('invalid@email.com is not found.');
      }
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      await service.create(token);
      const beforeDelete = (await service.findAll()).length;
      await service.deleteUser(process.env.TEST_EMAIL);
      const afterDelete = (await service.findAll()).length;

      expect(beforeDelete - afterDelete).toEqual(1);

      try {
        await service.findOne(process.env.TEST_EMAIL);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });

    it('should throw a NotFoundException if user email not exist', async () => {
      try {
        await service.deleteUser('invalid@email.com');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('invalid@email.com is not found.');
      }
    });
  });
});
