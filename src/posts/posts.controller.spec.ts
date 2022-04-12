import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostController } from './posts.controller';
import { PostService } from './posts.service';

describe('PostController', () => {
  let controller: PostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [PostService, PrismaService],
    }).compile();

    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const requestDto: CreatePostDto = {
      title: 'controller_create_test_title',
      content: 'controller_create_test_content',
      published: true,
      authorId: 1,
    };

    it('should create a post', async () => {
      const beforeCreate = (await controller.findAll()).length;
      await controller.create(requestDto);
      const afterCreate = (await controller.findAll()).length;
      expect(afterCreate).toBeGreaterThan(beforeCreate);
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
      const post = await controller.findOne(1);
      expect(post).toBeDefined();
      expect(post.id).toEqual(1);
    });

    it('should throw a NotFoundException', async () => {
      try {
        await controller.findOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Post ID 999 not found.');
      }
    });
  });

  describe('update', () => {
    const requestDto: UpdatePostDto = {
      title: 'controller_update_test_title',
      content: 'controller_update_test_content',
      published: true,
    };

    it('should update a post', async () => {
      await controller.update(2, requestDto);
      const post = controller.findOne(2);
      expect((await post).title).toEqual('controller_update_test_title');
    });

    it('should throw a NotFoundException', async () => {
      try {
        await controller.update(999, requestDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Post ID 999 not found.');
      }
    });
  });

  describe('remove', () => {
    it('delete a post ', async () => {
      const beforeDelete = (await controller.findAll()).length;
      await controller.remove(102); // db 확인
      const afterDelete = (await controller.findAll()).length;
      expect(afterDelete).toBeLessThan(beforeDelete);
    });

    it('should throw a NotFoundException', async () => {
      try {
        await controller.remove(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Post ID 999 not found.');
      }
    });
  });

  describe('getPostByUserId', () => {
    it('should return an array of posts', async () => {
      const result = await controller.getPostByUserId(1);
      expect(result).toBeInstanceOf(Array);
    });

    it('should throw a NotFoundException', async () => {
      try {
        await controller.getPostByUserId(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('User ID 999 not found.');
      }
    });
  });
});
