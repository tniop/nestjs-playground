import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './posts.service';

describe('PostService', () => {
  let service: PostService;
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
      providers: [PostService, PrismaService],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.post.deleteMany({});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('createPost', () => {
  //   const requestDto: CreatePostDto = {
  //     id: 1,
  //     title: 'service_create_test_title',
  //     content: 'service_create_test_content',
  //     published: true,
  //     authorId: 1,
  //   };

  //   const badRequestDto: CreatePostDto = {
  //     title: 'service_create_test_title',
  //     content: 'service_create_test_content',
  //     published: true,
  //     authorId: 999,
  //   };

  //   it('should create a post', async () => {
  //     const beforeCreate = (await service.getAllPosts()).length;
  //     await service.createPost(requestDto);
  //     const afterCreate = (await service.getAllPosts()).length;
  //     expect(afterCreate).toBeGreaterThan(beforeCreate);
  //   });

  //   it('should throw a NotFoundException', async () => {
  //     try {
  //       await service.createPost(badRequestDto);
  //     } catch (e) {
  //       expect(e).toBeInstanceOf(NotFoundException);
  //       expect(e.message).toEqual('User ID 999 not found.');
  //     }
  //   });
  // });

  // describe('getAllPosts', () => {
  //   it('should return an array of posts', async () => {
  //     const result = await service.getAllPosts();
  //     expect(result).toBeInstanceOf(Array);
  //   });
  // });

  // describe('getPost', () => {
  //   it('should return a post', async () => {
  //     const post = await service.getPost(1);
  //     expect(post).toBeDefined();
  //     expect(post.id).toEqual(1);
  //   });

  //   it('should throw a NotFoundException', async () => {
  //     try {
  //       await service.getPost(999);
  //     } catch (e) {
  //       expect(e).toBeInstanceOf(NotFoundException);
  //       expect(e.message).toEqual('Post ID 999 not found.');
  //     }
  //   });
  // });

  // describe('updatePost', () => {
  //   const requestDto: UpdatePostDto = {
  //     title: 'service_update_test_title',
  //     content: 'service_update_test_content',
  //     published: true,
  //   };

  //   it('should update a post', async () => {
  //     await service.updatePost(2, requestDto);
  //     const post = service.getPost(2);
  //     expect((await post).title).toEqual('service_update_test_title');
  //   });

  //   it('should throw a NotFoundException', async () => {
  //     try {
  //       await service.updatePost(999, requestDto);
  //     } catch (e) {
  //       expect(e).toBeInstanceOf(NotFoundException);
  //       expect(e.message).toEqual('Post ID 999 not found.');
  //     }
  //   });
  // });

  // describe('deletePost', () => {
  //   it('delete a post ', async () => {
  //     const beforeDelete = (await service.getAllPosts()).length;
  //     await service.deletePost(103); // db 확인
  //     const afterDelete = (await service.getAllPosts()).length;
  //     expect(afterDelete).toBeLessThan(beforeDelete);
  //   });

  //   it('should throw a NotFoundException', async () => {
  //     try {
  //       await service.deletePost(999);
  //     } catch (e) {
  //       expect(e).toBeInstanceOf(NotFoundException);
  //       expect(e.message).toEqual('Post ID 999 not found.');
  //     }
  //   });
  // });

  // describe('getPostByUserId', () => {
  //   it('should return an array of posts', async () => {
  //     const result = await service.getPostByUserId(1);
  //     expect(result).toBeInstanceOf(Array);
  //   });

  //   it('should throw a NotFoundException', async () => {
  //     try {
  //       await service.getPostByUserId(999);
  //     } catch (e) {
  //       expect(e).toBeInstanceOf(NotFoundException);
  //       expect(e.message).toEqual('User ID 999 not found.');
  //     }
  //   });
  // });
});
