import { Controller, UseGuards, Req, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('google'))
  @Get('google')
  @ApiOperation({ summary: 'google OAuth', description: 'google OAuth 인증' })
  @ApiCreatedResponse({ description: 'google login' })
  async signInWithGoogle(@Req() req) {}

  @UseGuards(AuthGuard('google'))
  @Get('/google/redirect')
  @ApiOperation({
    summary: 'google OAuth redirect',
    description: 'google OAuth redirect',
  })
  @ApiCreatedResponse({ description: 'google authorization access token 발급' })
  async signInWithGoogleRedirect(@Req() req) {
    return this.authService.signInWithGoogle(req);
  }
}
