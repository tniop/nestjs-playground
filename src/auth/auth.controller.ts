/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, UseGuards, Post, Req, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('google'))
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('google'))
  @Get('')
  async signInWithGoogle(@Req() req) {}

  @UseGuards(AuthGuard('google'))
  @Get('/google/redirect')
  async signInWithGoogleRedirect(@Req() req) {
    return this.authService.signInWithGoogle(req);
  }
}
