import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { UserService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostController } from './posts.controller';
import { PostService } from './posts.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

describe('PostController Unit Test', () => {
  let controller: PostController;
  let userService: UserService;

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
      controllers: [PostController],
      providers: [PostService, PrismaService, UserService],
    }).compile();

    controller = module.get<PostController>(PostController);
    userService = module.get<UserService>(UserService);

    const userInit: CreateUserDto = {
      email: 'test@test.com',
      name: 'test',
    };

    await userService.createUser(userInit);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.post.deleteMany({});
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const users = await userService.getAllUsers();
      const requestDto: CreatePostDto = {
        title: 'title 01',
        content: 'content 01',
        published: true,
        authorId: users[0].id,
      };

      const beforeCreate = (await controller.findAll()).length;
      const result = await controller.create(requestDto);
      const afterCreate = (await controller.findAll()).length;
      const posts = await controller.findAll();

      expect(result.id).toEqual(posts[0].id);
      expect(result.title).toEqual(requestDto.title);
      expect(result.content).toEqual(requestDto.content);
      expect(result.published).toEqual(requestDto.published);
      expect(result.authorId).toEqual(requestDto.authorId);
      expect(afterCreate - beforeCreate).toEqual(1);
    });

    it('should throw a NotFoundException if userId not exist', async () => {
      const requestDto: CreatePostDto = {
        title: 'title 01',
        content: 'content 01',
        published: true,
        authorId: 0,
      };

      try {
        await controller.create(requestDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User ID 0 not found.');
      }
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const result = await controller.findAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('findOne', () => {
    it('should return a post', async () => {
      const posts = await controller.findAll();
      const result = await controller.findOne(posts[0].id);
      const users = await userService.getAllUsers();

      expect(result.id).toBeDefined();
      expect(result.title).toEqual('title 01');
      expect(result.content).toEqual('content 01');
      expect(result.published).toEqual(true);
      expect(result.authorId).toEqual(users[0].id);
    });

    it('should throw a NotFoundException if postId not exist', async () => {
      try {
        await controller.findOne(0);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Post ID 0 not found.');
      }
    });
  });

  describe('update', () => {
    const requestDto: UpdatePostDto = {
      title: 'title 011',
      content: 'content 011',
      published: false,
    };

    it('should update a post', async () => {
      const posts = await controller.findAll();
      const result = await controller.update(posts[0].id, requestDto);

      expect(result.id).toEqual(posts[0].id);
      expect(result.title).toEqual(requestDto.title);
      expect(result.content).toEqual(requestDto.content);
      expect(result.published).toEqual(requestDto.published);
    });

    it('should throw a NotFoundException if postId not exist', async () => {
      try {
        await controller.update(0, requestDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Post ID 0 not found.');
      }
    });
  });

  describe('remove', () => {
    it('should delete a post', async () => {
      const posts = await controller.findAll();
      const beforeDelete = (await controller.findAll()).length;
      await controller.remove(posts[0].id);
      const afterDelete = (await controller.findAll()).length;

      expect(beforeDelete - afterDelete).toEqual(1);

      try {
        await controller.remove(posts[0].id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`Post ID ${posts[0].id} not found.`);
      }
    });

    it('should throw a NotFoundException if postId not exist', async () => {
      try {
        await controller.remove(0);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Post ID 0 not found.');
      }
    });
  });

  describe('getUserByPostId', () => {
    it('should return a post with user', async () => {
      const users = await userService.getAllUsers();
      const requestDto: CreatePostDto = {
        title: 'title 02',
        content: 'content 02',
        published: true,
        authorId: users[0].id,
      };

      await controller.create(requestDto);

      const posts = await controller.findAll();
      const result = await controller.getUserByPostId(posts[0].id);

      const tempData = {
        id: posts[0].id,
        title: 'title 02',
        content: 'content 02',
        published: true,
        authorId: users[0].id,
        author: users[0],
      };

      expect(result).toEqual(tempData);
    });

    it('should throw a NotFoundException if postId not exist', async () => {
      try {
        await controller.getUserByPostId(0);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Post ID 0 not found.');
      }
    });
  });

  describe('getUserNameByPostId', () => {
    it('should return a post with user name', async () => {
      const users = await userService.getAllUsers();
      const posts = await controller.findAll();
      const result = await controller.getUserNameByPostId(posts[0].id);

      const tempData = {
        id: posts[0].id,
        title: 'title 02',
        content: 'content 02',
        published: true,
        authorId: users[0].id,
        author: { name: users[0].name },
      };

      expect(result).toEqual(tempData);
    });
  });

  it('should throw a NotFoundException if postId not exist', async () => {
    try {
      await controller.getUserNameByPostId(0);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toEqual('Post ID 0 not found.');
    }
  });
});
