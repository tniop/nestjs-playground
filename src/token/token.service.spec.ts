import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  beforeAll(async () => {
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
      const token: CreateTokenDto = {
        token: process.env.TEST_TOKEN,
      };

      const beforeCreate = (await service.findAll()).length;
      const result = await service.create(token);
      const afterCreate = (await service.findAll()).length;
      const users = await service.findAll();

      expect(result.userTokens.name).toEqual(process.env.TEST_NAME);
      expect(result.userTokens.email).toEqual(process.env.TEST_EMAIL);
      expect(result.exist).toEqual(false);
      expect(afterCreate - beforeCreate).toEqual(1);
    });

    it('should update if user email exists', async () => {
      const token: CreateTokenDto = {
        token: process.env.TEST_TOKEN,
      };

      const beforeCreate = (await service.findAll()).length;
      const result = await service.create(token);
      const afterCreate = (await service.findAll()).length;

      expect(result.exist).toEqual(true);
      expect(beforeCreate).toEqual(afterCreate);
    });

    it('should fail if invalid id token', async () => {
      const invalidToken: CreateTokenDto = {
        token: 'invalid_token',
      };

      const beforeCreate = (await service.findAll()).length;

      try {
        await service.create(invalidToken);
      } catch (e) {
        expect(e.message).toEqual(
          'Error: Wrong number of segments in token: invalid_token',
        );
        const afterCreate = (await service.findAll()).length;
        expect(beforeCreate).toEqual(afterCreate);
      }
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const result = await service.findAll();
      expect(result).toBeInstanceOf(Array);
    });
  });
});
