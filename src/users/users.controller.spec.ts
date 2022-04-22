import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { CreatePostUserDto } from 'src/posts/dto/create-post-user.dto';
import { PostService } from '../posts/posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserController } from './users.controller';
import { UserService } from './users.service';

describe('UserController Unit Test', () => {
  let controller: UserController;
  let postService: PostService;

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  beforeAll(async () => {
    await prisma.users.deleteMany({});
    await prisma.posts.deleteMany({});

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, PrismaService, PostService],
    }).compile();

    controller = module.get<UserController>(UserController);
    postService = module.get<PostService>(PostService);
  });

  afterAll(async () => {
    await prisma.users.deleteMany({});
    await prisma.posts.deleteMany({});
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const requestDto: CreateUserDto = {
        email: 'test1@test.com',
        name: 'user1',
      };

      const beforeCreate = (await controller.findAll()).length;
      const result = await controller.create(requestDto);
      const afterCreate = (await controller.findAll()).length;
      const users = await controller.findAll();

      expect(result.id).toEqual(users[0].id);
      expect(result.email).toEqual(requestDto.email);
      expect(result.name).toEqual(requestDto.name);
      expect(afterCreate - beforeCreate).toEqual(1);
    });

    it('should fail if user email exists', async () => {
      const failRequestDto: CreateUserDto = {
        email: 'test1@test.com',
        name: 'user2',
      };

      const beforeCreate = (await controller.findAll()).length;

      try {
        await controller.create(failRequestDto);
      } catch (e) {
        expect(e.message).toEqual('already exist email.');
        const afterCreate = (await controller.findAll()).length;
        expect(beforeCreate).toEqual(afterCreate);
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
    it('should return a user', async () => {
      const users = await controller.findAll();
      const result = await controller.findOne(users[0].id);

      expect(result.id).toBeDefined();
      expect(result.email).toEqual('test1@test.com');
      expect(result.name).toEqual('user1');
    });

    it('should throw a NotFoundException if userId not exist', async () => {
      try {
        await controller.findOne(0);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User ID 0 not found.');
      }
    });
  });

  describe('update', () => {
    const requestDto: UpdateUserDto = {
      email: 'test11@test.com',
      name: 'user11',
    };

    it('should update a user', async () => {
      const users = await controller.findAll();
      const result = await controller.update(users[0].id, requestDto);

      expect(result.id).toEqual(users[0].id);
      expect(result.email).toEqual(requestDto.email);
      expect(result.name).toEqual(requestDto.name);
    });

    it('should throw a NotFoundException if userId not exist', async () => {
      try {
        await controller.update(0, requestDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User ID 0 not found.');
      }
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const users = await controller.findAll();
      const beforeDelete = (await controller.findAll()).length;
      await controller.remove(users[0].id);
      const afterDelete = (await controller.findAll()).length;

      expect(beforeDelete - afterDelete).toEqual(1);

      try {
        await controller.remove(users[0].id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`User ID ${users[0].id} not found.`);
      }
    });

    it('should throw a NotFoundException if userId not exist', async () => {
      try {
        await controller.remove(0);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User ID 0 not found.');
      }
    });
  });

  describe('createUserAndPosts', () => {
    it('should create post by userId', async () => {
      const requestUserDto: CreateUserDto = {
        email: 'test1@test.com',
        name: 'user1',
      };

      const requestPostDto01: CreatePostUserDto = {
        title: 'title 01',
        content: 'content 01',
        published: true,
      };

      const requestPostDto02: CreatePostUserDto = {
        title: 'title 02',
        content: '',
        published: false,
      };

      const requestPostDto: CreatePostUserDto[] = [
        requestPostDto01,
        requestPostDto02,
      ];

      expect((await controller.findAll()).length).toEqual(0);
      expect((await postService.getAllPosts()).length).toEqual(0);

      const result = await controller.createUserAndPosts([
        requestUserDto,
        requestPostDto,
      ]);

      expect((await controller.findAll()).length).toEqual(1);
      expect((await postService.getAllPosts()).length).toEqual(2);

      const users = await controller.findAll();
      const posts = await postService.getAllPosts();

      expect(result.id).toEqual(users[0].id);

      expect(requestPostDto01.title).toEqual(posts[0].title);
      expect(requestPostDto01.content).toEqual(posts[0].content);
      expect(requestPostDto01.published).toEqual(posts[0].published);

      expect(requestPostDto02.title).toEqual(posts[1].title);
      expect(requestPostDto02.content).toEqual(posts[1].content);
      expect(requestPostDto02.published).toEqual(posts[1].published);
    });
  });

  describe('getPostByUserId', () => {
    it('should return a user with posts', async () => {
      const users = await controller.findAll();
      const result = await controller.getPostByUserId(users[0].id);
      const posts = await postService.getAllPosts();

      const tempData = {
        id: users[0].id,
        email: 'test1@test.com',
        name: 'user1',
        posts: [
          {
            id: posts[0].id,
            title: 'title 01',
            content: 'content 01',
            published: true,
            authorId: users[0].id,
          },
          {
            id: posts[1].id,
            title: 'title 02',
            content: '',
            published: false,
            authorId: users[0].id,
          },
        ],
      };

      expect(result).toEqual(tempData);
    });

    it('should throw a NotFoundException if userId not exist', async () => {
      try {
        await controller.getPostByUserId(0);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User ID 0 not found.');
      }
    });
  });

  describe('getPostTitleByUserId', () => {
    it('should return a user with posts title', async () => {
      const users = await controller.findAll();
      const result = await controller.getPostTitleByUserId(users[0].id);

      const tempData = {
        id: users[0].id,
        email: 'test1@test.com',
        name: 'user1',
        posts: [
          {
            title: 'title 01',
          },
          {
            title: 'title 02',
          },
        ],
      };

      expect(result).toEqual(tempData);
    });

    it('should throw a NotFoundException if userId not exist', async () => {
      try {
        await controller.getPostTitleByUserId(0);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User ID 0 not found.');
      }
    });
  });
});
