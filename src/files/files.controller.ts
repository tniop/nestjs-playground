import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
  Header,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { CreateFileDto } from './dto/create-file.dto';
import { Response } from 'express';

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
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<CreateFileDto> {
    const fileData = await this.filesService.create(file);
    console.log(fileData);
    return fileData;
  }

  @Get(':id')
  @ApiOperation({
    summary: '파일 다운로드 API',
    description: '파일 다운로드',
  })
  @ApiCreatedResponse({ description: '파일 다운로드' })
  async downloadFile(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<any> {
    const fileData = await this.filesService.download(id);
    console.log(fileData);
    console.log('##### ##### ##### #####');
    const fileBuffer = fileData.file;
    console.log(fileData.file);
    res.status(200).send(fileBuffer);
  }
}
