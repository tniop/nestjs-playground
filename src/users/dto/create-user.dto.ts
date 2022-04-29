import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ description: '이름' })
  readonly givenName: string;

  @IsString()
  @ApiProperty({ description: '성' })
  readonly familyName: string;

  @IsEmail()
  @ApiProperty({ description: 'email' })
  readonly email: string;

  @IsString()
  @ApiProperty({ description: '사진 url' })
  readonly photo: string;

  @IsString()
  @ApiProperty({ description: 'google OAuth Authorization Code' })
  readonly accessToken: string;
}
