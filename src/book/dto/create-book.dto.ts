import { IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  readonly title: string;

  @IsNumber()
  readonly author: string;

  @IsNumber()
  readonly publishYear: number;
}
