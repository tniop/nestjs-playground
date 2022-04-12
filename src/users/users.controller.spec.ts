import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserController } from './users.controller';
import { UserService } from './users.service';

describe('UsersController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, PrismaService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const requestDto: CreateUserDto = {
      email: 'controllerTest1@test.com', // db 확인
      name: 'controllerTest',
    };

    it('should create a user', async () => {
      const beforeCreate = (await controller.findAll()).length;
      await controller.create(requestDto);
      const afterCreate = (await controller.findAll()).length;
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = await controller.findOne(1);
      expect(user).toBeDefined();
      expect(user.id).toEqual(1);
    });

    it('should throw a NotFoundException', async () => {
      try {
        await controller.findOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User ID 999 not found.');
      }
    });
  });

  describe('update', () => {
    const requestDto: UpdateUserDto = {
      email: 'controllerUpdateTest@test.com',
      name: 'controllerUpdateTest',
    };

    it('should update a user', async () => {
      await controller.update(2, requestDto);
      const user = controller.findOne(2);
      expect((await user).email).toEqual('controllerUpdateTest@test.com');
    });

    it('should throw a NotFoundException', async () => {
      try {
        await controller.update(999, requestDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User ID 999 not found.');
      }
    });
  });

  describe('remove', () => {
    it('delete a user ', async () => {
      const beforeDelete = (await controller.findAll()).length;
      await controller.remove(15); // db 확인
      const afterDelete = (await controller.findAll()).length;
      expect(afterDelete).toBeLessThan(beforeDelete);
    });

    it('should throw a NotFoundException', async () => {
      try {
        await controller.remove(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User ID 999 not found.');
      }
    });
  });
});
