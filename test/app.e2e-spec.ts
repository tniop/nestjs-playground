import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  describe('/users', () => {
    it('GET 200', async () => {
      return await request(app.getHttpServer()).get('/users').expect(200);
    });

    it('POST 201', async () => {
      return await request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'e2eTest7@test.com', // db 확인
          name: 'e2eTest',
        })
        .expect(201);
    });

    it('POST 400', async () => {
      return await request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'e2eTest1@test.com',
          name: 123,
        })
        .expect(400);
    });

    it('DELETE 200', () => {
      // db 확인
      return request(app.getHttpServer()).delete('/users/47').expect(200);
    });

    it('GET 200', () => {
      return request(app.getHttpServer()).get('/users/1').expect(200);
    });

    it('GET 404', () => {
      return request(app.getHttpServer()).get('/users/999').expect(404);
    });

    it('PATCH 200', () => {
      return request(app.getHttpServer())
        .patch('/users/2')
        .send({ name: 'e2eUpdateTest' })
        .expect(200);
    });
  });

  describe('/posts', () => {
    it('GET 200', async () => {
      return await request(app.getHttpServer()).get('/posts').expect(200);
    });

    it('POST 201', async () => {
      return await request(app.getHttpServer())
        .post('/posts')
        .send({
          title: 'e2e_test_title',
          content: 'e2e_test_content',
          published: true,
          authorId: 1,
        })
        .expect(201);
    });

    it('POST 400', async () => {
      return await request(app.getHttpServer())
        .post('/posts')
        .send({
          title: 'e2e_test_title',
          content: 123,
          published: true,
          authorId: 1,
        })
        .expect(400);
    });

    it('DELETE 200', () => {
      // db 확인
      return request(app.getHttpServer()).delete('/posts/84').expect(200);
    });

    it('GET 200', () => {
      return request(app.getHttpServer()).get('/posts/1').expect(200);
    });

    it('GET 404', () => {
      return request(app.getHttpServer()).get('/posts/999').expect(404);
    });

    it('PATCH 200', () => {
      return request(app.getHttpServer())
        .patch('/posts/2')
        .send({ title: 'e2e_update_test_title' })
        .expect(200);
    });
  });
});
