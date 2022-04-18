import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly content: string;

  @IsOptional()
  readonly published: boolean;

  @IsOptional()
  readonly authorId: number;
}
