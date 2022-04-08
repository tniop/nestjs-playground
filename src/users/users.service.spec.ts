import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './users.service';
import { MockContext, Context, createMockContext } from '../../context';

interface CreateUser {
  name: string;
  email: string;
  acceptTermsAndConditions: boolean;
}

export async function createUser(user: CreateUser, ctx: Context) {
  if (user.acceptTermsAndConditions) {
    return await ctx.prisma.user.create({
      data: user,
    });
  } else {
    return new Error('User must accept terms!');
  }
}

let mockCtx: MockContext;
let ctx: Context;

describe('UsersService', () => {
  let service: UserService;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('should create new user ', async () => {
    const user = {
      id: 1,
      name: 'Rich',
      email: 'hello@prisma.io',
      acceptTermsAndConditions: true,
    };
    mockCtx.prisma.user.create.mockResolvedValue(user);

    await expect(createUser(user, ctx)).resolves.toEqual({
      id: 1,
      name: 'Rich',
      email: 'hello@prisma.io',
      acceptTermsAndConditions: true,
    });
  });
});
