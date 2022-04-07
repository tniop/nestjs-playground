import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly author: string;

  @IsNumber()
  readonly publishYear: number;

  @IsOptional()
  @IsNumber()
  readonly remain: number;
}
