import { IsOptional, IsString } from 'class-validator';

export class CreatePostUserDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  published: boolean;
}
