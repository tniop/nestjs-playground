import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateTokenUserDto } from '../../src/token/dto/create-token-user.dto';
import { TokenService } from '../../src/token/token.service';

const userInfo: CreateTokenUserDto = {
  email: 'service_test@test.com',
  name: 'service_test',
  idToken: 'service_test_token',
  photo: 'service_test_photo_url',
};

const validateSuccess = jest.fn().mockResolvedValue(userInfo);

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

  describe('login', () => {
    it('should create a user if user email not exist', async () => {
      const result = await service.login(await validateSuccess());
      const users = await service.findOne(userInfo.email);

      expect(result.userTokens.id).toEqual(users.id);
      expect(result.userTokens.name).toEqual(userInfo.name);
      expect(result.userTokens.email).toEqual(userInfo.email);
      expect(result.exist).toEqual(false);
    });

    it('should update if user email exists', async () => {
      const existUserInfo: CreateTokenUserDto = {
        email: 'service_test@test.com',
        name: 'update_service_test',
        idToken: 'update_service_test_token',
        photo: 'update_service_test_photo_url',
      };
      await service.login(await validateSuccess());
      const result = await service.login(existUserInfo);

      expect(result.exist).toEqual(true);
    });

    it('should fail if invalid id token', async () => {
      try {
        await service.validate({ token: 'invalid_token' });
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
      await service.login(await validateSuccess());
      const result = await service.findOne(userInfo.email);

      expect(result.id).toBeDefined();
      expect(result.email).toEqual(userInfo.email);
      expect(result.name).toEqual(userInfo.name);
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
      await service.login(await validateSuccess());
      const beforeDelete = (await service.findAll()).length;
      await service.deleteUser(userInfo.email);
      const afterDelete = (await service.findAll()).length;

      expect(beforeDelete - afterDelete).toEqual(1);

      try {
        await service.findOne(userInfo.email);
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
