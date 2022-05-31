import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FilesService {
  constructor(private readonly PrismaService: PrismaService) {}

  async create(file: Express.Multer.File): Promise<CreateFileDto> {
    console.log(file);
    const temp = file.originalname.split('_');
    const name = temp[0];
    const version = temp[1].slice(0, -4);
    const files = await this.PrismaService.files.create({
      data: {
        name: name,
        version: version,
        file: file.buffer,
      },
    });
    return files;
  }
}
