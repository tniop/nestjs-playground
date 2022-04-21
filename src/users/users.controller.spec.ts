import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserController } from './users.controller';
import { UserService } from './users.service';

describe('UsersController', () => {
  let controller: UserController;

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  beforeAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.post.deleteMany({});

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, PrismaService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.post.deleteMany({});
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('create', () => {
  //   it('should create a user', async () => {
  //     const requestDto: CreateUserDto = {
  //       email: 'userControllerTest1@test.com',
  //       name: 'userControllerTest',
  //     };

  //     expect((await controller.findAll()).length).toEqual(0);
  //     const result = await controller.create(requestDto);
  //     expect(result).toEqual(requestDto);
  //     expect((await controller.findAll()).length).toEqual(1);
  //   });

  //   it('should fail if user email exists', async () => {
  //     const failRequestDto: CreateUserDto = {
  //       email: 'userControllerTest1@test.com',
  //       name: 'userControllerTest',
  //     };

  //     expect((await controller.findAll()).length).toEqual(1);
  //     try {
  //       await controller.create(failRequestDto);
  //     } catch (e) {
  //       expect((await controller.findAll()).length).toEqual(1);
  //     }
  //   });
  // });

  // describe('findAll', () => {
  //   it('should return an array of users', async () => {
  //     const result = await controller.findAll();
  //     expect(result).toBeInstanceOf(Array);
  //   });
  // });

  // describe('findOne', () => {
  //   it('should return a user', async () => {
  //     const user = await controller.findOne(1);
  //     expect(user).toBeDefined();
  //     expect(user.email).toEqual('userControllerTest1@test.com');
  //     expect(user.name).toEqual('userControllerTest');
  //   });

  //   it('should throw a NotFoundException if userId not exist', async () => {
  //     try {
  //       await controller.findOne(999);
  //     } catch (e) {
  //       expect(e).toBeInstanceOf(NotFoundException);
  //       expect(e.message).toEqual('User ID 999 not found.');
  //     }
  //   });
  // });

  // describe('update', () => {
  //   const requestDto: UpdateUserDto = {
  //     email: 'controllerUpdateTest@test.com',
  //     name: 'controllerUpdateTest',
  //   };

  //   it('should update a user', async () => {
  //     await controller.update(1, requestDto);
  //     const user = await controller.findOne(1);
  //     expect(user.email).toEqual('controllerUpdateTest@test.com');
  //     expect(user.name).toEqual('controllerUpdateTest');
  //   });

  //   it('should throw a NotFoundException if userId not exist', async () => {
  //     try {
  //       await controller.update(999, requestDto);
  //     } catch (e) {
  //       expect(e).toBeInstanceOf(NotFoundException);
  //       expect(e.message).toEqual('User ID 999 not found.');
  //     }
  //   });
  // });

  // describe('delete', () => {
  //   it('should delete a user', async () => {
  //     const beforeRemove = (await controller.findAll()).length;
  //     await controller.remove(1);
  //     const afterRemove = (await controller.findAll()).length;
  //     expect(afterRemove - beforeRemove).toEqual(-1);
  //     try {
  //       await controller.remove(1);
  //     } catch (e) {
  //       expect(e).toBeInstanceOf(NotFoundException);
  //       expect(e.message).toEqual('User ID 1 not found.');
  //     }
  //   });

  //   it('should throw a NotFoundException if userId not exist', async () => {
  //     try {
  //       await controller.remove(999);
  //     } catch (e) {
  //       expect(e).toBeInstanceOf(NotFoundException);
  //       expect(e.message).toEqual('User ID 999 not found.');
  //     }
  //   });
  // });
});
