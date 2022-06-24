import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join, resolve } from 'path';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { setupSwagger } from 'src/util/swagger';
import { logger } from './middleware/logger.middleware';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(resolve('./src/public'));
  app.setBaseViewsDir(resolve('./src/views'));
  app.setViewEngine('ejs');
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      // forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(
    ['/docs'],
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );
  setupSwagger(app);
  app.use(logger); // global middleware
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  ); // global interceotor
  await app.listen(3000);
}
bootstrap();
