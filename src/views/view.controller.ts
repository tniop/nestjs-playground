import { Controller, Get, Render } from '@nestjs/common';

@Controller('view')
export class ViewController {
  @Get()
  @Render('loginPage')
  async view() {
    return { name: 'test' };
  }
}
