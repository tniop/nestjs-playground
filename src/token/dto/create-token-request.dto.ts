import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTokenRequestDto {
  @IsString()
  @ApiProperty({ description: 'google OAuth Authentication id token' })
  readonly token: string;
}
