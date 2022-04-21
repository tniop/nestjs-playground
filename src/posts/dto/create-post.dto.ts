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

  @IsOptional()
  @IsNumber()
  authorId: number;
}
