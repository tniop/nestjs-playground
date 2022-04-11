import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
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

  describe('test', () => {
    it('should return an array of posts', async () => {
      const result = await controller.findAll();

      expect(result).toBeInstanceOf(Array);
    });
  });
});
