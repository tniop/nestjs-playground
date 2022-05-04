import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ description: '이름' })
  readonly givenName: string;

  @IsString()
  @MaxLength(60)
  @ApiProperty({ description: '성' })
  readonly familyName: string;

  @IsEmail()
  @Matches(/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
  @ApiProperty({ description: 'email' })
  readonly email: string;

  @IsString()
  @ApiProperty({ description: ' sub' })
  readonly subId: string;

  @IsString()
  @ApiProperty({ description: '사진 url' })
  readonly photo: string;

  @IsString()
  @ApiProperty({ description: 'google OAuth Authorization Code' })
  readonly accessToken: string;
}
