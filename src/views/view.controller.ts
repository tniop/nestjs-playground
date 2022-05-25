import { Controller, Get, Render } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('View')
@Controller()
export class ViewController {
  @Get('/login')
  @Render('loginPage')
  async getLoginPage() {
    return {};
  }

  @Get()
  @Render('main')
  async getMain() {
    return {};
  }

  @Get('/before')
  @Render('before')
  async getBefore() {
    return {};
  }
}
