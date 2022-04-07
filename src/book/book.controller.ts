import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Book } from '@prisma/client';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getAll(): Promise<Book[]> {
    return this.bookService.getBooks();
  }

  @Get(':id')
  async getBookById(@Param('id') id: number): Promise<Book> {
    return this.bookService.getBook(id);
  }

  @Post()
  async createBook(@Body() bookData: CreateBookDto): Promise<Book> {
    return this.bookService.createBook(bookData);
  }

  @Put(':id')
  async updateBook(
    @Param('id') id: number,
    @Body() updateBookData: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.updateBook(id, updateBookData);
  }

  @Delete(':id')
  deleteBook(@Param('id') id: number): Promise<Book> {
    return this.bookService.deleteBook(id);
  }
}
