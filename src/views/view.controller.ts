import { Controller, Get, Render } from '@nestjs/common';

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
}
