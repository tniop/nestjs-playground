import { Post } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString() //unique설정해야함
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  readonly post: Post[];
}
