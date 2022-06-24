import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly name: string;
}
