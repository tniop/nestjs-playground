import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class CreateTokenUserDto {
  @IsString()
  @ApiProperty({ description: '이름' })
  readonly name: string;

  @IsEmail()
  @Matches(/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
  @ApiProperty({ description: 'email' })
  readonly email: string;

  @IsString()
  @ApiProperty({ description: 'google OIDC id_token' })
  readonly idToken: string;

  @IsString()
  @ApiProperty({ description: '사진 url' })
  readonly photo: string;
}
