import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { DBService } from 'src/db.service';

@Module({
  controllers: [BookController],
  providers: [BookService, DBService],
})
export class BookModule {}
