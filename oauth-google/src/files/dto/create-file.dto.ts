import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @ApiProperty({ description: 'file name' })
  readonly name: string;

  @IsString()
  @ApiProperty({ description: 'version' })
  readonly version: string;

  @ApiProperty({ description: 'file data' })
  readonly file: Buffer;
}
