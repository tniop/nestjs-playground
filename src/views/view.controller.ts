import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class ViewController {
  @Get()
  @Render('loginPage')
  async view() {
    return {};
  }
}
