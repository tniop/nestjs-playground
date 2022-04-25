import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsBoolean()
  published: boolean;

  @IsNumber()
  @Expose({ name: 'author_id' })
  authorId: number;
}
