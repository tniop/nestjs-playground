import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { CreateFileDto } from './dto/create-file.dto';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '파일 등록 API',
    description: '파일 업로드 후 저장한다.',
  })
  @ApiCreatedResponse({ description: '파일 업로드 후 저장한다.' })
  uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<CreateFileDto> {
    return this.filesService.create(file);
  }

  @Get(':id')
  async downloadFile(@Param('id') id: number, @Res() res) {
    console.log(await this.filesService.download(id));
    // return await res.download(this.filesService.download(id)+'test');
  }

  @Get()
  getFile(@Res() res): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="package.json"',
    });
    return new StreamableFile(file);
  }
}
