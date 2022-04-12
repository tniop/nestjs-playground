import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './users.service';

describe('UsersService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    const requestDto: CreateUserDto = {
      email: 'serviceTest1@test.com', // db 확인
      name: 'serviceTest',
    };

    it('should create a user', async () => {
      const beforeCreate = (await service.getAllUsers()).length;
      await service.createUser(requestDto);
      const afterCreate = (await service.getAllUsers()).length;
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const result = await service.getAllUsers();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getUser', () => {
    it('should return a user', async () => {
      const user = await service.getUser(1);
      expect(user).toBeDefined();
      expect(user.id).toEqual(1);
    });

    it('should throw a NotFoundException', async () => {
      try {
        await service.getUser(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User ID 999 not found.');
      }
    });
  });

  describe('updateUser', () => {
    const requestDto: UpdateUserDto = {
      email: 'serviceUpdateTest@test.com',
      name: 'serviceUpdateTest',
    };

    it('should update a user', async () => {
      await service.updateUser(2, requestDto);
      const user = service.getUser(2);
      expect((await user).email).toEqual('serviceUpdateTest@test.com');
    });

    it('should throw a NotFoundException', async () => {
      try {
        await service.updateUser(999, requestDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User ID 999 not found.');
      }
    });
  });

  describe('deleteUser', () => {
    it('delete a user ', async () => {
      const beforeDelete = (await service.getAllUsers()).length;
      await service.deleteUser(16); // db 확인
      const afterDelete = (await service.getAllUsers()).length;
      expect(afterDelete).toBeLessThan(beforeDelete);
    });

    it('should throw a NotFoundException', async () => {
      try {
        await service.deleteUser(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User ID 999 not found.');
      }
    });
  });
});
