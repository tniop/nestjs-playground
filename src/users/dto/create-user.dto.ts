import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly givenName: string;

  @IsString()
  readonly familyName: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly photo: string;

  @IsString()
  readonly accessToken: string;
}
