import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { PostService } from '../posts/posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './users.service';

describe('UserService Unit Test', () => {
  let userService: UserService;
  let postService: PostService;

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
      providers: [UserService, PrismaService, PostService],
    }).compile();

    userService = module.get<UserService>(UserService);
    postService = module.get<PostService>(PostService);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.post.deleteMany({});
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const requestDto: CreateUserDto = {
        id: 1,
        email: 'userServiceTest1@test.com',
        name: 'userServiceTest',
      };

      expect((await userService.getAllUsers()).length).toEqual(0);
      const result = await userService.createUser(requestDto);
      expect(result).toEqual(requestDto);
      expect((await userService.getAllUsers()).length).toEqual(1);
    });

    it('should fail if user email exists', async () => {
      const failRequestDto: CreateUserDto = {
        id: 2,
        email: 'userServiceTest1@test.com',
        name: 'userServiceTest',
      };

      expect((await userService.getAllUsers()).length).toEqual(1);
      try {
        await userService.createUser(failRequestDto);
      } catch (e) {
        expect((await userService.getAllUsers()).length).toEqual(1);
      }
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const result = await userService.getAllUsers();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getUser', () => {
    it('should return a user', async () => {
      const user = await userService.getUser(1);
      expect(user.id).toBeDefined();
      expect(user.email).toEqual('userServiceTest1@test.com');
      expect(user.name).toEqual('userServiceTest');
    });

    it('should throw a NotFoundException if userId not exist', async () => {
      try {
        await userService.getUser(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User ID 999 not found.');
      }
    });
  });

  describe('updateUser', () => {
    const requestDto: UpdateUserDto = {
      id: 1,
      email: 'serviceUpdateTest@test.com',
      name: 'serviceUpdateTest',
    };

    it('should update a user', async () => {
      await userService.updateUser(1, requestDto);
      const user = await userService.getUser(1);
      expect(user.email).toEqual('serviceUpdateTest@test.com');
      expect(user.name).toEqual('serviceUpdateTest');
    });

    it('should throw a NotFoundException if userId not exist', async () => {
      try {
        await userService.updateUser(999, requestDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User ID 999 not found.');
      }
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const beforeDelete = (await userService.getAllUsers()).length;
      await userService.deleteUser(1);
      const afterDelete = (await userService.getAllUsers()).length;
      expect(afterDelete - beforeDelete).toEqual(-1);
      try {
        await userService.deleteUser(1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User ID 1 not found.');
      }
    });

    it('should throw a NotFoundException if userId not exist', async () => {
      try {
        await userService.deleteUser(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User ID 999 not found.');
      }
    });
  });

  describe('createUserAndPosts', () => {
    it('should create post by userId', async () => {
      const requestUserDto: CreateUserDto = {
        id: 1,
        email: 'userServiceTest1@test.com',
        name: 'userServiceTest',
      };

      const requestPostDto01 = {
        id: 1,
        title: 'title 01',
        content: 'content 01',
        published: true,
      };

      const requestPostDto02 = {
        id: 2,
        title: 'title 02',
        content: '',
        published: false,
      };

      const requestPostDto = [requestPostDto01, requestPostDto02];

      expect((await userService.getAllUsers()).length).toEqual(0);
      const result = await userService.createUserAndPosts(
        requestUserDto,
        requestPostDto,
      );

      expect(result).toEqual(await userService.getPostByUserId(1));
      expect((await userService.getAllUsers()).length).toEqual(1);
    });
  });
});
