import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const mockUserRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create user', () => {
    const requestDto: CreateUserDto = {
      email: 'serviceTest1@test.com', // db 확인
      name: 'serviceTest',
    };

    it('should create a user', async () => {
      userRepository.save.mockResolvedValue(requestDto);
      const result = await service.create(requestDto);
      expect(result).toEqual(requestDto);
    });
  });

  describe('findAll()', () => {
    it('should be find All', async () => {
      userRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne()', () => {
    const findOneArgs = { id: '1' };

    it('should be findOne', async () => {
      const requestDto: UpdateUserDto = {
        email: 'serviceTest@test.com',
        name: 'serviceTest',
      };
      userRepository.findOne.mockResolvedValue(requestDto);

      const result = await service.findOne(+findOneArgs.id);

      expect(result).toEqual(requestDto);
    });
  });

  describe('update()', () => {
    const findOneArgs = { id: '1' };
    const updateArgs = {
      name: 'new',
    };

    it('should be update post', async () => {
      const oldPosts = {
        email: 'serviceTest@test.com',
        name: 'serviceTest',
      };
      const newPosts = {
        email: 'serviceTest@test.com',
        name: 'new',
      };

      userRepository.findOne.mockResolvedValue(oldPosts);
      userRepository.save.mockResolvedValue(newPosts);

      const result = await service.update(+findOneArgs.id, updateArgs);
      expect(result).toEqual(newPosts);
    });
    it('should fail if no post is found', async () => {
      try {
        userRepository.findOne.mockResolvedValue(null);

        await service.findOne(+findOneArgs.id);
      } catch (e) {
        expect(e.message).toEqual('User ID 1 not found.');
      }
    });
  });

  describe('remove()', () => {
    const removeArgs = '1';

    it('should be remove post', async () => {
      userRepository.findOne.mockResolvedValue(1);
      userRepository.delete.mockResolvedValue(1);

      await service.remove(+removeArgs);
    });
  });
});
