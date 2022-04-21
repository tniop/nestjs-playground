import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { UserService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './posts.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

describe('PostService Unit Test', () => {
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
      providers: [PostService, PrismaService, UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
    postService = module.get<PostService>(PostService);

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
    expect(postService).toBeDefined();
  });

  describe('createPost', () => {
    it('should create a post', async () => {
      const users = await userService.getAllUsers();
      const requestDto: CreatePostDto = {
        title: 'title 01',
        content: 'content 01',
        published: true,
        authorId: users[0].id,
      };

      const beforeCreate = (await postService.getAllPosts()).length;
      const result = await postService.createPost(requestDto);
      const afterCreate = (await postService.getAllPosts()).length;
      const posts = await postService.getAllPosts();

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
        await postService.createPost(requestDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User ID 0 not found.');
      }
    });
  });

  describe('getAllPosts', () => {
    it('should return an array of posts', async () => {
      const result = await postService.getAllPosts();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getPost', () => {
    it('should return a post', async () => {
      const posts = await postService.getAllPosts();
      const result = await postService.getPost(posts[0].id);
      const users = await userService.getAllUsers();

      expect(result.id).toBeDefined();
      expect(result.title).toEqual('title 01');
      expect(result.content).toEqual('content 01');
      expect(result.published).toEqual(true);
      expect(result.authorId).toEqual(users[0].id);
    });

    it('should throw a NotFoundException if postId not exist', async () => {
      try {
        await postService.getPost(0);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Post ID 0 not found.');
      }
    });
  });

  describe('updatePost', () => {
    const requestDto: UpdatePostDto = {
      title: 'title 011',
      content: 'content 011',
      published: false,
    };

    it('should update a post', async () => {
      const posts = await postService.getAllPosts();
      const result = await postService.updatePost(posts[0].id, requestDto);

      expect(result.id).toEqual(posts[0].id);
      expect(result.title).toEqual(requestDto.title);
      expect(result.content).toEqual(requestDto.content);
      expect(result.published).toEqual(requestDto.published);
    });

    it('should throw a NotFoundException if postId not exist', async () => {
      try {
        await postService.updatePost(0, requestDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Post ID 0 not found.');
      }
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      const posts = await postService.getAllPosts();
      const beforeDelete = (await postService.getAllPosts()).length;
      await postService.deletePost(posts[0].id);
      const afterDelete = (await postService.getAllPosts()).length;

      expect(beforeDelete - afterDelete).toEqual(1);

      try {
        await postService.deletePost(posts[0].id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`Post ID ${posts[0].id} not found.`);
      }
    });

    it('should throw a NotFoundException if postId not exist', async () => {
      try {
        await postService.deletePost(0);
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

      await postService.createPost(requestDto);

      const posts = await postService.getAllPosts();
      const result = await postService.getUserByPostId(posts[0].id);

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
        await postService.getUserByPostId(0);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Post ID 0 not found.');
      }
    });
  });

  describe('getUserNameByPostId', () => {
    it('should return a post with user name', async () => {
      const users = await userService.getAllUsers();
      const posts = await postService.getAllPosts();
      const result = await postService.getUserNameByPostId(posts[0].id);

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
      await postService.getUserNameByPostId(0);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toEqual('Post ID 0 not found.');
    }
  });
});
