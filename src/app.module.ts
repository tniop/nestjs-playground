import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ViewController } from './views/view.controller';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [ViewController],
  providers: [],
})
export class AppModule {}
