import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly content: string;

  @IsOptional()
  readonly published: boolean;
}
