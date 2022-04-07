import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from '@prisma/client';
import { DBService } from '../db.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(private readonly dbService: DBService) {}

  async getBooks(): Promise<Book[]> {
    const books = await this.dbService.book.findMany();
    return books;
  }

  async getBook(id: number): Promise<Book> {
    const book = await this.dbService.book.findUnique({
      where: {
        id: id,
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found.`);
    }
    return book;
  }

  async createBook(bookData: CreateBookDto): Promise<Book> {
    return await this.dbService.book.create({ data: bookData });
  }

  async updateBook(id: number, updateBookData: UpdateBookDto): Promise<Book> {
    const book = await this.dbService.book.update({
      where: {
        id: id,
      },
      data: updateBookData,
    });
    return book;
  }

  async deleteBook(id: number): Promise<Book> {
    return this.dbService.book.delete({
      where: {
        id: id,
      },
    });
  }
}
