import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly name: string;
}
