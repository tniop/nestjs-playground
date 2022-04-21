import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { CreatePostUserDto } from 'src/posts/dto/create-post-user.dto';
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
        email: 'test1@test.com',
        name: 'user1',
      };

      const beforeCreate = (await userService.getAllUsers()).length;
      const result = await userService.createUser(requestDto);
      const afterCreate = (await userService.getAllUsers()).length;
      const users = await userService.getAllUsers();

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

      const beforeCreate = (await userService.getAllUsers()).length;

      try {
        await userService.createUser(failRequestDto);
      } catch (e) {
        expect(e.message).toEqual('already exist email.');
        const afterCreate = (await userService.getAllUsers()).length;
        expect(beforeCreate).toEqual(afterCreate);
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
      const users = await userService.getAllUsers();
      const user = await userService.getUser(users[0].id);

      expect(user.id).toBeDefined();
      expect(user.email).toEqual('test1@test.com');
      expect(user.name).toEqual('user1');
    });

    it('should throw a NotFoundException if userId not exist', async () => {
      try {
        await userService.getUser(0);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User ID 0 not found.');
      }
    });
  });

  describe('updateUser', () => {
    const requestDto: UpdateUserDto = {
      email: 'test11@test.com',
      name: 'user11',
    };

    it('should update a user', async () => {
      const users = await userService.getAllUsers();
      const result = await userService.updateUser(users[0].id, requestDto);

      expect(result.id).toEqual(users[0].id);
      expect(result.email).toEqual(requestDto.email);
      expect(result.name).toEqual(requestDto.name);
    });

    it('should throw a NotFoundException if userId not exist', async () => {
      try {
        await userService.updateUser(0, requestDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User ID 0 not found.');
      }
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const users = await userService.getAllUsers();
      const beforeDelete = (await userService.getAllUsers()).length;
      await userService.deleteUser(users[0].id);
      const afterDelete = (await userService.getAllUsers()).length;

      expect(beforeDelete - afterDelete).toEqual(1);

      try {
        await userService.deleteUser(users[0].id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`User ID ${users[0].id} not found.`);
      }
    });

    it('should throw a NotFoundException if userId not exist', async () => {
      try {
        await userService.deleteUser(0);
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

      expect((await userService.getAllUsers()).length).toEqual(0);
      expect((await postService.getAllPosts()).length).toEqual(0);

      const result = await userService.createUserAndPosts(
        requestUserDto,
        requestPostDto,
      );

      const users = await userService.getAllUsers();
      const posts = await postService.getAllPosts();

      expect((await userService.getAllUsers()).length).toEqual(1);
      expect((await postService.getAllPosts()).length).toEqual(2);

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
      const users = await userService.getAllUsers();
      const user = await userService.getPostByUserId(users[0].id);
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

      expect(user).toEqual(tempData);
    });

    it('should throw a NotFoundException if userId not exist', async () => {
      try {
        await userService.getPostByUserId(0);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User ID 0 not found.');
      }
    });
  });

  describe('getPostTitleByUserId', () => {
    it('should return a user with posts title', async () => {
      const users = await userService.getAllUsers();
      const user = await userService.getPostTitleByUserId(users[0].id);

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

      expect(user).toEqual(tempData);
    });

    it('should throw a NotFoundException if userId not exist', async () => {
      try {
        await userService.getPostTitleByUserId(0);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User ID 0 not found.');
      }
    });
  });
});
