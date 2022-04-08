import { Post } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  readonly id: number;

  @IsString() //unique설정해야함
  readonly email: string;

  @IsOptional()
  @IsNumber()
  readonly name: string;

  @IsOptional()
  readonly post: Post[];
}
