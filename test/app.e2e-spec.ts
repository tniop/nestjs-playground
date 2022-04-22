import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaClient } from '@prisma/client';

const testUser1 = {
  email: 'test1@test.com',
  name: 'user1',
};

const testUser2 = {
  email: 'test2@test.com',
  name: 'user2',
};

const testPost1 = {
  title: 'title 01',
  content: 'content 01',
  published: true,
};

const testPost2 = {
  title: 'title 02',
  content: 'content 02',
  published: false,
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
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
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        // whitelist: true,
        // forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await prisma.users.deleteMany({});
    await prisma.posts.deleteMany({});
  });

  describe('##### USER #####', () => {
    it('Create user', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .send(testUser1);

      expect(res.status).toBe(201);
      expect(res.body).toStrictEqual({
        id: expect.any(Number),
        email: 'test1@test.com',
        name: 'user1',
      });

      return await request(app.getHttpServer())
        .post('/users')
        .send(testUser2)
        .expect(201);
    });

    it('Get all users', async () => {
      const res = await request(app.getHttpServer()).get('/users');
      const { body } = res;

      expect(body).toStrictEqual([
        {
          id: expect.any(Number),
          email: 'test1@test.com',
          name: 'user1',
        },
        {
          id: expect.any(Number),
          email: 'test2@test.com',
          name: 'user2',
        },
      ]);
    });

    it('Update user', async () => {
      const users = await request(app.getHttpServer()).get('/users');
      const res = await request(app.getHttpServer())
        .patch(`/users/${users.body[0].id}`)
        .send({
          email: 'update@test.com',
          name: 'updateUser',
        });
      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual({
        id: expect.any(Number),
        email: 'update@test.com',
        name: 'updateUser',
      });
    });

    it('Delete user', async () => {
      const users = await request(app.getHttpServer()).get('/users');
      const res = await request(app.getHttpServer()).delete(
        `/users/${users.body[0].id}`,
      );
      expect(res.status).toBe(200);

      const afterDeleteUsers = await request(app.getHttpServer()).get('/users');
      expect(users.body.length - afterDeleteUsers.body.length).toBe(1);

      await request(app.getHttpServer()).delete(`/users/${users.body[1].id}`);
    });

    it('Create user with posts and Get them all', async () => {
      const res1 = await request(app.getHttpServer())
        .post('/users/posts')
        .send([testUser1, [testPost1, testPost2]]);
      expect(res1.status).toBe(201);

      const res2 = await request(app.getHttpServer()).get(
        `/users/posts/${res1.body.id}`,
      );
      expect(res2.status).toBe(200);
      expect(res1.body).toEqual(res2.body);
    });
  });

  describe('##### POST #####', () => {
    it('Create post', async () => {
      const user = await request(app.getHttpServer())
        .post('/users')
        .send(testUser2);
      const res = await request(app.getHttpServer())
        .post('/posts')
        .send({ ...testPost1, author_id: user.body.id });

      expect(res.status).toBe(201);
      expect(res.body).toStrictEqual({
        id: expect.any(Number),
        title: 'title 01',
        content: 'content 01',
        published: true,
        author_id: user.body.id,
      });

      return await request(app.getHttpServer())
        .post('/posts')
        .send({ ...testPost2, author_id: user.body.id })
        .expect(201);
    });

    it('Get all posts', async () => {
      const users = await request(app.getHttpServer()).get('/users');
      const { body: usersBody } = users;
      const res = await request(app.getHttpServer()).get('/posts');
      const { body } = res;

      expect([body[2], body[3]]).toStrictEqual([
        {
          id: expect.any(Number),
          title: 'title 01',
          content: 'content 01',
          published: true,
          author_id: usersBody[1].id,
        },
        {
          id: expect.any(Number),
          title: 'title 02',
          content: 'content 02',
          published: false,
          author_id: usersBody[1].id,
        },
      ]);
    });
    it('Update post', async () => {
      const posts = await request(app.getHttpServer()).get('/posts');
      const res = await request(app.getHttpServer())
        .patch(`/posts/${posts.body[0].id}`)
        .send({
          title: 'title update',
          content: 'content update',
          published: false,
        });
      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual({
        id: expect.any(Number),
        title: 'title update',
        content: 'content update',
        published: false,
        author_id: posts.body[0].author_id,
      });
    });
    it('Delete posts', async () => {
      const posts = await request(app.getHttpServer()).get('/posts');
      const res = await request(app.getHttpServer()).delete(
        `/posts/${posts.body[0].id}`,
      );
      expect(res.status).toBe(200);

      const afterDeletePosts = await request(app.getHttpServer()).get('/posts');
      expect(posts.body.length - afterDeletePosts.body.length).toBe(1);
    });
    it('Get post with user', async () => {
      const users = await request(app.getHttpServer()).get('/users');
      const posts = await request(app.getHttpServer()).get('/posts');
      const res = await request(app.getHttpServer()).get(
        `/posts/user/${posts.body[0].id}`,
      );

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual({
        id: posts.body[0].id,
        ...testPost2,
        author_id: users.body[0].id,
        author: {
          id: users.body[0].id,
          ...testUser1,
        },
      });
    });
  });
});
