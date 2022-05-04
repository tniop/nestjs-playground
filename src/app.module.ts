import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ViewController } from './views/view.controller';
import { TokenModule } from './token/token.module';

@Module({
  imports: [UsersModule, AuthModule, TokenModule],
  controllers: [ViewController],
  providers: [],
})
export class AppModule {}
